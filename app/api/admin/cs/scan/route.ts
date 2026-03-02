import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '@/lib/admin-config';

export const dynamic = 'force-dynamic';

/**
 * AUTOMATED CHURN SCAN
 * This endpoint identifies users who haven't been active for 7+ days.
 * It can be triggered daily by a GitHub Action or Cron Job.
 */
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const token = authHeader.replace('Bearer ', '');
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user } } = await supabase.auth.getUser(token);
        if (!user || !isAdmin(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        // Authorized - Use Service Role for Admin Scan
        const adminDb = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 1. Fetch all users
        const { data: { users }, error: usersError } = await adminDb.auth.admin.listUsers();
        if (usersError) throw usersError;

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const atRiskUsers = users.filter(u => {
            const lastActive = u.user_metadata?.last_active_at ? new Date(u.user_metadata.last_active_at) : null;
            return !lastActive || lastActive < sevenDaysAgo;
        });

        // 2. Notify (Placeholder for GHL or Email)
        // If GHL_WEBHOOK_URL is set, we could fire it here.
        const GHL_URL = process.env.GHL_WEBHOOK_URL;

        console.log(`🔍 CS SCAN: Found ${atRiskUsers.length} users at risk.`);

        if (GHL_URL && atRiskUsers.length > 0) {
            await fetch(GHL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event: 'CHURN_ALERT_BATCH',
                    timestamp: new Date().toISOString(),
                    userCount: atRiskUsers.length,
                    users: atRiskUsers.map(u => ({ email: u.email, score: u.user_metadata?.onboarding_score }))
                })
            });
        }

        return NextResponse.json({
            success: true,
            scanned: users.length,
            atRisk: atRiskUsers.length
        });

    } catch (err: any) {
        console.error('CS Scan Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
