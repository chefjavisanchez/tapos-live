import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const body = await request.json();
    const { referrer } = body;

    if (!referrer) {
        return NextResponse.json({ error: 'No referrer provided' }, { status: 400 });
    }

    // Use Service Role to query stats securely
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        // 1. Get Referrer Details (for email info)
        const { data: referrerCard } = await supabaseAdmin
            .from('cards')
            .select('content')
            .eq('slug', referrer)
            .single();

        // 2. Count Total Referrals
        // We use contains to find cards where content->referrer == referrer slug
        const { count, error } = await supabaseAdmin
            .from('cards')
            .select('id', { count: 'exact', head: true })
            .contains('content', { referrer: referrer });

        if (error) throw error;

        const currentCount = count || 0;

        // CHECK FOR WIN (Every 5 referrals: 5, 10, 15...)
        if (currentCount > 0 && currentCount % 5 === 0) {

            console.log(`🏆 REFERRAL WINNER: ${referrer} hit ${currentCount} referrals!`);

            // TRIGGER GHL NOTIFICATION
            const GHL_URL = process.env.GHL_WEBHOOK_URL;
            if (GHL_URL) {
                await fetch(GHL_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event: 'REFERRAL_MILESTONE_REACHED',
                        referrer_slug: referrer,
                        referrals_count: currentCount,
                        prize: '30_DAYS_FREE_ADS',
                        winner_email: referrerCard?.content?.email || 'unknown',
                        winner_name: referrerCard?.content?.fullName || 'unknown',
                        message: `User ${referrer} has reached ${currentCount} referrals! Prize Unlocked.`
                    })
                });
            }

            return NextResponse.json({
                success: true,
                milestoneReached: true,
                count: currentCount
            });
        }

        return NextResponse.json({
            success: true,
            milestoneReached: false,
            count: currentCount
        });

    } catch (err: any) {
        console.error('Referral Check Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
