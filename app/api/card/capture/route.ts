import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // We still need supabase for GHL trigger context if needed, or we fetch slug inside updateCardContent? 
// Actually updateCardContent only returns the new content/data from update.
// We need the slug for GHL. 
// Let's modify updateCardContent to return the full record if possible, or just re-fetch slug?
// Re-fetching slug is wasteful.
// Let's stick to updateCardContent having a specialized purpose.
// But we need the slug. 
// I'll fetch the slug separately or modify updateCardContent to return it.
// Actually, `updateCardContent` returns `data`. 
// But the `data` returned by `update().select()` contains all columns if we select them?
// My `updateCardContent` does `.select()`. Default is all columns? No, usually representation.
// Let's assume it returns what we need if we select * or just default.
// Wait, my `updateCardContent` implementation does `await updateQuery.select()`. This returns modified rows.
// So `updateData[0]` will have the slug if I selected it?
// `update()` with `select()` returns the modified rows. By default all columns? Yes, usually.
// So I can get the slug from the result of `updateCardContent`.

import { updateCardContent } from '@/lib/card-utils';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cardId, ownerId, name, phone, email, note } = body;

        // 1. Atomic Update
        let finalCardData: any = null;

        await updateCardContent(cardId, (content) => {
            if (!content.leads) content.leads = [];
            content.leads.push({
                name, phone, email, note,
                date: new Date().toISOString()
            });
            return content;
        }).then(res => {
            if (res && res.data && res.data.length > 0) {
                finalCardData = res.data[0];
            }
        });

        // 2. Trigger GHL Automation (Auto-Text)
        if (finalCardData && finalCardData.slug) {
            const GHL_URL = process.env.GHL_WEBHOOK_URL;
            if (GHL_URL) {
                fetch(GHL_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: 'LEAD_CAPTURE',
                        source: 'TAPOS_CARD_PROFILE',
                        card_id: cardId,
                        owner_id: ownerId,
                        card_slug: finalCardData.slug,
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

