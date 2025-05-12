import { useState, useEffect } from 'react';
import Text from './ui/Text';

interface Product {
    id: number;
    name: string;
    href: string;
    price: string;
    imageSrc: string;
    imageAlt: string;
}

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

interface ProductListProps {
    language?: 'en' | 'es' | 'pt';
}

interface MarketProducts {
    lowestPriceProduct: ShoppingItem;
    mediumPriceProduct: ShoppingItem;
    highestPriceProduct: ShoppingItem;
}

const transformShoppingData = (marketProducts: MarketProducts): Product[] => {
    const truncateText = (text: string, limit: number) => {
        return text.length > limit ? `${text.substring(0, limit)}...` : text;
    };

    return [
        {
            id: 1,
            name: truncateText(marketProducts.lowestPriceProduct.title, 55),
            href: marketProducts.lowestPriceProduct.link,
            price: marketProducts.lowestPriceProduct.price,
            imageSrc: marketProducts.lowestPriceProduct.imageUrl,
            imageAlt: marketProducts.lowestPriceProduct.title,
        },
        {
            id: 2,
            name: truncateText(marketProducts.mediumPriceProduct.title, 55),
            href: marketProducts.mediumPriceProduct.link,
            price: marketProducts.mediumPriceProduct.price,
            imageSrc: marketProducts.mediumPriceProduct.imageUrl,
            imageAlt: marketProducts.mediumPriceProduct.title,
        },
        {
            id: 3,
            name: truncateText(marketProducts.highestPriceProduct.title, 55),
            href: marketProducts.highestPriceProduct.link,
            price: marketProducts.highestPriceProduct.price,
            imageSrc: marketProducts.highestPriceProduct.imageUrl,
            imageAlt: marketProducts.highestPriceProduct.title,
        }
    ];
};

const getCategoryStyle = (id: number, lang: 'en' | 'es' | 'pt' = 'pt'): { text: string; color: string } => {
    const localizations = {
        en: {
            1: 'Cheap',
            2: 'Medium',
            3: 'Expensive',
        },
        es: {
            1: 'Barato',
            2: 'Medio',
            3: 'Caro',
        },
        pt: {
            1: 'Barato',
            2: 'Médio',
            3: 'Caro',
        },
    };
    const text = localizations[lang]?.[id as keyof typeof localizations[typeof lang]] || '';
    switch (id) {
        case 1:
            return { text, color: '#FF4E4E' };
        case 2:
            return { text, color: '#2FAE94' };
        case 3:
            return { text, color: '#F5A623' };
        default:
            return { text: '', color: '' };
    }
};

export default function ProductList({ language = 'pt' }: ProductListProps) {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const marketProductsData = localStorage.getItem('marketProductsData');
        if (marketProductsData) {
            const marketProducts = JSON.parse(marketProductsData);
            const transformedProducts = transformShoppingData(marketProducts);
            setProducts(transformedProducts);
        }
    }, []);

    return (
        <div className="bg-white">
            <div className="w-full py-2 sm:py-4">
                <div className="flex flex-col divide-y divide-gray07">
                    {products
                        .sort((a, b) => a.id - b.id)
                        .map((product) => {
                            const category = getCategoryStyle(product.id, language);
                            return (
                                <a
                                    key={product.id}
                                    href={product.href}
                                    className="flex items-start space-x-3 p-2 sm:space-x-4 sm:p-4 hover:bg-gray-50"
                                >
                                    <div className="flex-shrink-0">
                                        <img
                                            src={product.imageSrc}
                                            alt={product.imageAlt}
                                            className="h-20 w-20 sm:h-24 sm:w-24 object-cover bg-gray09 shadow-[0_2px_8px_rgba(0,0,0,0.05)] rounded-md"
                                        />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start w-full">
                                            <div className="min-w-0 pr-2 flex flex-col items-start">
                                                <Text
                                                    color="kyte-gray"
                                                    size="medium"
                                                    align="left-all"
                                                    className="font-medium break-words sm:hidden"
                                                >
                                                    {product.name}
                                                </Text>
                                                <Text
                                                    color="kyte-gray"
                                                    size="large"
                                                    align="left-all"
                                                    className="font-medium break-words hidden sm:block"
                                                >
                                                    {product.name}
                                                </Text>
                                                <div className="flex items-center justify-between w-full mt-2">
                                                    <span
                                                        className="inline-block px-2 py-1 rounded-md text-xs sm:text-sm"
                                                        style={{
                                                            color: category.color,
                                                            backgroundColor: `${category.color}1A`,
                                                        }}
                                                    >
                                                        {category.text}
                                                    </span>
                                                    <Text
                                                        color="kyte-gray"
                                                        size="medium"
                                                        align="left-all"
                                                        className="font-graphik-regular sm:hidden"
                                                    >
                                                        {product.price}
                                                    </Text>
                                                </div>
                                            </div>
                                            <Text
                                                color="kyte-gray"
                                                size="large"
                                                align="left-all"
                                                className="font-graphik-regular hidden sm:block self-start"
                                            >
                                                {product.price}
                                            </Text>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
