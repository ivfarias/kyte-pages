"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react/components/Card";
import { Input } from "@material-tailwind/react/components/Input";
import Heading3 from "../components/ui/Heading3";
import Text from "../components/ui/Text";
import RedirectCheckout from "../components/ui/RedirectCheckout";

interface BulkCalculatorProps {
    marketMediumPrice?: number;
    baseCost?: number;
    heading: string;
    subheading: string;
    unitPriceLabel: string;
    costPerUnitLabel: string;
    bulkQuantityLabel: string;
    discountPercentageLabel: string;
    cardTitle: string;
    discountedPriceLabel: string;
    profitPerUnitLabel: string;
    marginLabel: string;
    currencySymbol: string;
    summaryTemplateText?: string;
    resultTexts?: {
        loss: string;
        lowMargin: string;
        safe: string;
    };
    showCheckoutRedirect?: boolean;
    redirectProps?: {
        buttonText?: string;
        redirectUrl?: string;
        os: string;
        flow: string;
        app: string;
        lang: string;
        recurrence: string;
        plan: string;
        variant?: "primary" | "secondary";
    };
    ctaText?: string;
    ctaLink?: string;
}

const BulkCalculator: React.FC<BulkCalculatorProps> = ({
    marketMediumPrice = 0,
    baseCost = 0,
    heading,
    subheading,
    unitPriceLabel,
    costPerUnitLabel,
    bulkQuantityLabel,
    discountPercentageLabel,
    cardTitle,
    discountedPriceLabel,
    profitPerUnitLabel,
    marginLabel,
    currencySymbol,
    summaryTemplateText,
    resultTexts,
    showCheckoutRedirect = false,
    redirectProps,
    ctaText = "",
    ctaLink = "#",
}) => {
    const [unitPrice, setUnitPrice] = useState(0);
    const [costPerUnit, setCostPerUnit] = useState(0);
    const [bulkQuantity, setBulkQuantity] = useState(20);
    const [discountPercentage, setDiscountPercentage] = useState(10);

    useEffect(() => {
        setUnitPrice(marketMediumPrice);
        setCostPerUnit(baseCost);
    }, [marketMediumPrice, baseCost]);

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
        if (profitPerUnit <= 0) return "bg-[#FF4E4E] text-white";
        if (marginPercentage < 20) return "bg-[#F5A623] text-white";
        return "bg-[#2FAE94] text-white";
    };

    const getResultText = () => {
        const { profitPerUnit, marginPercentage } = calculations;
        const texts = resultTexts || {
            loss: "You will have a loss per unit sold.",
            lowMargin: "Be careful: your margin is below 20%.",
            safe: "This is a safe discount.",
        };

        if (profitPerUnit <= 0) return texts.loss;
        if (marginPercentage < 20) return texts.lowMargin;
        return texts.safe;
    };

    const renderSummary = () => {
        if (summaryTemplateText) {
            return summaryTemplateText
                .replace("{bulkQuantity}", bulkQuantity.toString())
                .replace("{discountPercentage}", discountPercentage.toString())
                .replace("{profitPerUnit}", calculations.profitPerUnit.toFixed(2))
                .replace("{currencySymbol}", currencySymbol)
                .replace("{resultText}", getResultText());
        }

        return `If you sell ${bulkQuantity} units with ${discountPercentage}% discount, you will have ${currencySymbol} ${calculations.profitPerUnit.toFixed(
            2
        )} profit per unit. ${getResultText()}`;
    };

    return (
        <div className="w-full max-w-3xl mx-auto pt-6">
            <Heading3 color="kyte-gray" align="left-mobile">
                {heading}
            </Heading3>
            <Text size="extra-large" color="kyte-gray" align="left-mobile">
                {subheading}
            </Text>
            <br />
            <br />
            <div className="space-y-4">
                <Input
                    crossOrigin={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    label={unitPriceLabel}
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    color="teal"
                    type="number"
                />
                <Input
                    crossOrigin={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    label={costPerUnitLabel}
                    value={costPerUnit}
                    onChange={(e) => setCostPerUnit(Number(e.target.value))}
                    color="teal"
                    type="number"
                />
                <Input
                    crossOrigin={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    label={bulkQuantityLabel}
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(Number(e.target.value))}
                    color="teal"
                    type="number"
                />
                <Input
                    crossOrigin={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    label={discountPercentageLabel}
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
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                >
                    <Text size="large" color="white" align="left-all">
                        {cardTitle}
                    </Text>
                    <br />
                    <div className="flex justify-between items-center mb-2">
                        <Text size="medium" color="white" align="left-all">
                            <span style={{ fontWeight: 600 }}>{discountedPriceLabel}</span>
                        </Text>
                        <Text size="medium" color="white" align="left-all">
                            {currencySymbol} {calculations.discountedPrice.toFixed(2)}
                        </Text>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <Text size="medium" color="white" align="left-all">
                            <span style={{ fontWeight: 600 }}>{profitPerUnitLabel}</span>
                        </Text>
                        <Text size="medium" color="white" align="left-all">
                            {currencySymbol} {calculations.profitPerUnit.toFixed(2)}
                        </Text>
                    </div>

                    <div className="flex justify-between items-center mb-2">
                        <Text size="medium" color="white" align="left-all">
                            <span style={{ fontWeight: 600 }}>{marginLabel}</span>
                        </Text>
                        <Text size="medium" color="white" align="left-all">
                            {calculations.marginPercentage.toFixed(1)}%
                        </Text>
                    </div>
                    <br />
                    <Text size="medium" color="white" align="left-all">
                        {renderSummary()}
                    </Text>
                </Card>
            )}

            {showCheckoutRedirect && redirectProps ? (
                <div className="w-full max-w-3xl mx-auto flex justify-center mt-2">
                    <RedirectCheckout {...redirectProps} />
                </div>
            ) : (
                <a
                    href={ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center my-6 text-[#2dd1ac] hover:underline"
                >
                    {ctaText}
                </a>
            )}
        </div>
    );
};

export default BulkCalculator;