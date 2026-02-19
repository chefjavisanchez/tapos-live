import { NextResponse } from 'next/server';
import { updateCardContent } from '@/lib/card-utils';

// Force dynamic to prevent caching issues
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cardId, type } = body;

        if (!cardId || !['view', 'save'].includes(type)) {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
        }

        await updateCardContent(cardId, (content) => {
            if (!content.analytics) {
                content.analytics = { views: 0, saves: 0 };
            }

            if (type === 'view') {
                content.analytics.views = (content.analytics.views || 0) + 1;
            } else if (type === 'save') {
                content.analytics.saves = (content.analytics.saves || 0) + 1;
            }
            return content;
        });

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error('Analytics API Error:', err);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

