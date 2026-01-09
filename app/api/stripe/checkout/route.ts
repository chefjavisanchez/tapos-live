import Stripe from 'stripe';
import { NextResponse } from 'next/server';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    // apiVersion: '2023-10-16', // Let it default to package version
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cardId, email, slug, title } = body;
        const origin = req.headers.get('origin');

        if (!cardId || !slug) {
            return NextResponse.json({ error: 'Missing Card ID' }, { status: 400 });
        }

        // EDIT PRICE HERE
        const PRICE_IN_CENTS = 9900; // $99.00 USD

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `TapOS License: ${title || slug}`,
                            description: 'Professional Digital Identity Activation',
                            // images: ['https://tapos360.com/logo.png'], // Add logo if available
                        },
                        unit_amount: PRICE_IN_CENTS,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/editor?id=${cardId}&payment_success=true`,
            cancel_url: `${origin}/editor?id=${cardId}`,

            // KEY: This ensures we get the ID back in the webhook
            client_reference_id: cardId,

            // FORCE ADDRESS COLLECTION
            shipping_address_collection: {
                allowed_countries: ['US', 'PR', 'CA', 'GB', 'MX', 'ES'],
            },
            phone_number_collection: {
                enabled: true,
            },

            // Prefill email if likely correct
            customer_email: email,

            metadata: {
                cardId: cardId,
                slug: slug
            }
        });

        return NextResponse.json({ url: session.url });

    } catch (err: any) {
        console.error('Stripe Checkout Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
