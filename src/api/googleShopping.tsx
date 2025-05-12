import axios, { AxiosError } from 'axios';
import { getUserLocation } from '../utils/geolocation';

interface ShoppingItem {
    title: string;
    source: string;
    link: string;
    price: string;
    delivery?: string;
    imageUrl: string;
    rating?: number;
    ratingCount?: number;
    position: number;
}

interface PriceAnalytics {
    lowestPrice: number;
    mediumPrice: number;
    highestPrice: number;
    lowestPriceProduct: ShoppingItem;
    mediumPriceProduct: ShoppingItem;
    highestPriceProduct: ShoppingItem;
}

const MAX_RETRIES = 3;
const TIMEOUT = 10000;

const SERPER_API_KEY = import.meta.env.SERPER_API_KEY;
if (!SERPER_API_KEY) {
    console.error('SERPER_API_KEY is not defined in environment variables');
    throw new Error("Missing SERPER_API_KEY");
}

export async function getMarketPrices(productName: string): Promise<PriceAnalytics> {
    if (!productName || productName.trim().length === 0) {
        return {
            lowestPrice: 0,
            mediumPrice: 0,
            highestPrice: 0,
            lowestPriceProduct: {} as ShoppingItem,
            mediumPriceProduct: {} as ShoppingItem,
            highestPriceProduct: {} as ShoppingItem
        };
    }

    const locationData = await getUserLocation();

    console.log('📍 Google Shopping API - Location data:', {
        country: locationData.country,
        region: locationData.region,
        city: locationData.city,
        formattedLocation: locationData.formattedLocation,
        countryCode: locationData.countryCode,
        language: locationData.language
    });

    const config = {
        method: 'post',
        url: 'https://google.serper.dev/shopping',
        headers: {
            'X-API-KEY': SERPER_API_KEY,
            'Content-Type': 'application/json'
        },
        data: {
            q: productName.trim(),
            location: locationData.formattedLocation || "Brazil",
            gl: locationData.countryCode.toLowerCase() || "br",
            hl: locationData.language || "pt-br"
        },
        timeout: TIMEOUT
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await axios.request(config);

            if (!response.data || !Array.isArray(response.data.shopping)) {
                console.warn(`Invalid response format on attempt ${attempt}`);
                continue;
            }

            const items: ShoppingItem[] = response.data.shopping;

            const MONTHLY_PAYMENT_INDICATORS = [
                '/mês', '/mes', 'mensal', '/month', '/mo', 'monthly',
                'por mês', 'per month', '/mois', 'mensuel'
            ];

            const CURRENCY_SYMBOLS = ['R$', '$', '€', '£', '¥'];

            const OUT_OF_STOCK_INDICATORS = [
                'indisponível',
                'fora de estoque',
                'out of stock',
                'unavailable',
                'esgotado'
            ];

            const itemsWithPrices = items
                .filter(item => {
                    if (!item.price) return false;

                    if (OUT_OF_STOCK_INDICATORS.some(indicator =>
                        item.title.toLowerCase().includes(indicator))) {
                        return false;
                    }

                    const normalizedPrice = item.price.toLowerCase().trim();

                    if (MONTHLY_PAYMENT_INDICATORS.some(indicator =>
                        normalizedPrice.includes(indicator.toLowerCase()))) {
                        return false;
                    }

                    const hasCurrencySymbol = CURRENCY_SYMBOLS.some(symbol =>
                        normalizedPrice.startsWith(symbol.toLowerCase()));

                    return hasCurrencySymbol && /\d/.test(normalizedPrice);
                })
                .map(item => {
                    let priceStr = item.price;
                    CURRENCY_SYMBOLS.forEach(symbol => {
                        priceStr = priceStr.replace(symbol, '');
                    });

                    const hasCommaDecimal = /,\d{2}$/.test(priceStr);
                    if (hasCommaDecimal) {
                        priceStr = priceStr.replace(/\./g, '').replace(',', '.');
                    } else {
                        priceStr = priceStr.replace(/,/g, '');
                    }

                    const price = parseFloat(priceStr.trim());
                    return price > 0 ? { item, price } : null;
                })
                .filter((entry): entry is { item: ShoppingItem; price: number } => entry !== null);

            if (itemsWithPrices.length < 3) {
                console.warn('Not enough valid prices found in the response');
                return {
                    lowestPrice: 0,
                    mediumPrice: 0,
                    highestPrice: 0,
                    lowestPriceProduct: {} as ShoppingItem,
                    mediumPriceProduct: {} as ShoppingItem,
                    highestPriceProduct: {} as ShoppingItem
                };
            }

            const sortedItems = [...itemsWithPrices].sort((a, b) => a.price - b.price);

            const q1Index = Math.floor(sortedItems.length * 0.25);
            const q3Index = Math.floor(sortedItems.length * 0.75);
            const q1 = sortedItems[q1Index].price;
            const q3 = sortedItems[q3Index].price;
            const iqr = q3 - q1;
            const lowerBound = q1 - (iqr * 1.5);
            const upperBound = q3 + (iqr * 1.5);

            const validPrices = sortedItems.filter(item =>
                item.price >= lowerBound && item.price <= upperBound
            );

            if (validPrices.length < 3) {
                console.warn('Not enough valid prices found after outlier removal');
                return {
                    lowestPrice: 0,
                    mediumPrice: 0,
                    highestPrice: 0,
                    lowestPriceProduct: {} as ShoppingItem,
                    mediumPriceProduct: {} as ShoppingItem,
                    highestPriceProduct: {} as ShoppingItem
                };
            }

            const lowestPriceItem = validPrices[0];
            const highestPriceItem = validPrices[validPrices.length - 1];
            const medianIndex = Math.floor(validPrices.length / 2);
            const mediumPriceItem = validPrices[medianIndex];

            return {
                lowestPrice: lowestPriceItem.price,
                mediumPrice: mediumPriceItem.price,
                highestPrice: highestPriceItem.price,
                lowestPriceProduct: lowestPriceItem.item,
                mediumPriceProduct: mediumPriceItem.item,
                highestPriceProduct: highestPriceItem.item
            };
        } catch (error) {
            lastError = error as Error;
            const axiosError = error as AxiosError;

            console.error(`Attempt ${attempt} failed:`, {
                status: axiosError.response?.status,
                message: axiosError.message
            });

            if (axiosError.response?.status === 401 ||
                axiosError.response?.status === 403 ||
                axiosError.response?.status === 422) {
                break;
            }

            if (attempt < MAX_RETRIES) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    }

    console.error('All attempts failed:', lastError);
    return {
        lowestPrice: 0,
        mediumPrice: 0,
        highestPrice: 0,
        lowestPriceProduct: {} as ShoppingItem,
        mediumPriceProduct: {} as ShoppingItem,
        highestPriceProduct: {} as ShoppingItem
    };
}