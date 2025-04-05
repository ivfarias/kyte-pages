import axios from 'axios';

interface MauticContact {
  productName: string;
  businessSegment: string;
  idealPrice: number;
  baseCost: number;
  profitMargin: number;
  email: string;
  marketLowestPrice: number;
  marketMediumPrice: number;
  marketHighestPrice: number;
  country?: string; // Optional field for country
}

export async function createMauticContact(contactData: MauticContact) {
  try {
    if (!contactData.email) {
      throw new Error('Email is required for creating a Mautic contact');
    }

    const mauticData = {
      email: contactData.email,
      productname: contactData.productName,
      businesssegment: contactData.businessSegment,
      idealprice: contactData.idealPrice,
      basecost: contactData.baseCost,
      profitmargin: contactData.profitMargin,
      marketlowestprice: contactData.marketLowestPrice,
      marketmediumprice: contactData.marketMediumPrice,
      markethighestprice: contactData.marketHighestPrice,
      country: contactData.country || 'Brazil',
    };

    console.log('📤 Sending data to Mautic:', mauticData);
    const response = await axios.post(
      '/api/mautic',
      mauticData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Mautic contact created:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error creating Mautic contact:', error);
    throw error;
  }
}