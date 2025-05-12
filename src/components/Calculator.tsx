"use client"

import type React from "react";
import Text from "./ui/Text";
import { useState, useEffect } from "react";
import { Card } from "@material-tailwind/react/components/Card";
import { Input } from "@material-tailwind/react/components/Input";
import { Button } from "@material-tailwind/react/components/Button";
import { Select, Option } from "@material-tailwind/react/components/Select";
import { Tooltip } from "@material-tailwind/react/components/Tooltip";
import { getMarketPrices } from "../api/googleShopping";
import { createMauticContact } from "../api/mautic";
import { getUserLocation } from "../utils/geolocation";
import { currencyMap } from "../data/currencyData";
import { ProgressLabelOutside } from "./ProgressBar";

declare global {
    interface Window {
        dataLayer: any[];
    }
}

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
    country?: string;
    region?: string;
    city?: string;
    language?: string;
    currencySymbol?: string;
}

interface BusinessSegmentsType {
    [category: string]: {
        [segment: string]: { low: number; high: number };
    };
}
interface StepData {
    title: string;
    description: string;
}

interface StepDescriptions {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    complete: string;
}

interface LocalizationData {
    calculatorSteps: StepData[];
    stepDescriptions: StepDescriptions;
    completionText: string;
}

interface CalculatorProps {
    localizationData?: LocalizationData;

    // Business segments data path and configuration
    businessSegmentsData: BusinessSegmentsType;

    // Currency configuration
    currencySymbol: string;
    currencyCode: string;
    defaultCountry: string;
    defaultLanguage: string;
    autoDetectLocation?: boolean;

    // Form header and description
    headerText: string;

    // Form field labels and placeholders
    productNameLabel: string;
    productNamePlaceholder: string;
    productNameTooltip: string;
    productNameAriaLabel: string;

    baseCostLabel: string;
    baseCostPlaceholder: string;
    baseCostTooltip: string;
    baseCostAriaLabel: string;

    businessSegmentLabel: string;

    profitMarginLabel: string;
    profitMarginTooltip: string;

    emailLabel: string;
    emailPlaceholder: string;

    // Button text
    submitButtonText: string;
    processingButtonText: string;

    // Alert messages
    requiredFieldsAlert: string;
    invalidEmailAlert: string;

    // Results paths
    plgResultsPath: string;
    slgResultsPath: string;
}

const initialFormData: FormData = {
    productName: "",
    baseCost: 0,
    profitMargin: { type: "value", amount: 0 },
    email: "",
    businessSegment: "",
    currencySymbol: "",
};

const defaultProps: CalculatorProps = {
    businessSegmentsData: {},
    currencySymbol: "R$",
    currencyCode: "BRL",
    defaultCountry: "Brazil",
    defaultLanguage: "pt-br",

    headerText: "Preencha as informações e descubra o passo a passo para vender mais e melhor que seus concorrentes",

    productNameLabel: "Nome do Produto",
    productNamePlaceholder: "Ex: Samsung Galaxy S21",
    productNameTooltip: "Digite o nome completo do item com especificações. Quanto mais detalhes, melhor os resultados.",
    productNameAriaLabel: "Informações sobre o nome do produto",

    baseCostLabel: "Preço de custo (R$)",
    baseCostPlaceholder: "0,00",
    baseCostTooltip: "Insira o valor pago pelo produto ou gasto para ser fabricado.",
    baseCostAriaLabel: "Informações sobre o preço de custo",

    businessSegmentLabel: "Área de atuação",

    profitMarginLabel: "Lucro ideal estimado (R$ ou %)",
    profitMarginTooltip: "Aqui calculamos a margem de lucro ideal para o seu produto com base no segmento de mercado selecionado. Você pode alterar para um valor fixo ou um percentual.",

    emailLabel: "Seu E-mail",
    emailPlaceholder: "seu@email.com",

    submitButtonText: "Ver Resultado",
    processingButtonText: "Processando...",

    requiredFieldsAlert: "Por favor, preencha todos os campos obrigatórios.",
    invalidEmailAlert: "Por favor, insira um email válido.",

    plgResultsPath: "/results",
    slgResultsPath: "/results-s"
};
const defaultLocalization: LocalizationData = {
    calculatorSteps: [
        { title: "Step 1", description: "" },
        { title: "Step 2", description: "" },
        { title: "Step 3", description: "" },
        { title: "Step 4", description: "" }
    ],
    stepDescriptions: {
        step1: "",
        step2: "",
        step3: "",
        step4: "",
        complete: ""
    },
    completionText: "Complete"
};

export default function IdealProductPriceCalculator(props: Partial<CalculatorProps> = {}) {

    const calculatorProps: CalculatorProps = { ...defaultProps, ...props };
    // Use the provided localization data or fallback to default
    const localizationData = calculatorProps.localizationData || defaultLocalization;

    const BUSINESS_SEGMENTS: BusinessSegmentsType = calculatorProps.businessSegmentsData;

    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [locationDetected, setLocationDetected] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [progressLabel, setProgressLabel] = useState('');
    const [progressDescription, setProgressDescription] = useState('');

    useEffect(() => {
        // Only fetch if autoDetectLocation is true and location hasn't been detected yet
        if (calculatorProps.autoDetectLocation && !locationDetected) {
            const fetchUserLocation = async () => {
                console.log("📍 Calculator: Attempting to auto-detect user location...");
                try {
                    const location = await getUserLocation();
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        country: location.country,
                        region: location.region,
                        city: location.city,
                        language: location.language, // Also store language if available and needed
                        currencySymbol: location.currencySymbol, // Add currencySymbol here
                    }));
                    setLocationDetected(true); // Mark as detected to prevent re-fetching
                    console.log("📍 Calculator: User location auto-detected and set in form data:", location);
                } catch (error) {
                    console.error("📍 Calculator: Failed to auto-detect user location:", error);
                    // Fallback logic is handled within getUserLocation.
                    // Mark as detected to avoid repeated attempts on error, or implement more robust retry/error handling.
                    setLocationDetected(true);
                }
            };

            fetchUserLocation();
        }
    }, [calculatorProps.autoDetectLocation, locationDetected, setFormData, setLocationDetected]);

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
        if (calculatorProps.autoDetectLocation && !locationDetected) {
            const detectLocation = async () => {
                try {
                    const locationData = await getUserLocation();
                    let currencyCode = calculatorProps.currencyCode;
                    let currencySymbol = calculatorProps.currencySymbol;

                    if (locationData.countryCode && currencyMap[locationData.countryCode]) {
                        currencyCode = currencyMap[locationData.countryCode].code;
                        currencySymbol = currencyMap[locationData.countryCode].symbol;
                    }

                    setFormData(prev => ({
                        ...prev,
                        country: locationData.country,
                        region: locationData.region,
                        city: locationData.city,
                        language: locationData.language
                    }));

                    setLocationDetected(true);

                    calculatorProps.currencyCode = currencyCode;
                    calculatorProps.currencySymbol = currencySymbol;
                    calculatorProps.defaultCountry = locationData.country;
                    calculatorProps.defaultLanguage = locationData.language;

                } catch (error) {
                    console.error('Failed to auto-detect location:', error);
                }
            };

            detectLocation();
        }
    }, [calculatorProps.autoDetectLocation, locationDetected]);

    useEffect(() => {
        const savedData = localStorage.getItem("idealPriceCalculatorData");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setFormData(prevFormData => ({
                ...prevFormData, // Preserve existing state, especially from auto-detection
                productName: parsed.productName || prevFormData.productName || "",
                baseCost: parsed.baseCost || prevFormData.baseCost || 0,
                profitMargin: parsed.profitMargin || prevFormData.profitMargin || { type: "value", amount: 0 },
                email: parsed.email || prevFormData.email || "",
                businessSegment: parsed.businessSegment || prevFormData.businessSegment || "",
                marketLowestPrice: parsed.marketLowestPrice || prevFormData.marketLowestPrice,
                marketMediumPrice: parsed.marketMediumPrice || prevFormData.marketMediumPrice,
                marketHighestPrice: parsed.marketHighestPrice || prevFormData.marketHighestPrice,
                country: parsed.country || prevFormData.country || "",
                region: parsed.region || prevFormData.region || "",
                city: parsed.city || prevFormData.city || "",
                language: parsed.language || prevFormData.language || calculatorProps.defaultLanguage,
                currencySymbol: parsed.currencySymbol || prevFormData.currencySymbol || "",
            }));
        }
        const params = new URLSearchParams(window.location.search);
        const urlData: Partial<FormData> = {};
        const allowedKeys: (keyof FormData)[] = [
            "productName",
            "baseCost",
            "email",
            "businessSegment",
            "country",
            "region",
            "city",
            "language",
            "currencySymbol",
        ];
        params.forEach((value, key) => {
            if (allowedKeys.includes(key as keyof FormData)) {
                if (key === "baseCost") {
                    urlData.baseCost = parseFloat(value) || 0;
                } else {
                    const formDataKey = key as keyof FormData;
                    (urlData as any)[formDataKey] = value;
                }
            }
        });
        // Apply URL params over potentially localStorage-loaded data, but after initial auto-detection
        setFormData((prev) => ({ ...prev, ...urlData }));
    }, [calculatorProps.defaultLanguage]); // Rerun if default language changes, though typically stable

    useEffect(() => {
        const extendedData = calculateExtendedData();
        localStorage.setItem("idealPriceCalculatorData", JSON.stringify(extendedData));
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
        const numericValue = Number(formatted);
        setFormData((prev) => ({ ...prev, baseCost: numericValue }));
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

    const parsePrice = (priceStr: string): number => {
        const match = priceStr.match(/[\d.,]+/);
        if (!match) return 0;

        let cleanPrice = match[0];

        const hasCommaDecimal = /,\d{1,2}$/.test(cleanPrice);

        if (hasCommaDecimal) {
            cleanPrice = cleanPrice.replace(/\./g, "").replace(",", ".");
        } else {
            cleanPrice = cleanPrice.replace(/,/g, "");
        }

        const price = parseFloat(cleanPrice);
        console.log(`Parsing price: ${priceStr} -> ${cleanPrice} -> ${price}`);
        return price;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.productName || !formData.email || !formData.businessSegment || formData.baseCost <= 0) {
            alert(calculatorProps.requiredFieldsAlert);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert(calculatorProps.invalidEmailAlert);
            return;
        }

        setIsSubmitting(true);

        const idealPrice = calculateIdealPrice();
        const queryParams = new URLSearchParams();

        const getTrackingParam = (paramName: string) => {
            const urlParams = new URLSearchParams(window.location.search);
            const fromUrl = urlParams.get(paramName);
            if (fromUrl) return fromUrl;

            const fromStorage = localStorage.getItem(paramName);
            if (fromStorage) return fromStorage;

            const cookies = document.cookie.split(';').map(c => c.trim());
            const cookiePrefix = `${paramName}=`;
            const cookie = cookies.find(c => c.startsWith(cookiePrefix));
            return cookie ? cookie.substring(cookiePrefix.length) : '';
        };

        if (typeof window !== 'undefined') {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'generate_lead',
                event_id: Date.now(),
                value: idealPrice,
                currency: calculatorProps.currencyCode,
                product_name: formData.productName,
                business_segment: formData.businessSegment,
                email: formData.email,
                country: formData.country || calculatorProps.defaultCountry,
                region: formData.region || "",
                city: formData.city || "",
                language: formData.language || calculatorProps.defaultLanguage,
                gclid: getTrackingParam('gclid'),
                gbraid: getTrackingParam('gbraid'),
                gl: getTrackingParam('_gl')
            });
        }

        queryParams.append("productName", formData.productName);
        queryParams.append("baseCost", formData.baseCost.toString());
        queryParams.append("country", formData.country || calculatorProps.defaultCountry);
        queryParams.append("region", formData.region || "");
        queryParams.append("city", formData.city || "");
        queryParams.append("language", formData.language || calculatorProps.defaultLanguage);
        queryParams.append(
            "profitMargin",
            `${formData.profitMargin.amount}${formData.profitMargin.type === "percent" ? "%" : ""}`
        );
        queryParams.append("email", formData.email);
        queryParams.append("businessSegment", formData.businessSegment);
        queryParams.append("idealPrice", idealPrice.toString());
        queryParams.append("currencySymbol", formData.currencySymbol || "");

        try {
            const locationData = await getUserLocation();

            setFormData(prev => ({
                ...prev,
                country: locationData.country,
                region: locationData.region,
                city: locationData.city,
                language: locationData.language,
                currencySymbol: locationData.currencySymbol
            }));

            queryParams.set("country", locationData.country || calculatorProps.defaultCountry);
            queryParams.set("region", locationData.region || "");
            queryParams.set("city", locationData.city || "");
            queryParams.set("language", locationData.language || calculatorProps.defaultLanguage);
            queryParams.set("currencySymbol", locationData.currencySymbol || "");
            queryParams.set("countryCode", locationData.countryCode || "");
            queryParams.set("formattedLocation", locationData.formattedLocation || "");
            queryParams.set("currencyCode", locationData.currencyCode || "");
            queryParams.set("currencySymbol", locationData.currencySymbol || "");

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

                const lowestPrice = parsePrice(sortedProducts[0].price);
                const mediumPrice = parsePrice(sortedProducts[1].price);
                const highestPrice = parsePrice(sortedProducts[2].price);

                queryParams.set("marketLowestPrice", lowestPrice.toString());
                queryParams.set("marketMediumPrice", mediumPrice.toString());
                queryParams.set("marketHighestPrice", highestPrice.toString());

                const urlParamsForMautic = new URLSearchParams(window.location.search);
                const flowParamForMautic = urlParamsForMautic.get('flow');
                const isSLGFlow = flowParamForMautic === 's';
                const mauticFlow = isSLGFlow ? 'slg' : 'plg';

                try {
                    await createMauticContact({
                        email: formData.email,
                        productName: formData.productName,
                        businessSegment: formData.businessSegment,
                        idealPrice,
                        baseCost: formData.baseCost,
                        profitMargin: formData.profitMargin.amount,
                        marketLowestPrice: lowestPrice,
                        marketMediumPrice: mediumPrice,
                        marketHighestPrice: highestPrice,
                        country: formData.country,
                        region: formData.region,
                        city: formData.city,
                        language: formData.language,
                        flow: mauticFlow
                    });
                } catch (mauticError) {
                    console.error("Error creating Mautic contact:", mauticError);
                }
            } else {
                console.warn("No market prices found for the product");
            }

            const urlParams = new URLSearchParams(window.location.search);
            const isSLGRedirect = urlParams.get('flow') === 's';
            const resultsPath = isSLGRedirect ? calculatorProps.slgResultsPath : calculatorProps.plgResultsPath;
            window.location.href = `${resultsPath}?${queryParams.toString()}`;
        } catch (error) {
            console.error("Error in form submission:", error);
        }
    };

    useEffect(() => {
        // Use localized steps from the provided data
        const steps = localizationData.calculatorSteps;
        const descriptions = localizationData.stepDescriptions;

        if (!steps.length) return; // Skip if no localization data available

        let progress = 0;
        let currentLabel = steps[0].title;
        let currentDescription = descriptions.step1;

        const productNameWords = formData.productName.trim().split(/\s+/);
        if (productNameWords.length >= 2 && productNameWords[0] !== '') {
            progress = 25;
            currentLabel = steps[1].title;
            currentDescription = descriptions.step2;
        }

        if (progress === 25 && formData.baseCost > 0) {
            progress = 50;
            currentLabel = steps[2].title;
            currentDescription = descriptions.step3;
        }

        if (progress === 50 && formData.businessSegment) {
            progress = 75;
            currentLabel = steps[3].title;
            currentDescription = descriptions.step4;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (progress === 75 && emailRegex.test(formData.email)) {
            progress = 100;
            currentLabel = `${localizationData.completionText}`;
            currentDescription = descriptions.complete;
        }

        setProgressPercentage(progress);
        setProgressLabel(currentLabel);
        setProgressDescription(currentDescription);
    }, [formData, localizationData]);

    return (
        <Card
            className="max-w-lg mx-auto p-6 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
            placeholder=""
            onPointerEnterCapture={() => { }}
            onPointerLeaveCapture={() => { }}
        >

            <div className="mb-6">
                <ProgressLabelOutside
                    title={progressLabel}
                    description={progressDescription}
                    percentage={progressPercentage}
                    titleColor={progressPercentage === 100 ? "gray02" : "gray02"}
                    descriptionColor={progressPercentage === 100 ? "gray02" : "gray02"}
                    barColor={progressPercentage === 100 ? "teal" : "amber"}
                    backgroundColor="gray10"
                />
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="relative">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Input
                                onPointerEnterCapture={() => { }}
                                onPointerLeaveCapture={() => { }}
                                size="lg"
                                type="text"
                                label={calculatorProps.productNameLabel}
                                placeholder={calculatorProps.productNamePlaceholder}
                                name="productName"
                                value={formData.productName || " "}
                                onChange={handleInputChange}
                                color="teal"
                                crossOrigin="anonymous"
                                required
                                aria-required="true"
                                aria-describedby="product-name-tooltip"
                            />
                            <Tooltip
                                content={calculatorProps.productNameTooltip}
                                placement="top"
                                className="bg-white text-gray04 p-2 shadow-lg rounded max-w-xs whitespace-normal break-words"
                                trigger="hover click"
                                id="product-name-tooltip"
                            >
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                                    onClick={(e) => e.preventDefault()}
                                    aria-label={calculatorProps.productNameAriaLabel}
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
                                label={calculatorProps.baseCostLabel}
                                placeholder={calculatorProps.baseCostPlaceholder}
                                value={formData.baseCost.toFixed(2).replace(".", ",")}
                                onChange={handleBaseCostChange}
                                color="teal"
                                crossOrigin="anonymous"
                            />
                            <Tooltip
                                content={calculatorProps.baseCostTooltip}
                                placement="top"
                                className="bg-white text-gray04 p-2 shadow-lg rounded max-w-xs whitespace-normal break-words"
                                trigger="hover click"
                                id="base-cost-tooltip"
                            >
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                                    onClick={(e) => e.preventDefault()}
                                    aria-label={calculatorProps.baseCostAriaLabel}
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
                        label={calculatorProps.businessSegmentLabel}
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
                            label={calculatorProps.profitMarginLabel}
                            placeholder={calculatorProps.baseCostPlaceholder}
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
                            content={calculatorProps.profitMarginTooltip}
                            placement="top"
                            className="bg-white text-gray04 p-2 shadow-lg rounded max-w-xs whitespace-normal break-words"
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
                                    newAmount = (prev.baseCost * (prev.profitMargin.amount / 100));
                                } else if (newType === "percent" && prev.profitMargin.type === "value") {
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
                        <option value="value">{calculatorProps.currencySymbol}</option>
                        <option value="percent">%</option>
                    </select>
                </div>
                <div>
                    <Input
                        onPointerEnterCapture={() => { }}
                        onPointerLeaveCapture={() => { }}
                        size="lg"
                        type="email"
                        label={calculatorProps.emailLabel}
                        placeholder={calculatorProps.emailPlaceholder}
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
                    disabled={isSubmitting}
                >
                    {isSubmitting ? calculatorProps.processingButtonText : calculatorProps.submitButtonText}
                </Button>
            </form>
        </Card>
    );
}