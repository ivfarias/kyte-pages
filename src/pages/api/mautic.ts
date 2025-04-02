import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    const MAUTIC_URL = 'https://crm.kyte.is/';
    const USERNAME = import.meta.env.MAUTIC_USERNAME;
    const PASSWORD = import.meta.env.MAUTIC_PASSWORD;

    try {
        const contactData = await request.json();
        const basicAuth = btoa(`${USERNAME}:${PASSWORD}`);

        const response = await fetch(`${MAUTIC_URL}api/contacts/new`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${basicAuth}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error in Mautic API:', error);
        return new Response(JSON.stringify({ error: 'Failed to create contact' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
