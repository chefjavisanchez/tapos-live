import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic to prevent caching issues
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cardId, type } = body;

        if (!cardId || !['view', 'save'].includes(type)) {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
        }

        // 1. Fetch current content
        const { data, error } = await supabase
            .from('cards')
            .select('content')
            .eq('id', cardId)
            .single();

        if (error || !data) {
            console.error('Analytics Fetch Error:', error);
            // It's analytics, don't crash client
            return NextResponse.json({ success: false });
        }

        let content = data.content;

        // Initialize if missing
        if (!content.analytics) {
            content.analytics = { views: 0, saves: 0 };
        }

        // 2. Increment
        if (type === 'view') {
            content.analytics.views = (content.analytics.views || 0) + 1;
        } else if (type === 'save') {
            content.analytics.saves = (content.analytics.saves || 0) + 1;
        }

        // 3. Update
        const { error: updateError } = await supabase
            .from('cards')
            .update({ content: content })
            .eq('id', cardId);

        if (updateError) {
            console.error('Analytics Update Error:', updateError);
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error('Analytics API Error:', err);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
