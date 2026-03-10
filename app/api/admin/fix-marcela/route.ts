import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        // Search for Marcela in the content->fullName
        const { data: cards, error: fetchError } = await supabase
            .from('cards')
            .select('slug, content')
            .ilike('content->>fullName', '%Marcela%');

        if (fetchError) {
            return NextResponse.json({ error: 'Search failed', detail: fetchError }, { status: 500 });
        }

        if (!cards || cards.length === 0) {
            // Try searching in the slug itself as fallback
            const { data: slugCards, error: slugError } = await supabase
                .from('cards')
                .select('slug, content')
                .ilike('slug', '%marcela%');
            
            if (slugError || !slugCards || slugCards.length === 0) {
                return NextResponse.json({ error: 'No Marcela found in DB', cardsFound: 0 });
            }
            
            // If found by slug, update them all
            for (const card of slugCards) {
                const updatedContent = {
                    ...card.content,
                    fullName: 'Marcela McCall'
                };
                await supabase
                    .from('cards')
                    .update({ content: updatedContent })
                    .eq('slug', card.slug);
            }
            return NextResponse.json({ success: true, updated: slugCards.map(c => c.slug) });
        }

        // Update all found cards
        for (const card of cards) {
            const updatedContent = {
                ...card.content,
                fullName: 'Marcela McCall'
            };
            await supabase
                .from('cards')
                .update({ content: updatedContent })
                .eq('slug', card.slug);
        }

        return NextResponse.json({ 
            success: true, 
            message: `Updated ${cards.length} Marcela cards`, 
            slugs: cards.map(c => c.slug) 
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
