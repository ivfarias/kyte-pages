"use client"

import { useEffect } from 'react';
import { createMauticContact } from '../api/mautic';

interface MauticHandlerProps {
    email: string;
    businessSegment: string;
    productName: string;
    idealPrice: number;
    baseCost: number;
    profitMargin: number;
    marketLowestPrice: number;
    marketMediumPrice: number;
    marketHighestPrice: number;
    country?: string;
    region?: string;
    city?: string;
    language?: string;
    flow?: string;
}

export default function MauticHandler(props: MauticHandlerProps) {
    useEffect(() => {
        const sendToMautic = async () => {
            try {
                await createMauticContact({
                    email: props.email,
                    businessSegment: props.businessSegment,
                    productName: props.productName,
                    idealPrice: props.idealPrice,
                    baseCost: props.baseCost,
                    profitMargin: props.profitMargin,
                    marketLowestPrice: props.marketLowestPrice,
                    marketMediumPrice: props.marketMediumPrice,
                    marketHighestPrice: props.marketHighestPrice,
                    country: props.country || '',
                    region: props.region || '',
                    city: props.city || '',
                    language: props.language || '',
                    flow: props.flow || ''
                });
                console.log('📤 MauticHandler sent data with location:', { country: props.country, region: props.region, city: props.city, language: props.language });
            } catch (error) {
                console.error('Failed to create Mautic contact:', error);
            }
        };

        sendToMautic();
    }, [props]);

    return null;
}