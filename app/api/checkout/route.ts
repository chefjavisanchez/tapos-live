import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

// Price IDs (from our previous steps)
// Independent: 109.99 (includes shipping)
const PRICE_INDEPENDENT = 'price_1SsDNwAqqte3JdvPnWUnhced';

// Corporate Setup: $75.00
const PRICE_CORPORATE_SETUP = 'price_1SsCxWAqqte3JdvPraeb1r0w';

export async function POST(req: NextRequest) {
    try {
        const { plan, quantity = 1, referralCode } = await req.json();

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
            // Setup Fee is fixed at $75 per user
            const setupPricePerUnit = 7500; // $75.00

            // 1. Setup Fee
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'TapOS Corporate Setup',
                        description: 'Setup and hardware fee per user',
                    },
                    unit_amount: setupPricePerUnit,
                },
                quantity: quantity,
            });

            // 2. Calculate Shipping based on Volume (Previous logic)
            let shippingAmount = 0;
            if (quantity >= 5 && quantity <= 20) {
                shippingAmount = 1999;
            } else if (quantity >= 21 && quantity <= 100) {
                shippingAmount = 3999;
            } else if (quantity > 100) {
                shippingAmount = 5999;
            } else {
                shippingAmount = 1999;
            }

            // Add Shipping
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

            // 3. Add Recurring Monthly License
            let licensePricePerUnit = 0;
            if (quantity <= 20) {
                licensePricePerUnit = 1000; // $10
            } else if (quantity <= 100) {
                licensePricePerUnit = 800;  // $8
            } else {
                licensePricePerUnit = 600;  // $6
            }

            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'TapOS Monthly License',
                        description: 'Recurring platform access per user',
                    },
                    unit_amount: licensePricePerUnit,
                    recurring: {
                        interval: 'month' as const,
                    },
                },
                quantity: quantity,
            });

            successUrl += `&plan=corporate&quantity=${quantity}`;
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2025-12-15.clover' as any,
        });

        const session = await stripe.checkout.sessions.create({
            cancel_url: 'https://tapos360.com/pricing',
            success_url: successUrl,
            mode: plan === 'corporate' ? 'subscription' : 'payment',
            line_items: lineItems,
            allow_promotion_codes: true,
            metadata: {
                referral_code: referralCode || null,
                plan_type: plan,
                quantity: quantity
            }
        });

        return NextResponse.json({ url: session.url });

    } catch (error: any) {
        console.error('Stripe Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
