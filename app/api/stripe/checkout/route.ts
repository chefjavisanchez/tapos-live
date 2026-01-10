import Stripe from 'stripe';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Initialize Stripe with fallback for build time
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_build_placeholder', {
    // apiVersion: '2023-10-16', 
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cardId, email, slug, title, variant } = body; // variant: 'card' | 'bundle'
        const origin = req.headers.get('origin');

        if (!cardId || !slug) {
            return NextResponse.json({ error: 'Missing Card ID' }, { status: 400 });
        }

        // DETERMINE PRODUCT & PRICE
        let priceInCents = 9900; // Default $99
        let productName = `TapOS License: ${title || slug}`;
        let productDesc = 'Professional Digital Identity + Premium Card';

        if (variant === 'bundle') {
            priceInCents = 12900; // $129
            productName = `TapOS Ultimate Bundle: ${title || slug}`;
            productDesc = 'Lifetime License + Premium Card + NFC Bracelet';
        } else if (variant === 'bracelet') {
            priceInCents = 3000; // $30
            productName = `NFC Bracelet Upgrade`;
            productDesc = 'Premium NFC Bracelet (Add-on)';
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: productName,
                            description: productDesc,
                        },
                        unit_amount: priceInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/editor?id=${cardId}&payment_success=true`,
            cancel_url: `${origin}/editor?id=${cardId}`,

            // KEY: This ensures we get the ID back in the webhook
            client_reference_id: cardId,

            // FORCE ADDRESS COLLECTION & SHIPPING FEE
            shipping_address_collection: {
                allowed_countries: ['US', 'PR', 'CA', 'GB', 'MX', 'ES'],
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: { amount: variant === 'bundle' ? 1099 : 799, currency: 'usd' },
                        display_name: 'Standard Shipping',
                        delivery_estimate: {
                            minimum: { unit: 'business_day', value: 3 },
                            maximum: { unit: 'business_day', value: 7 },
                        },
                    },
                },
            ],
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
