"use client"

import type React from "react";
import { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react/components/Card";
import { Input } from "@material-tailwind/react/components/Input";
import Heading3 from "../components/ui/Heading3";
import Heading4 from "../components/ui/Heading4";
import Text from "../components/ui/Text";

interface BulkCalculatorProps {
    marketMediumPrice?: number;
    baseCost?: number;
}

const BulkCalculator: React.FC<BulkCalculatorProps> = ({
    marketMediumPrice = 0,
    baseCost = 0,
}) => {
    // Obter valores da URL, similar ao Chart.tsx e ProductList.tsx
    const [urlParams, setUrlParams] = useState<URLSearchParams | null>(null);

    useEffect(() => {
        // Só executa no cliente
        if (typeof window !== 'undefined') {
            setUrlParams(new URLSearchParams(window.location.search));
        }
    }, []);

    // Usar valores da URL ou props
    const urlMarketMediumPrice = urlParams ? parseFloat(urlParams.get("marketMediumPrice") || "0") : 0;
    const urlBaseCost = urlParams ? parseFloat(urlParams.get("baseCost") || "0") : 0;

    // Priorizar valores da URL sobre props
    const [unitPrice, setUnitPrice] = useState(0);
    const [costPerUnit, setCostPerUnit] = useState(0);
    const [bulkQuantity, setBulkQuantity] = useState(20);
    const [discountPercentage, setDiscountPercentage] = useState(10);

    // Atualizar os valores quando os parâmetros da URL estiverem disponíveis
    useEffect(() => {
        if (urlParams) {
            setUnitPrice(urlMarketMediumPrice || marketMediumPrice);
            setCostPerUnit(urlBaseCost || baseCost);
        }
    }, [urlParams, urlMarketMediumPrice, urlBaseCost, marketMediumPrice, baseCost]);

    const [calculations, setCalculations] = useState({
        discountedPrice: 0,
        profitPerUnit: 0,
        totalProfit: 0,
        marginPercentage: 0,
    });

    useEffect(() => {
        const debounce = setTimeout(() => {
            if (unitPrice && costPerUnit && bulkQuantity && discountPercentage) {
                const discountedPrice = unitPrice * (1 - discountPercentage / 100);
                const profitPerUnit = discountedPrice - costPerUnit;
                const totalProfit = profitPerUnit * bulkQuantity;
                const marginPercentage = (profitPerUnit / discountedPrice) * 100;

                setCalculations({
                    discountedPrice,
                    profitPerUnit,
                    totalProfit,
                    marginPercentage,
                });
            }
        }, 300);

        return () => clearTimeout(debounce);
    }, [unitPrice, costPerUnit, bulkQuantity, discountPercentage]);

    const getResultStyle = () => {
        const { profitPerUnit, marginPercentage } = calculations;
        if (profitPerUnit <= 0) return 'bg-[#FF4E4E] text-white';
        if (marginPercentage < 20) return 'bg-[#F5A623] text-white';
        return 'bg-[#2FAE94] text-white';
    };

    const getResultText = () => {
        const { profitPerUnit, marginPercentage } = calculations;
        if (profitPerUnit <= 0) return 'Atenção: você terá prejuízo por unidade vendida.';
        if (marginPercentage < 20) return 'Tenha atenção: sua margem está abaixo de 20%.';
        return 'É um desconto seguro.';
    };

    return (
        <div className="w-full max-w-3xl mx-auto pt-6">
            <Heading3 color="kyte-gray" align="left-mobile">Veja quanto desconto você pode dar sem perder lucro
            </Heading3>
            <Text size="extra-large" color="kyte-gray" align="left-mobile">Preencha os campos abaixo. O resultado aparece na hora.</Text>
            <br />
            <br />
            <div className="space-y-4">
                <div className="relative w-full min-w-[200px] h-10 mb-4">
                    <input
                        className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-teal-500"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(Number(e.target.value))}
                        type="number"
                        placeholder=" "
                    />
                    <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-teal-500 peer-focus:text-teal-500 before:border-teal-500 peer-focus:before:!border-teal-500 after:border-teal-500 peer-focus:after:!border-teal-500">
                        Preço por unidade (R$)
                    </label>
                </div>

                <Input
                    crossOrigin={undefined}
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                    label="Custo por unidade (R$)"
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(Number(e.target.value))}
                    color="teal"
                    type="number"
                />

                <Input
                    crossOrigin={undefined}
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                    label="Quantidade mínima"
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(Number(e.target.value))}
                    color="teal"
                    type="number"
                />

                <Input
                    crossOrigin={undefined}
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                    label="Percentual de desconto (%)"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                    color="teal"
                    type="number"
                    min={0}
                    max={50}
                />
            </div>

            {unitPrice > 0 && costPerUnit > 0 && bulkQuantity > 0 && (
                <Card
                    className={`mt-6 p-5 ${getResultStyle()}`}
                    placeholder={undefined}
                    onPointerEnterCapture={() => { }}
                    onPointerLeaveCapture={() => { }}
                >
                    <Text size="large" color="white" align="left-all">
                        Com essas condições, seu lucro será:
                    </Text>
                    <br></br>
                    <div className="flex justify-between items-center mb-2">
                        <Text size="medium" color="white" align="left-all">
                            <span style={{ fontWeight: 600 }}>
                                Preço com desconto
                            </span>
                        </Text>
                        <Text size="medium" color="white" align="left-all" >
                            R$ {calculations.discountedPrice.toFixed(2)}
                        </Text>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <Text size="medium" color="white" align="left-all">
                            <span style={{ fontWeight: 600 }}>
                                Lucro por unidade
                            </span>
                        </Text>
                        <Text size="medium" color="white" align="left-all" >
                            R$ {calculations.profitPerUnit.toFixed(2)}
                        </Text>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <Text size="medium" color="white" align="left-all">
                            <span style={{ fontWeight: 600 }}>
                                Margem de lucro
                            </span>
                        </Text>
                        <Text size="medium" color="white" align="left-all" >
                            {calculations.marginPercentage.toFixed(1)}%
                        </Text>
                    </div>
                    <br></br>
                    <Text size="medium" color="white" align="left-all">
                        Se você vender <span style={{ fontWeight: 600 }}> {bulkQuantity} </span> unidades com
                        <span style={{ fontWeight: 600 }}> {discountPercentage}% </span> de desconto, você terá R$
                        <span style={{ fontWeight: 600 }}> {calculations.profitPerUnit.toFixed(2)} </span> de lucro por unidade.
                        <span style={{ fontWeight: 600 }}> {getResultText()} </span>
                    </Text>
                </Card>
            )}

            <a
                href="https://kyteapp.com/loading"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center my-6 text-[#2dd1ac] hover:underline"
            >
                Vender estes produtos no Kyte
            </a>
        </div>
    );
};

export default BulkCalculator;