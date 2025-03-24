"use client"

import type React from "react";
import Text from "./ui/Text";
import { useState, useEffect } from "react";
import { Card, Input, Button, Select, Option, Tooltip } from "@material-tailwind/react";
import { getMarketPrices } from "../api/googleShopping";
import { createMauticContact } from "../api/mautic";

type PercentOrValue = {
    type: "percent" | "value";
    amount: number;
};

interface FormData {
    productName: string;
    baseCost: number;
    profitMargin: PercentOrValue;
    email: string;
    businessSegment: string;
    marketLowestPrice?: number | string;
    marketMediumPrice?: number | string;
    marketHighestPrice?: number | string;
}

const initialFormData: FormData = {
    productName: "",
    baseCost: 0,
    profitMargin: { type: "value", amount: 0 },
    email: "",
    businessSegment: "",
};

const BUSINESS_SEGMENTS: {
    [category: string]: {
        [segment: string]: { low: number; high: number };
    };
} = {
    "Alimentação e Bebidas": {
        "Restaurantes e lanchonetes": { low: 150, high: 200 },
        "Bares e cafés": { low: 200, high: 300 },
        "Venda de alimentos caseiros e delivery": { low: 150, high: 250 },
    },
    "Moda e Acessórios": {
        "Lojas de roupas e calçados": { low: 100, high: 200 },
        "Brechós e roupas de segunda mão": { low: 150, high: 250 },
        "Artesanato e bijuterias": { low: 200, high: 300 },
    },
    "Varejo e Comércio Geral": {
        "Mercadinhos e minimercados": { low: 30, high: 50 },
        "Lojas de conveniência": { low: 50, high: 100 },
        "Papelarias e bazares": { low: 50, high: 100 },
    },
    "Beleza e Bem-estar": {
        "Salões de beleza e barbearias": { low: 100, high: 200 },
        "Estúdios de manicure e estética": { low: 150, high: 250 },
        "Venda de cosméticos e perfumaria": { low: 100, high: 200 },
    },
    "Serviços": {
        "Assistência técnica": { low: 100, high: 200 },
        "Serviços de limpeza e manutenção": { low: 100, high: 200 },
        "Lavanderias": { low: 100, high: 200 },
    },
    "Tecnologia e Eletrônicos": {
        "Lojas de acessórios para celulares": { low: 50, high: 100 },
        "Venda e manutenção de eletrônicos": { low: 50, high: 100 },
        "Informática e suprimentos": { low: 50, high: 100 },
    },
    "Casa e Decoração": {
        "Lojas de móveis e decoração": { low: 100, high: 200 },
        "Itens para organização e utilidades domésticas": { low: 50, high: 100 },
        "Materiais de construção e bricolagem": { low: 30, high: 50 },
    },
    "Saúde e Bem-estar": {
        "Farmácias e produtos naturais": { low: 30, high: 50 },
        "Academias e estúdios de yoga/pilates": { low: 100, high: 200 },
        "Venda de suplementos": { low: 50, high: 100 },
    },
    "Entretenimento e Cultura": {
        "Livrarias e sebos": { low: 50, high: 100 },
        "Lojas de brinquedos e jogos": { low: 50, high: 100 },
        "Papelarias e artigos para festas": { low: 50, high: 100 },
    },
    "Transporte e Mobilidade": {
        "Autopeças e acessórios": { low: 50, high: 100 },
        "Oficinas mecânicas e bicicletarias": { low: 50, high: 100 },
    },
};

export default function IdealProductPriceCalculator() {
    const [formData, setFormData] = useState<FormData>(initialFormData);

    const getSegmentMargins = (segment: string) => {
        for (const category of Object.values(BUSINESS_SEGMENTS)) {
            if (segment in category) {
                return category[segment];
            }
        }
        return { low: 0, high: 0 };
    };

    const calculateExtendedData = () => {
        const margins = getSegmentMargins(formData.businessSegment);
        const recommendedMargin = (margins.low + margins.high) / 2;
        const baseCostWithLowMargin = formData.baseCost + (formData.baseCost * margins.low / 100);
        const baseCostWithHighMargin = formData.baseCost + (formData.baseCost * margins.high / 100);
        const idealPrice = calculateIdealPrice();
        const recommendedProfitValue = formData.baseCost * (recommendedMargin / 100);

        return {
            ...formData,
            marketLowestPrice: formData.marketLowestPrice,
            marketMediumPrice: formData.marketMediumPrice,
            marketHighestPrice: formData.marketHighestPrice,
            idealPrice,
            baseCostWithLowMargin,
            baseCostWithHighMargin,
            segmentMargins: margins,
            recommendedMargin,
            recommendedProfitValue,
        };
    };

    useEffect(() => {
        const savedData = localStorage.getItem("idealPriceCalculatorData");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setFormData({
                productName: parsed.productName || "",
                baseCost: parsed.baseCost || 0,
                profitMargin: parsed.profitMargin || { type: "value", amount: 0 },
                email: parsed.email || "",
                businessSegment: parsed.businessSegment || "",
                marketLowestPrice: parsed.marketLowestPrice,
                marketMediumPrice: parsed.marketMediumPrice,
                marketHighestPrice: parsed.marketHighestPrice,
            });
        }
        const params = new URLSearchParams(window.location.search);
        const urlData: Partial<FormData> = {};
        const allowedKeys: (keyof FormData)[] = [
            "productName",
            "baseCost",
            "email",
            "businessSegment",
        ];
        params.forEach((value, key) => {
            if (allowedKeys.includes(key as keyof FormData)) {
                if (key === "baseCost") {
                    urlData.baseCost = parseFloat(value) || 0;
                } else {
                    urlData[key as "productName" | "email" | "businessSegment"] = value;
                }
            }
        });
        setFormData((prev) => ({ ...prev, ...urlData }));
    }, []);

    useEffect(() => {
        localStorage.setItem("idealPriceCalculatorData", JSON.stringify(calculateExtendedData()));
    }, [formData]);

    const formatValue = (value: string, type: "percent" | "value"): string => {
        const digits = value.replace(/\D/g, "");
        const amount = parseInt(digits) || 0;
        return type === "value"
            ? (amount / 100).toFixed(2).replace(".", ",")
            : (amount / 100).toFixed(2);
    };

    const handleBaseCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "");
        const amount = parseInt(digits) || 0;
        const formatted = (amount / 100).toFixed(2);
        setFormData((prev) => ({ ...prev, baseCost: Number(formatted) }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePercentOrValueInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { value } = e.target;
        const currentType = formData.profitMargin.type;
        const formatted = formatValue(value, currentType);
        const numericValue = Number(formatted.replace(",", "."));
        if (!isNaN(numericValue)) {
            setFormData((prev) => ({
                ...prev,
                profitMargin: { ...prev.profitMargin, amount: numericValue },
            }));
        }
    };

    const handleBusinessSegmentChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const segment = e.target.value;
        setFormData((prev) => {
            let newProfit = prev.profitMargin;
            for (const category of Object.values(BUSINESS_SEGMENTS)) {
                if (segment in category) {
                    const { low, high } = category[segment];
                    const averageMargin = (low + high) / 2;
                    newProfit = {
                        type: "percent",
                        amount: averageMargin
                    };
                    break;
                }
            }
            return { ...prev, businessSegment: segment, profitMargin: newProfit };
        });
    };

    const calculateIdealPrice = (): number => {
        const { baseCost, profitMargin } = formData;
        let price = baseCost;
        if (profitMargin.type === "percent") {
            price += baseCost * (profitMargin.amount / 100);
        } else {
            price += profitMargin.amount;
        }
        return Number(price.toFixed(2));
    };

    // Updated parser to extract numeric part only.
    const parsePrice = (priceStr: string): number => {
        const match = priceStr.match(/[\d.,]+/);
        if (!match) return 0;
        return parseFloat(match[0].replace(/\./g, "").replace(",", "."));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const idealPrice = calculateIdealPrice();
        const queryParams = new URLSearchParams();

        // Add basic parameters first
        queryParams.append("productName", formData.productName);
        queryParams.append("baseCost", formData.baseCost.toString());
        queryParams.append(
            "profitMargin",
            `${formData.profitMargin.amount}${formData.profitMargin.type === "percent" ? "%" : ""}`
        );
        queryParams.append("email", formData.email);
        queryParams.append("businessSegment", formData.businessSegment);
        queryParams.append("idealPrice", idealPrice.toString());

        try {
            const marketPrices = await getMarketPrices(formData.productName);

            if (marketPrices && marketPrices.lowestPriceProduct) {
                const products = [
                    marketPrices.lowestPriceProduct,
                    marketPrices.mediumPriceProduct,
                    marketPrices.highestPriceProduct,
                ];

                const sortedProducts = products.sort(
                    (a, b) => parsePrice(a.price) - parsePrice(b.price)
                );

                const newMarketData = {
                    lowestPriceProduct: sortedProducts[0],
                    mediumPriceProduct: sortedProducts[1],
                    highestPriceProduct: sortedProducts[2],
                };

                localStorage.setItem("marketProductsData", JSON.stringify(newMarketData));

                // Fix: Ensure market prices are added to query params with numeric values
                const lowestPrice = parsePrice(sortedProducts[0].price);
                const mediumPrice = parsePrice(sortedProducts[1].price);
                const highestPrice = parsePrice(sortedProducts[2].price);

                queryParams.set("marketLowestPrice", lowestPrice.toString());
                queryParams.set("marketMediumPrice", mediumPrice.toString());
                queryParams.set("marketHighestPrice", highestPrice.toString());

                await createMauticContact({
                    email: formData.email,
                    productName: formData.productName,
                    idealPrice,
                    baseCost: formData.baseCost,
                    profitMargin: formData.profitMargin.amount,
                    marketLowestPrice: lowestPrice,
                    marketMediumPrice: mediumPrice,
                    marketHighestPrice: highestPrice
                });
            }

            window.location.href = `/results?${queryParams.toString()}`;
        } catch (error) {
            console.error("Error in form submission:", error);
            window.location.href = `/results?${queryParams.toString()}`;
        }
    };

    return (
        <Card
            className="max-w-lg mx-auto p-6 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
            placeholder=""
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
        >
            <Text
                color="kyte-gray"
                align="left-all"
                size="extra-large"
                className="font-semibold mb-4"
            >
                Preencha as informações e descubra o passo a passo para
                vender mais e melhor que seus concorrentes
            </Text>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="relative">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Input
                                onPointerEnterCapture={() => { }}
                                onPointerLeaveCapture={() => { }}
                                size="lg"
                                type="text"
                                label="Nome do Produto"
                                placeholder="Ex: Samsung Galaxy S21"
                                name="productName"
                                value={formData.productName || " "}
                                onChange={handleInputChange}
                                color="teal"
                                crossOrigin="anonymous"
                            />
                            <Tooltip
                                content="Digite o nome completo do item com especificações. Quanto mais detalhes, melhor os resultados."
                                placement="top"
                                className="bg-white text-gray02 p-2 shadow-lg rounded"
                                trigger="hover click"
                            >
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <img
                                        src="/images/info-icon.svg"
                                        alt="info"
                                        width={15}
                                        height={15}
                                    />
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Input
                                onPointerEnterCapture={() => { }}
                                onPointerLeaveCapture={() => { }}
                                size="lg"
                                type="text"
                                label="Preço de custo (R$)"
                                placeholder="0,00"
                                value={formData.baseCost.toFixed(2).replace(".", ",")}
                                onChange={handleBaseCostChange}
                                color="teal"
                                crossOrigin="anonymous"
                            />
                            <Tooltip
                                content="Insira o valor pago pelo produto ou gasto para ser fabricado."
                                placement="top"
                                className="bg-white text-gray02 p-2 shadow-lg rounded"
                                trigger="hover click"
                            >
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <img
                                        src="/images/info-icon.svg"
                                        alt="info"
                                        width={15}
                                        height={15}
                                    />
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                <div>
                    <Select
                        placeholder=""
                        onPointerEnterCapture={() => { }}
                        onPointerLeaveCapture={() => { }}
                        size="lg"
                        label="Área de atuação"
                        value={formData.businessSegment}
                        onChange={(value) => handleBusinessSegmentChange({ target: { value } } as any)}
                        color="teal"
                    >
                        {Object.entries(BUSINESS_SEGMENTS).map(([category, segments]) => [
                            <Option key={`category-${category}`} value="" className="font-semibold bg-gray-100" disabled>
                                {category}
                            </Option>,
                            ...Object.entries(segments).map(([name]) => (
                                <Option key={name} value={name} className="pl-4">
                                    {name}
                                </Option>
                            ))
                        ]).flat()}
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-full relative">
                        <Input
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                            size="lg"
                            type="text"
                            label="Lucro ideal estimado (R$ ou %)"
                            placeholder="0,00"
                            value={
                                formData.profitMargin?.type === "value"
                                    ? (formData.profitMargin?.amount || 0).toFixed(2).replace(".", ",")
                                    : (formData.profitMargin?.amount || 0).toFixed(2)
                            }
                            onChange={handlePercentOrValueInputChange}
                            color="teal"
                            crossOrigin="anonymous"
                        />
                        <Tooltip
                            content="Aqui calculamos a margem de lucro ideal para o seu produto com base no segmento de mercado selecionado. Você pode alterar para um valor fixo ou um percentual."
                            placement="top"
                            className="bg-white text-gray02 p-2 shadow-lg rounded"
                            trigger="hover click"
                        >
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                                onClick={(e) => e.preventDefault()}
                            >
                                <img
                                    src="/images/info-icon.svg"
                                    alt="info"
                                    width={15}
                                    height={15}
                                />
                            </button>
                        </Tooltip>
                    </div>
                    <select
                        value={formData.profitMargin.type}
                        onChange={(e) => {
                            const newType = e.target.value as "percent" | "value";
                            setFormData((prev) => {
                                let newAmount = prev.profitMargin.amount;
                                if (newType === "value" && prev.profitMargin.type === "percent") {
                                    // Convert percentage to actual value based on base cost
                                    newAmount = (prev.baseCost * (prev.profitMargin.amount / 100));
                                } else if (newType === "percent" && prev.profitMargin.type === "value") {
                                    // Convert value to percentage, but only if base cost is not zero
                                    newAmount = prev.baseCost > 0
                                        ? (prev.profitMargin.amount / prev.baseCost) * 100
                                        : 0;
                                }
                                return {
                                    ...prev,
                                    profitMargin: {
                                        type: newType,
                                        amount: Number(newAmount.toFixed(2))
                                    }
                                };
                            });
                        }}
                        className="text-sm h-[44px] w-16 px-2 py-2 rounded-md border border-blue-gray-200 text-textColor min-w-[64px] focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    >
                        <option value="value">R$</option>
                        <option value="percent">%</option>
                    </select>
                </div>
                <div>
                    <Input
                        onPointerEnterCapture={() => { }}
                        onPointerLeaveCapture={() => { }}
                        size="lg"
                        type="email"
                        label="Seu E-mail"
                        placeholder="seu@email.com"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        color="teal"
                        crossOrigin="anonymous"
                    />
                </div>
                <Button
                    placeholder=""
                    type="submit"
                    className="w-full h-11 mt-6 bg-green03 text-white font-bold py-2 px-4 rounded hover:bg-opacity-80"
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                >
                    Ver Resultado
                </Button>
            </form>
        </Card>
    );
}
