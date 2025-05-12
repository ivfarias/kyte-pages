import React, { useEffect, useState } from 'react';
import IdealProductPriceCalculator from '../components/Calculator';
import businessSegmentsDataPT from './pt/businessSegments.json';
import businessSegmentsDataES from './es/businessSegments.json';
import { currencyMap } from './currencyData';


// Portuguese (Brazil) configuration
export const PortugueseCalculator: React.FC = () => {
    // Portuguese localization data
    const ptLocalizations = {
        calculatorSteps: [
            {
                title: "<strong>Passo 1:</strong> Identifique seu produto",
                description: "Informe o nome completo, incluindo marca e modelo para uma análise precisa."
            },
            {
                title: "<strong>Passo 2:</strong> Adicione o valor de custo",
                description: "Digite o preço que você paga pelo produto (sem impostos ou frete)."
            },
            {
                title: "<strong>Passo 3:</strong> Selecione seu segmento",
                description: "Escolha a área de atuação do seu negócio para resultados personalizados."
            },
            {
                title: "<strong>Passo 4:</strong> Finalize com seu email",
                description: "Receba os resultados da análise diretamente na sua caixa de entrada."
            }
        ],
        stepDescriptions: {
            step1: "Informe o nome completo, incluindo marca e modelo para uma análise precisa.",
            step2: "Digite o preço que você paga pelo produto (sem impostos ou frete).",
            step3: "Escolha a área de atuação do seu negócio para resultados personalizados.",
            step4: "Receba os resultados da análise diretamente na sua caixa de entrada.",
            complete: "Clique no botão abaixo para ver seus resultados detalhados."
        },
        completionText: "Clique para ver resultado"
    };

    return (
        <IdealProductPriceCalculator
            businessSegmentsData={businessSegmentsDataPT}
            currencySymbol="R$"
            currencyCode="BRL"
            defaultCountry="Brazil"
            defaultLanguage="pt-br"
            localizationData={ptLocalizations}

            headerText="Preencha as informações e descubra o passo a passo para vender mais e melhor que seus concorrentes"

            productNameLabel="Nome do Produto"
            productNamePlaceholder="Ex: Samsung Galaxy S21"
            productNameTooltip="Digite o nome completo do item com especificações. Quanto mais detalhes, melhor os resultados."
            productNameAriaLabel="Informações sobre o nome do produto"

            baseCostLabel="Preço de custo (R$)"
            baseCostPlaceholder="0,00"
            baseCostTooltip="Insira o valor pago pelo produto ou gasto para ser fabricado."
            baseCostAriaLabel="Informações sobre o preço de custo"

            businessSegmentLabel="Área de atuação"

            profitMarginLabel="Lucro ideal estimado (R$ ou %)"
            profitMarginTooltip="Aqui calculamos a margem de lucro ideal para o seu produto com base no segmento de mercado selecionado. Você pode alterar para um valor fixo ou um percentual."

            emailLabel="Seu E-mail"
            emailPlaceholder="seu@email.com"

            submitButtonText="Ver Resultado"
            processingButtonText="Processando..."

            requiredFieldsAlert="Por favor, preencha todos os campos obrigatórios."
            invalidEmailAlert="Por favor, insira um email válido."

            plgResultsPath="/results/pt/results"
            slgResultsPath="/results/pt/results-s"
        />
    );
};

// Spanish configuration with dynamic location detection
export const SpanishCalculator: React.FC = () => {
    const [countryCode, setCountryCode] = useState<string>('ES');
    const [currencySymbol, setCurrencySymbol] = useState<string>('€');
    const [currencyCode, setCurrencyCode] = useState<string>('EUR');
    const [country, setCountry] = useState<string>('España');

    // Spanish localization data
    const esLocalizations = {
        calculatorSteps: [
            {
                title: "<strong>Paso 1:</strong> Identifique su producto",
                description: "Ingrese el nombre completo, incluyendo marca y modelo para un análisis preciso."
            },
            {
                title: "<strong>Paso 2:</strong> Agregue el valor de costo",
                description: "Ingrese el precio que paga por el producto (sin impuestos ni envío)."
            },
            {
                title: "<strong>Paso 3:</strong> Seleccione su segmento",
                description: "Elija el área de su negocio para resultados personalizados."
            },
            {
                title: "<strong>Paso 4:</strong> Finalice con su correo",
                description: "Reciba los resultados del análisis directamente en su bandeja de entrada."
            }
        ],
        stepDescriptions: {
            step1: "Ingrese el nombre completo, incluyendo marca y modelo para un análisis preciso.",
            step2: "Ingrese el precio que paga por el producto (sin impuestos ni envío).",
            step3: "Elija el área de su negocio para resultados personalizados.",
            step4: "Reciba los resultados del análisis directamente en su bandeja de entrada.",
            complete: "Haga clic en el botón abajo para ver sus resultados detallados."
        },
        completionText: "Haga clic para ver resultado"
    };

    // Use the currency map for initialization
    useEffect(() => {
        if (currencyMap['ES']) {
            setCurrencySymbol(currencyMap['ES'].symbol);
            setCurrencyCode(currencyMap['ES'].code);
        }
    }, []);

    useEffect(() => {
        const detectLocation = async () => {
            try {
                const { getUserLocation } = await import('../utils/geolocation');
                const locationData = await getUserLocation();

                if (locationData.countryCode) {
                    setCountryCode(locationData.countryCode);
                    setCountry(locationData.country || 'España');

                    // Use the currency map to set currency information
                    if (currencyMap[locationData.countryCode]) {
                        setCurrencyCode(currencyMap[locationData.countryCode].code);
                        setCurrencySymbol(currencyMap[locationData.countryCode].symbol);
                    } else {
                        setCurrencyCode('EUR');
                        setCurrencySymbol('€');
                    }
                }
            } catch (error) {
                console.error('Failed to detect location for Spanish calculator:', error);
                setCountryCode('ES');
                setCurrencyCode('EUR');
                setCurrencySymbol('€');
                setCountry('España');
            }
        };

        detectLocation();
    }, []);

    return (
        <IdealProductPriceCalculator
            businessSegmentsData={businessSegmentsDataES}
            currencySymbol={currencySymbol}
            currencyCode={currencyCode}
            defaultCountry={country}
            defaultLanguage={`es-${countryCode.toLowerCase()}`}
            localizationData={esLocalizations}

            headerText="Complete la información y descubra la guía paso a paso para vender más y mejor que sus competidores"

            productNameLabel="Nombre del Producto"
            productNamePlaceholder="Ej: Samsung Galaxy S21"
            productNameTooltip="Ingrese el nombre completo del artículo con especificaciones. Cuantos más detalles, mejores serán los resultados."
            productNameAriaLabel="Información sobre el nombre del producto"

            baseCostLabel={`Precio de costo (${currencySymbol})`}
            baseCostPlaceholder="0,00"
            baseCostTooltip="Ingrese el monto pagado por el producto o gastado para fabricarlo."
            baseCostAriaLabel="Información sobre el precio de costo"

            businessSegmentLabel="Segmento de Negocio"

            profitMarginLabel={`Beneficio Ideal Estimado (${currencySymbol} o %)`}
            profitMarginTooltip="Aquí calculamos el margen de beneficio ideal para su producto según el segmento de mercado seleccionado. Puede cambiarlo a un valor fijo o un porcentaje."

            emailLabel="Su Correo Electrónico"
            emailPlaceholder="su@correo.com"

            submitButtonText="Ver Resultado"
            processingButtonText="Procesando..."

            requiredFieldsAlert="Por favor, complete todos los campos requeridos."
            invalidEmailAlert="Por favor, ingrese un correo electrónico válido."

            plgResultsPath="/results/es/results"
            slgResultsPath="/results/es/results-s"
        />
    );
};

// Optional: You can also add the English calculator component with its localizations
export const EnglishCalculator: React.FC = () => {
    // English localization data
    const enLocalizations = {
        calculatorSteps: [
            {
                title: "<strong>Step 1:</strong> Identify your product",
                description: "Enter the full name, including brand and model for accurate analysis."
            },
            {
                title: "<strong>Step 2:</strong> Add the cost value",
                description: "Enter the price you pay for the product (excluding taxes or shipping)."
            },
            {
                title: "<strong>Step 3:</strong> Select your segment",
                description: "Choose your business area for customized results."
            },
            {
                title: "<strong>Step 4:</strong> Finalize with your email",
                description: "Receive the analysis results directly in your inbox."
            }
        ],
        stepDescriptions: {
            step1: "Enter the full name, including brand and model for accurate analysis.",
            step2: "Enter the price you pay for the product (excluding taxes or shipping).",
            step3: "Choose your business area for customized results.",
            step4: "Receive the analysis results directly in your inbox.",
            complete: "Click the button below to see your detailed results."
        },
        completionText: "Click to see result"
    };

    return (
        <IdealProductPriceCalculator
            businessSegmentsData={{}} // Replace with actual English business segments data
            currencySymbol="$"
            currencyCode="USD"
            defaultCountry="United States"
            defaultLanguage="en-us"
            localizationData={enLocalizations}

            headerText="Fill in the information and discover the step-by-step guide to sell more and better than your competitors"

            productNameLabel="Product Name"
            productNamePlaceholder="Ex: Samsung Galaxy S21"
            productNameTooltip="Enter the full name of the item with specifications. The more details, the better the results."
            productNameAriaLabel="Information about the product name"

            baseCostLabel="Cost Price ($)"
            baseCostPlaceholder="0.00"
            baseCostTooltip="Enter the amount paid for the product or spent to manufacture it."
            baseCostAriaLabel="Information about the cost price"

            businessSegmentLabel="Business Segment"

            profitMarginLabel="Estimated Ideal Profit ($ or %)"
            profitMarginTooltip="Here we calculate the ideal profit margin for your product based on the selected market segment. You can change it to a fixed value or a percentage."

            emailLabel="Your Email"
            emailPlaceholder="your@email.com"

            submitButtonText="See Result"
            processingButtonText="Processing..."

            requiredFieldsAlert="Please fill in all required fields."
            invalidEmailAlert="Please enter a valid email."

            plgResultsPath="/results/en/results"
            slgResultsPath="/results/en/results-s"
        />
    );
};