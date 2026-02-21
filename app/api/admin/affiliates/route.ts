import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '@/lib/admin-config';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
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

    // 2. Fetch Data with Service Key
    const adminDb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch all cards. We will filter out the affiliated ones in code since JSONB contains queries can be tricky/slow
    const { data: cards, error: dbError } = await adminDb
        .from('cards')
        .select('id, user_id, slug, title, content, created_at');

    if (dbError || !cards) {
        return NextResponse.json({ error: dbError?.message || 'Failed fetching cards' }, { status: 500 });
    }

    // Build Affiliate Ledger
    // Key: string (the referrer slug) -> Value: AffiliateStats Object
    const affiliateLedger: Record<string, any> = {};

    // First pass: Find all users that ARE affiliates (i.e. someone used their slug as a referrer)
    cards.forEach(card => {
        const referrerSlug = card.content?.affiliate_referrer;
        const isActive = card.content?.subscription === 'active';

        if (referrerSlug && isActive) {
            // Found a valid paid referral!

            // 1. Ensure the affiliate exists in our ledger
            if (!affiliateLedger[referrerSlug]) {
                affiliateLedger[referrerSlug] = {
                    affiliateSlug: referrerSlug,
                    totalReferrals: 0,
                    unpaidReferrals: 0,
                    paidReferrals: 0,
                    totalAmountOwed: 0,
                    historicalAmountPaid: 0,
                };
            }

            const affiliate = affiliateLedger[referrerSlug];
            affiliate.totalReferrals += 1;

            // Calculate Commission (15% of amount paid, default to base $99)
            const amountPaidCents = card.content?.amount_paid || 9900;
            const commissionAmount = parseFloat(((amountPaidCents / 100) * 0.15).toFixed(2));

            // 2. Check if this specific referral has been paid out yet
            if (card.content?.affiliatePaid) {
                affiliate.paidReferrals += 1;
                affiliate.historicalAmountPaid += card.content?.affiliatePayoutAmount || commissionAmount;
            } else {
                affiliate.unpaidReferrals += 1;
                affiliate.totalAmountOwed += commissionAmount;
            }
        }
    });

    // We only care about users who ACTUALLY HAVE referrals
    const activeAffiliates = Object.values(affiliateLedger);

    // To make the UI friendly, let's attach the Affiliate's Card Details (so we can get their email/name)
    const enrichedAffiliates = activeAffiliates.map(affiliate => {
        // Find the card that belongs to THIS affiliate (slug match)
        const affiliateCard = cards.find(c => c.slug === affiliate.affiliateSlug);

        return {
            ...affiliate,
            affiliateName: affiliateCard?.content?.fullName || affiliateCard?.title || affiliate.affiliateSlug,
            affiliateEmail: affiliateCard?.content?.email || 'Unknown Email',
        };
    });

    // Sort heavily owed people to the top
    enrichedAffiliates.sort((a, b) => b.totalAmountOwed - a.totalAmountOwed);

    return NextResponse.json({
        success: true,
        affiliates: enrichedAffiliates,
        globalStats: {
            totalOwed: enrichedAffiliates.reduce((acc, a) => acc + a.totalAmountOwed, 0),
            totalPaidHistorical: enrichedAffiliates.reduce((acc, a) => acc + a.historicalAmountPaid, 0)
        }
    });
}
