// Currency map for different countries
export const currencyMap: Record<string, { code: string, symbol: string }> = {
    // Latin American countries
    'AR': { code: 'ARS', symbol: '$' },
    'BO': { code: 'BOB', symbol: 'Bs' },
    'CL': { code: 'CLP', symbol: '$' },
    'CO': { code: 'COP', symbol: '$' },
    'CR': { code: 'CRC', symbol: '₡' },
    'CU': { code: 'CUP', symbol: '$' },
    'DO': { code: 'DOP', symbol: 'RD$' },
    'EC': { code: 'USD', symbol: '$' },
    'SV': { code: 'USD', symbol: '$' },
    'GT': { code: 'GTQ', symbol: 'Q' },
    'HN': { code: 'HNL', symbol: 'L' },
    'MX': { code: 'MXN', symbol: '$' },
    'NI': { code: 'NIO', symbol: 'C$' },
    'PA': { code: 'PAB', symbol: 'B/' },
    'PY': { code: 'PYG', symbol: '₲' },
    'PE': { code: 'PEN', symbol: 'S/' },
    'PR': { code: 'USD', symbol: '$' },
    'UY': { code: 'UYU', symbol: '$' },
    'VE': { code: 'VES', symbol: 'Bs' },

    // Portuguese speaking
    'BR': { code: 'BRL', symbol: 'R$' },
    'PT': { code: 'EUR', symbol: '€' },

    // European Spanish
    'ES': { code: 'EUR', symbol: '€' },

    // Default
    'US': { code: 'USD', symbol: '$' }
};