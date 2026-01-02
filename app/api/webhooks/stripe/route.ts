import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // This is acceptable if using service_role in a robust backend, but for this quick actions we might need SERVICE_ROLE key if RLS blocks ANON updates to other users' cards.
    // RECOMMENDATION: We need SUPABASE_SERVICE_ROLE_KEY for the backend to bypass RLS and update ANY card.
);

// We need a specific Supabase Admin client to update cards without owning them
// BUT for now, we will try with anon key. If RLS fails, we need SERVICE_ROLE_KEY.
// Let's assume user Javi adds SERVICE_ROLE_KEY later. For now, we use standard client.
// Actually, RLS usually blocks regular users from updating others.
// The Webhook is a "System" actor. It NEEDS the SERVICE_ROLE_KEY.
// I will code it to use SUPABASE_SERVICE_ROLE_KEY if available.

const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const body = await req.text();
    const sig = headers().get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
        if (!endpointSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
        event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
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
            // 2. ACTIVATE THE CARD IN SUPABASE
            // We need to fetch the existing content first to avoid overwriting invalidly?
            // Or just use jsonb_set to update only the subscription field.

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
            } else {
                console.error('Card not found for activation:', fetchError);
            }
        } else {
            console.warn('⚠️ No client_reference_id found in session.');
        }
    }

    return NextResponse.json({ received: true });
}
