"use client"

import type React from "react"
import Text from "./ui/Text";
import { useState, useEffect } from "react"
import {
    Card,
    Input,
    Button,
} from "@material-tailwind/react";
import { getMarketPrices } from '../api/googleShopping'
import { createMauticContact } from '../api/mautic';

type PercentOrValue = {
    type: "percent" | "value"
    amount: number
}

interface FormData {
    productName: string
    baseCost: number
    profitMargin: PercentOrValue
    operationalCosts: PercentOrValue
    creditCardFees: PercentOrValue
    taxes: number
    email: string
}

const initialFormData: FormData = {
    productName: "",
    baseCost: 0,
    profitMargin: { type: "value", amount: 0 },
    operationalCosts: { type: "value", amount: 0 },
    creditCardFees: { type: "value", amount: 0 },
    taxes: 0,
    email: "",
}

export default function IdealProductPriceCalculator() {

    const [formData, setFormData] = useState<FormData>(initialFormData)

    useEffect(() => {
        const savedData = localStorage.getItem("idealPriceCalculatorData")
        if (savedData) {
            setFormData(JSON.parse(savedData))
        }

        const params = new URLSearchParams(window.location.search)
        const urlData: Partial<FormData> = {}

        params.forEach((value, key) => {
            if (key in initialFormData) {
                if (["profitMargin", "operationalCosts", "creditCardFees"].includes(key)) {
                    urlData[key as "profitMargin" | "operationalCosts" | "creditCardFees"] = {
                        type: value.includes("%") ? "percent" : "value",
                        amount: Number.parseFloat(value) || 0,
                    }
                } else if (key === "baseCost" || key === "taxes") {
                    urlData[key] = Number.parseFloat(value) || 0
                } else if (key === "productName" || key === "email") {
                    urlData[key] = value
                }
            }
        })

        setFormData((prevData) => ({ ...prevData, ...urlData }))
    }, [])

    useEffect(() => {
        localStorage.setItem("idealPriceCalculatorData", JSON.stringify(formData))
    }, [formData])

    const formatValue = (value: string, type: "percent" | "value"): string => {
        const digits = value.replace(/\D/g, '');
        const amount = parseInt(digits) || 0;

        if (type === "value") {
            return (amount / 100).toFixed(2).replace('.', ',');
        } else {
            return (amount / 100).toFixed(2);
        }
    };

    const handleTaxesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const digits = value.replace(/\D/g, '');
        const amount = parseInt(digits) || 0;
        const formattedValue = (amount / 100).toFixed(2);

        setFormData(prevData => ({
            ...prevData,
            taxes: Number(formattedValue)
        }));
    };

    const handleBaseCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const digits = value.replace(/\D/g, '');
        const amount = parseInt(digits) || 0;
        const formattedValue = (amount / 100).toFixed(2);

        setFormData(prevData => ({
            ...prevData,
            baseCost: Number(formattedValue)
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prevData) => ({ ...prevData, [name]: value }))
    }

    const handlePercentOrValueInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        field: keyof Pick<FormData, "profitMargin" | "operationalCosts" | "creditCardFees">
    ) => {
        const { value } = e.target;
        const currentType = formData[field].type;
        const formattedValue = formatValue(value, currentType);
        const numericValue = Number(formattedValue.replace(',', '.'));

        if (!isNaN(numericValue)) {
            setFormData((prevData) => ({
                ...prevData,
                [field]: {
                    ...prevData[field],
                    amount: numericValue,
                },
            }));
        }
    };

    const handleTypeChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
        field: keyof Pick<FormData, "profitMargin" | "operationalCosts" | "creditCardFees">
    ) => {
        const newType = e.target.value as "percent" | "value";
        setFormData((prevData) => {
            let newAmount = prevData[field].amount;
            if (newType === "percent" && prevData.baseCost > 0) {
                newAmount = (prevData[field].amount / prevData.baseCost) * 100;
            } else if (newType === "value") {
                newAmount = (prevData[field].amount * prevData.baseCost) / 100;
            }

            return {
                ...prevData,
                [field]: { type: newType, amount: Number(newAmount.toFixed(2)) },
            };
        });
    };

    const calculateIdealPrice = (): number => {
        const { baseCost, profitMargin, operationalCosts, creditCardFees, taxes } = formData;

        let price = Number(baseCost);

        if (profitMargin.type === "percent") {
            price += price * (Number(profitMargin.amount) / 100);
        } else {
            price += Number(profitMargin.amount);
        }

        if (operationalCosts.type === "percent") {
            price += price * (Number(operationalCosts.amount) / 100);
        } else {
            price += Number(operationalCosts.amount);
        }

        if (creditCardFees.type === "percent") {
            price += price * (Number(creditCardFees.amount) / 100);
        } else {
            price += Number(creditCardFees.amount);
        }
        price += price * (Number(taxes) / 100);

        return typeof price === 'number' && !isNaN(price) ? Number(price.toFixed(2)) : 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("🚀 Form submission triggered");

        const idealPrice = calculateIdealPrice();
        console.log("✅ Calculated Ideal Price:", idealPrice);

        try {
            const marketPrices = await getMarketPrices(formData.productName);
            console.log("📊 Market Prices Analysis:", marketPrices);

            // Create contact in Mautic only if market prices are successfully fetched
            if (marketPrices) {
                try {
                    await createMauticContact({
                        productName: formData.productName,
                        baseCost: formData.baseCost,
                        profitMargin: formData.profitMargin.type === 'percent' ?
                            formData.profitMargin.amount :
                            (formData.profitMargin.amount / formData.baseCost) * 100,
                        operationalCosts: formData.operationalCosts.type === 'percent' ?
                            formData.operationalCosts.amount :
                            (formData.operationalCosts.amount / formData.baseCost) * 100,
                        creditCardFees: formData.creditCardFees.type === 'percent' ?
                            formData.creditCardFees.amount :
                            (formData.creditCardFees.amount / formData.baseCost) * 100,
                        taxes: formData.taxes,
                        email: formData.email,
                        idealPrice,
                        marketLowestPrice: marketPrices.lowestPrice,
                        marketMediumPrice: marketPrices.mediumPrice,
                        marketHighestPrice: marketPrices.highestPrice
                    });
                } catch (mauticError) {
                    console.error("⚠️ Mautic integration error:", mauticError);
                }
            }

            const queryParams = new URLSearchParams();
            Object.entries(formData).forEach(([key, value]) => {
                if (typeof value === "object" && "type" in value && "amount" in value) {
                    queryParams.append(key, `${value.amount}${value.type === "percent" ? "%" : ""}`);
                } else {
                    queryParams.append(key, value.toString());
                }
            });

            queryParams.append("idealPrice", idealPrice.toString());
            queryParams.append("marketLowestPrice", marketPrices.lowestPrice.toString());
            queryParams.append("marketMediumPrice", marketPrices.mediumPrice.toString());
            queryParams.append("marketHighestPrice", marketPrices.highestPrice.toString());

            const resultsUrl = `/results?${queryParams.toString()}`;
            console.log("🌍 Navigating to:", resultsUrl);
            window.location.href = resultsUrl;

        } catch (error) {
            console.error("❌ Error:", error);
            // If market prices fail, still redirect but with just the ideal price
            const queryParams = new URLSearchParams();
            Object.entries(formData).forEach(([key, value]) => {
                if (typeof value === "object" && "type" in value && "amount" in value) {
                    queryParams.append(key, `${value.amount}${value.type === "percent" ? "%" : ""}`);
                } else {
                    queryParams.append(key, value.toString());
                }
            });
            queryParams.append("idealPrice", idealPrice.toString());
            window.location.href = `/results?${queryParams.toString()}`;
        }
    };

    useEffect(() => {
    }, [formData]);
    return (
        <Card
            className="max-w-lg mx-auto p-6 rounded-lg bg-white"
            placeholder=""
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
        >
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">

                <div>
                    <Input
                        onPointerEnterCapture={() => { }}
                        onPointerLeaveCapture={() => { }}
                        size="lg"
                        type="text"
                        label="Nome do Produto"
                        placeholder="0"
                        name="productName"
                        value={formData.productName || " "}
                        onChange={handleInputChange}
                        className="focus:border-primary"
                        crossOrigin="anonymous"
                    />
                    <Text size="extra-small" color="secondary-gray" className="px-1 pt-1">Descreva o item com detalhes para melhores resultados (ex: Samsung Galaxy S21, 128GB, Preto).</Text>
                </div>
                <div>
                    <Input
                        onPointerEnterCapture={() => { }}
                        onPointerLeaveCapture={() => { }}
                        size="lg"
                        type="text"
                        label="Custo de Produção (R$)"
                        placeholder="0,00"
                        value={formData.baseCost.toFixed(2).replace('.', ',')}
                        onChange={handleBaseCostChange}
                        className="focus:border-primary"
                        crossOrigin="anonymous"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-full">
                        <Input
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                            crossOrigin="anonymous"
                            size="lg"
                            type="text"
                            label="Quanto o lucro desejado?"
                            placeholder="0,00"
                            value={formData.profitMargin.amount.toFixed(2).replace('.', ',')}
                            onChange={(e) => handlePercentOrValueInputChange(e, "profitMargin")}
                            className="focus:border-primary"
                        />
                    </div>
                    <select
                        value={formData.profitMargin.type}
                        onChange={(e) => handleTypeChange(e, "profitMargin")}
                        className="text-sm h-[44px] w-10 px-2 py-2 rounded-md border border-blue-gray-200 text-textColor min-w-[55px] focus:border-primary"
                    >
                        <option value="value">R$</option>
                        <option value="percent">%</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-full">
                        <Input
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                            crossOrigin="anonymous"
                            size="lg"
                            type="text"
                            label="Custos Operacionais"
                            placeholder="0,00"
                            value={
                                formData.operationalCosts.type === "value"
                                    ? formData.operationalCosts.amount.toFixed(2).replace('.', ',')
                                    : formData.operationalCosts.amount.toFixed(2)
                            }
                            onChange={(e) => handlePercentOrValueInputChange(e, "operationalCosts")}
                            className="focus:border-primary"
                        />
                    </div>
                    <select
                        value={formData.operationalCosts.type}
                        onChange={(e) => handleTypeChange(e, "operationalCosts")}
                        className="text-sm h-[44px] w-10 px-2 py-2 rounded-md border border-blue-gray-200 text-textColor min-w-[55px] focus:border-primary"
                    >
                        <option value="value">R$</option>
                        <option value="percent">%</option>
                    </select>

                </div>

                <div className="flex items-center gap-2">
                    <div className="w-full">
                        <Input
                            onPointerEnterCapture={() => { }}
                            onPointerLeaveCapture={() => { }}
                            crossOrigin="anonymous"
                            size="lg"
                            type="text"
                            label="Taxa do Cartão"
                            placeholder="0.00"
                            value={
                                formData.creditCardFees.type === "value"
                                    ? formData.creditCardFees.amount.toFixed(2).replace('.', ',')
                                    : formData.creditCardFees.amount.toFixed(2)
                            }
                            onChange={(e) => handlePercentOrValueInputChange(e, "creditCardFees")}
                            className="focus:border-primary"
                        />
                    </div>
                    <select
                        value={formData.creditCardFees.type}
                        onChange={(e) => handleTypeChange(e, "creditCardFees")}
                        className="text-sm h-[44px] w-10 px-2 py-2 rounded-md border border-blue-gray-200 text-textColor min-w-[55px] focus:border-primary"
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
                        type="text"
                        label="Impostos (%)"
                        placeholder="0.00"
                        name="taxes"
                        value={formData.taxes.toFixed(2)}
                        onChange={handleTaxesChange}
                        className="focus:border-primary"
                        crossOrigin="anonymous"
                    />
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
                        className="focus:border-primary"
                        crossOrigin="anonymous"
                    />
                </div>
                <Button
                    placeholder=""
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                    type="submit"
                    className="w-full h-11 mt-6 bg-[#2DD1AC] text-white font-bold py-2 px-4 rounded hover:bg-opacity-80"
                >
                    Ver Resultado
                </Button>
            </form>
        </Card>
    );
}