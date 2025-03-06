import axios, { AxiosError } from 'axios';

interface ShoppingItem {
    price: string;
    position: number;
    title: string;
}

interface PriceAnalytics {
    lowestPrice: number;
    mediumPrice: number;
    highestPrice: number;
}

const MAX_RETRIES = 3;
const TIMEOUT = 10000;

// Update environment variable access for Astro
const SERPER_API_KEY = import.meta.env.SERPER_API_KEY;
if (!SERPER_API_KEY) {
    console.error('SERPER_API_KEY is not defined in environment variables');
    throw new Error("Missing SERPER_API_KEY");
}

export async function getMarketPrices(productName: string): Promise<PriceAnalytics> {
    if (!productName || productName.trim().length === 0) {
        return { lowestPrice: 0, mediumPrice: 0, highestPrice: 0 };
    }

    const config = {
        method: 'post',
        url: 'https://google.serper.dev/shopping',
        headers: {
            'X-API-KEY': SERPER_API_KEY,
            'Content-Type': 'application/json'
        },
        data: {
            q: productName.trim(),
            location: "Brazil",
            gl: "br",
            hl: "pt-br"
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

            const prices = items
                .filter(item => item.position <= 5 && item.price)
                .map(item => {
                    const priceStr = item.price.replace('R$', '').replace('.', '').replace(',', '.').trim();
                    const price = parseFloat(priceStr);
                    return price > 0 ? price : null;
                })
                .filter((price): price is number => price !== null);

            if (prices.length === 0) {
                console.warn('No valid prices found in the response');
                return { lowestPrice: 0, mediumPrice: 0, highestPrice: 0 };
            }

            return {
                lowestPrice: Math.min(...prices),
                mediumPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
                highestPrice: Math.max(...prices)
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
    return { lowestPrice: 0, mediumPrice: 0, highestPrice: 0 };
}