import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cardId, ownerId, name, phone, email, note } = body;

        // 1. Save locally to Card Content (Leads Array)
        const { data: cardData, error: fetchError } = await supabase
            .from('cards')
            .select('content, slug') // Get slug for GHL
            .eq('id', cardId)
            .single();

        if (cardData) {
            const content = cardData.content || {};
            if (!content.leads) content.leads = [];

            content.leads.push({
                name, phone, email, note,
                date: new Date().toISOString()
            });

            // Update DB
            await supabase
                .from('cards')
                .update({ content })
                .eq('id', cardId);

            // 2. Trigger GHL Automation (Auto-Text)
            const GHL_URL = process.env.GHL_WEBHOOK_URL;
            if (GHL_URL) {
                // We send a specific structure for "Lead Capture"
                // The automation on GHL side should handle "TAPOS_CARD_CAPTURE" event
                fetch(GHL_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: 'LEAD_CAPTURE',
                        source: 'TAPOS_CARD_PROFILE',
                        card_id: cardId,
                        owner_id: ownerId,
                        card_slug: cardData.slug,
                        lead_name: name,
                        lead_phone: phone,
                        lead_email: email
                    })
                }).catch(err => console.error("GHL Trigger Failed", err));
            }
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error('Lead Capture Error:', err);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
