import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cardId, type } = body; // type = 'view' | 'save'

        if (!cardId || !type) {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        // 1. Fetch current analytics
        const { data: cardData, error: fetchError } = await supabase
            .from('cards')
            .select('content')
            .eq('id', cardId)
            .single();

        if (fetchError || !cardData) {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }

        const content = cardData.content || {};
        const analytics = content.analytics || { views: 0, saves: 0 };

        // 2. Increment Counter
        if (type === 'view') {
            analytics.views = (analytics.views || 0) + 1;
        } else if (type === 'save') {
            analytics.saves = (analytics.saves || 0) + 1;
        }

        // 3. Update DB
        const { error: updateError } = await supabase
            .from('cards')
            .update({ content: { ...content, analytics } })
            .eq('id', cardId);

        if (updateError) {
            console.error('Analytics Update Failed', updateError);
            return NextResponse.json({ error: 'Update failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true, views: analytics.views, saves: analytics.saves });

    } catch (err: any) {
        console.error('Analytics Error:', err);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
