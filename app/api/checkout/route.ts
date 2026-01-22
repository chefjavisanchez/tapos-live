import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

// Price IDs (from our previous steps)
// Independent: 109.99 (includes shipping)
const PRICE_INDEPENDENT = 'price_1SsDNwAqqte3JdvPnWUnhced';

// Corporate Setup: $75.00
const PRICE_CORPORATE_SETUP = 'price_1SsCxWAqqte3JdvPraeb1r0w';

export async function POST(req: NextRequest) {
    try {
        const { plan, quantity = 1 } = await req.json();

        let lineItems = [];
        let successUrl = 'https://tapos360.com/activate?session_id={CHECKOUT_SESSION_ID}';

        if (plan === 'independent') {
            lineItems.push({
                price: PRICE_INDEPENDENT,
                quantity: 1,
            });
            successUrl += '&plan=independent';
        }
        else if (plan === 'corporate') {
            // 1. Setup Fee ($75 * Quantity)
            lineItems.push({
                price: PRICE_CORPORATE_SETUP,
                quantity: quantity,
            });

            // 2. Calculate Shipping based on Volume
            let shippingAmount = 0;
            if (quantity >= 5 && quantity <= 20) {
                shippingAmount = 1999; // $19.99
            } else if (quantity >= 21 && quantity <= 100) {
                shippingAmount = 3999; // $39.99
            } else if (quantity > 100) {
                shippingAmount = 5999; // $59.99
            } else {
                // Default handling for < 5 users if valid? Assuming min $19.99 or per-item?
                // User said "from 5 to 20", implying < 5 might handle differently, but let's default to basic shipping or $19.99 for now to be safe.
                shippingAmount = 1999;
            }

            // Add Shipping as a custom line item
            if (shippingAmount > 0) {
                lineItems.push({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Volume Shipping & Handling',
                            description: `Shipping for ${quantity} units`,
                        },
                        unit_amount: shippingAmount,
                    },
                    quantity: 1,
                });
            }

            successUrl += '&plan=corporate';
        }

        const session = await stripe.checkout.sessions.create({
            cancel_url: 'https://tapos360.com/pricing',
            success_url: successUrl,
            mode: 'payment',
            line_items: lineItems,
            allow_promotion_codes: true,
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error('Stripe Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
