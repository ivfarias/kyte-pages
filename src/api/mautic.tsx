import axios from 'axios';

interface MauticContact {
  productName: string;
  idealPrice: number;
  baseCost: number;
  profitMargin: number;
  operationalCosts: number;
  creditCardFees: number;
  taxes: number;
  email: string;
  marketLowestPrice: number;
  marketMediumPrice: number;
  marketHighestPrice: number;
}

const MAUTIC_URL = 'https://crm.kyte.is/';
const BEARER_TOKEN = import.meta.env.MAUTIC_BEARER_TOKEN;

if (!BEARER_TOKEN) {
    console.error('MAUTIC_BEARER_TOKEN is not defined in environment variables');
    throw new Error("Missing MAUTIC_BEARER_TOKEN");
}

export async function createMauticContact(contactData: MauticContact) {
    try {
        if (!contactData.email) {
            throw new Error('Email is required for creating a Mautic contact');
        }

        const response = await axios.post(
      `${MAUTIC_URL}api/contacts/new`,
      {
        "email": contactData.email,
        "custom": {
          "productName": contactData.productName,
          "idealPrice": contactData.idealPrice,
          "baseCost": contactData.baseCost,
          "profitMargin": contactData.profitMargin,
          "operationalCosts": contactData.operationalCosts,
          "creditCardFees": contactData.creditCardFees,
          "taxes": contactData.taxes,
          "marketLowestPrice": contactData.marketLowestPrice,
          "marketMediumPrice": contactData.marketMediumPrice,
          "marketHighestPrice": contactData.marketHighestPrice
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${BEARER_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating Mautic contact:', error);
    throw error;
  }
}