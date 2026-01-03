import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// FORCE DYNAMIC - This is critical for Webhooks to avoid static optimization
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    // 1. SAFEGUARD: Check Keys inside the request (Runtime Execution)
    // This prevents the "Build" step from crashing if keys are missing in the build environment.
    const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
    const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Prefer Service Role, fall back to Anon (Anon will likely fail RLS, but prevents crash)
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!STRIPE_KEY || !WEBHOOK_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        console.error('MISSING ENV VARS IN WEBHOOK');
        // Return 500 but do not crash the build
        return NextResponse.json({ error: 'Server Misconfiguration: Missing Keys' }, { status: 500 });
    }

    // 2. INITIALIZE CLIENTS (Runtime only)
    const stripe = new Stripe(STRIPE_KEY, {
        apiVersion: '2023-10-16', // Valid stable version
    });

    const adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const body = await req.text();
    const sig = headers().get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        // 1. Get the Card ID from the link parameters
        const cardId = session.client_reference_id;

        console.log(`💰 Payment received for Card ID: ${cardId}`);

        if (cardId) {
            // Fetch current card
            const { data: card, error: fetchError } = await adminSupabase
                .from('cards')
                .select('content')
                .eq('id', cardId)
                .single();

            if (card && !fetchError) {
                const newContent = {
                    ...card.content,
                    subscription: 'active',
                    paymentId: session.id,
                    paymentDate: new Date().toISOString()
                };

                const { error: updateError } = await adminSupabase
                    .from('cards')
                    .update({ content: newContent })
                    .eq('id', cardId);

                if (updateError) {
                    console.error('Failed to activate card:', updateError);
                    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
                }
                console.log(`✅ Card ${cardId} ACTIVATED successfully.`);

                // ---------------------------------------------------------
                // 3. TRIGGER GOHIGHLEVEL AUTOMATION (Welcome Email / SMS)
                // ---------------------------------------------------------
                const GHL_URL = process.env.GHL_WEBHOOK_URL;
                if (GHL_URL) {
                    try {
                        console.log('🚀 Triggering GHL Webhook...');
                        await fetch(GHL_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                card_id: cardId,
                                slug: card.content.slug, // Ensure slug is sent
                                email: card.content.email, // Ensure email is sent
                                name: card.content.fullName,
                                phone: card.content.phone,
                                payment_id: session.id,
                                source: 'TAPOS_PAYMENT_SUCCESS'
                            })
                        });
                        console.log('✅ GHL Triggered.');
                    } catch (ghlError) {
                        console.error('⚠️ GHL Webhook Failed:', ghlError);
                        // Don't fail the request, just log it
                    }
                } else {
                    console.log('ℹ️ No GHL_WEBHOOK_URL defined. Skipping automation.');
                }
                // ---------------------------------------------------------
            } else {
                console.error('Card not found for activation:', fetchError);
            }
        } else {
            console.warn('⚠️ No client_reference_id found in session.');
        }
    }

    return NextResponse.json({ received: true });
}
