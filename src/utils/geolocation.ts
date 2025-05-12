export interface GeolocationData {
    country: string;
    countryCode: string;
    region: string;
    city: string;
    language: string;
    formattedLocation: string;
    currencyCode: string;
    currencySymbol: string;
}

function getLanguageFromBrowser(): string {
    if (typeof navigator === 'undefined' || !navigator.language) return 'en-US'; // Default to US English
    return navigator.language;
}

function getCountryCodeFromBrowserLanguage(): string {
    if (typeof navigator === 'undefined' || !navigator.language) return 'US'; // Default to US
    const langParts = navigator.language.split('-');
    // Use the region part if available (e.g., 'en-US' -> 'US'), otherwise fallback based on language part
    if (langParts.length > 1) {
        return langParts[1].toUpperCase();
    }
    const lang = langParts[0].toLowerCase();
    const langToCountry: Record<string, string> = {
        'en': 'US',
        'es': 'ES',
        'pt': 'BR',
        // Add more basic fallbacks if necessary, but API should provide this
    };
    return langToCountry[lang] || 'US'; // Default to US if no specific mapping found
}

function getFallbackLocationData(error?: any): GeolocationData {
    console.warn('📍 Using fallback geolocation data due to error:', error);
    const language = getLanguageFromBrowser();
    const countryCode = getCountryCodeFromBrowserLanguage();

    return {
        country: '', // API should provide this, fallback is empty
        countryCode,
        region: '', // API should provide this, fallback is empty
        city: '', // API should provide this, fallback is empty
        language,
        currencyCode: '', // API should provide this, fallback is empty
        currencySymbol: '', // API should provide this, fallback is empty
        formattedLocation: '' // API should provide this, fallback is empty
    };
}

export async function getUserLocation(): Promise<GeolocationData> {
    try {
        const response = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();

        if (data.error) {
            throw new Error(`API returned an error: ${data.reason}`);
        }

        const country = data.country_name || '';
        const countryCode = data.country_code || getCountryCodeFromBrowserLanguage();
        const region = data.region || '';
        const city = data.city || '';
        // Prefer API language if available, otherwise derive from browser
        const language = data.languages ? data.languages.split(',')[0] : getLanguageFromBrowser();
        const currencyCode = data.currency || '';
        const currencySymbol = data.currency_symbol || '';

        const formattedLocationParts = [];
        if (city) formattedLocationParts.push(city);
        if (region) formattedLocationParts.push(region);
        if (country) formattedLocationParts.push(country);
        const formattedLocation = formattedLocationParts.join(', ');

        const locationData: GeolocationData = {
            country,
            countryCode,
            region,
            city,
            language,
            currencyCode,
            currencySymbol,
            formattedLocation: formattedLocation || country // Fallback to country if all else fails
        };

        console.log('📍 Successfully fetched geolocation data:', locationData);
        return locationData;

    } catch (error) {
        console.error('📍 Error fetching geolocation from ipapi.co:', error);
        return getFallbackLocationData(error);
    }
}