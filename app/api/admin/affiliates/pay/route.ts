import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '@/lib/admin-config';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // 1. Verify Requesting User Authority
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        return NextResponse.json({ error: 'Auth Failed' }, { status: 401 });
    }

    if (!isAdmin(user.email)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 2. Parse the request body for the Affiliate Slug
    let affiliateSlug;
    try {
        const body = await req.json();
        affiliateSlug = body.affiliateSlug;
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (!affiliateSlug) {
        return NextResponse.json({ error: 'Missing affiliateSlug in request' }, { status: 400 });
    }

    // 3. Setup Admin Service DB to perform the update
    const adminDb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch all active cards that were referred by this affiliate and are UNPAID
    const { data: unpaidCards, error: dbError } = await adminDb
        .from('cards')
        .select('id, content');

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Filter in JS to find the exact cards we need to update
    const cardsToUpdate = unpaidCards.filter(c => {
        return c.content?.referrer === affiliateSlug &&
            c.content?.subscription === 'active' &&
            !c.content?.affiliatePaid;
    });

    if (cardsToUpdate.length === 0) {
        return NextResponse.json({ success: true, message: 'No unpaid referrals found for this affiliate.', updatedCount: 0 });
    }

    let updatedCount = 0;
    const errors = [];
    const timestamp = new Date().toISOString();

    // Update each card individually since Supabase JS Client doesn't have an easy bulk-update for JSONB
    for (const card of cardsToUpdate) {
        const newContent = {
            ...card.content,
            affiliatePaid: true,
            affiliatePayoutDate: timestamp,
            affiliatePayoutAmount: 20 // $20 Default
        };

        const { error: updateError } = await adminDb
            .from('cards')
            .update({ content: newContent })
            .eq('id', card.id);

        if (updateError) {
            console.error(`Failed to update card ${card.id}:`, updateError);
            errors.push(card.id);
        } else {
            updatedCount++;
        }
    }

    return NextResponse.json({
        success: true,
        updatedCount,
        errors: errors.length > 0 ? errors : undefined,
    });
}
