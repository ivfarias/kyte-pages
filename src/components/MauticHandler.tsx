"use client"

import { useEffect } from 'react';
import { createMauticContact } from '../api/mautic';

interface MauticHandlerProps {
    email: string;
    productName: string;
    idealPrice: number;
    baseCost: number;
    profitMargin: number;
    marketLowestPrice: number;
    marketMediumPrice: number;
    marketHighestPrice: number;
}

export default function MauticHandler(props: MauticHandlerProps) {
    useEffect(() => {
        const sendToMautic = async () => {
            try {
                await createMauticContact({
                    email: props.email,
                    productName: props.productName,
                    idealPrice: props.idealPrice,
                    baseCost: props.baseCost,
                    profitMargin: props.profitMargin,
                    marketLowestPrice: props.marketLowestPrice,
                    marketMediumPrice: props.marketMediumPrice,
                    marketHighestPrice: props.marketHighestPrice
                });
            } catch (error) {
                console.error('Failed to create Mautic contact:', error);
            }
        };

        sendToMautic();
    }, [props]);

    return null;
}