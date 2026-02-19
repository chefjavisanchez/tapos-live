import { NextResponse } from 'next/server';

// Force dynamic to prevent caching issues
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cardId, type } = body;

        if (!cardId || !['view', 'save'].includes(type)) {
            return NextResponse.json({ error: 'Invalid Request' }, { status: 400 });
        }

        // Robust Supabase client instantiation for Vercel
        const { createClient } = require('@supabase/supabase-js');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const supabase = createClient(supabaseUrl, supabaseKey);

        const { data: cardData, error: fetchError } = await supabase
            .from('cards')
            .select('content')
            .eq('id', cardId)
            .single();

        if (fetchError || !cardData) {
            throw new Error('Card not found');
        }

        let content = cardData.content || {};
        if (!content.analytics) {
            content.analytics = { views: 0, saves: 0 };
        }

        if (type === 'view') {
            content.analytics.views = (content.analytics.views || 0) + 1;
        } else if (type === 'save') {
            content.analytics.saves = (content.analytics.saves || 0) + 1;
        }

        const { error: updateError } = await supabase
            .from('cards')
            .update({ content })
            .eq('id', cardId);

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error('Analytics API Error:', err);
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}

