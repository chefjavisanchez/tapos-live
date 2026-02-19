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
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const { cardId, ownerId, name, email, phone, note } = await request.json();

        // 1. Insert into SQL 'leads' table (Admin Client bypasses RLS if needed, but we set public policy too)

        // Robust Supabase client instantiation for Vercel
        const { createClient } = require('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Quick fallback: If the database `card_id` is set as a UUID, inserting
        // an integer (like 4) will crash heavily. We nullify it temporarily to 
        // ensure the lead saves successfully to the Lead Manager dashboard.
        const isValidUUID = typeof cardId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cardId);
        const safeCardId = isValidUUID ? cardId : null;

        const { error: insertError } = await supabase
            .from('leads')
            .insert({
                card_id: safeCardId,
                owner_id: ownerId,
                name,
                email,
                phone,
                note
            });

        if (insertError) {
            console.error("SQL Insert Error:", insertError);
            throw insertError;
        }

        // 2. Trigger GHL Webhook (Fire & Forget)
        if (process.env.GHL_WEBHOOK_URL) {
            fetch(process.env.GHL_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    notes: note,
                    tags: ['TapOS Capture', 'Digital Card'],
                    card_id: cardId
                })
            }).catch(err => console.error("GHL Webhook Failed:", err));
        }

        return NextResponse.json({ success: true });

    } catch (e: any) {
        console.error("Capture API Error:", e);
        return NextResponse.json({ error: e.message || 'Error capturing lead' }, { status: 500 });
    }
}
