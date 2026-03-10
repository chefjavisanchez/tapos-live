import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        // 1. Find cards by name "Marcela"
        const { data: cards, error: fetchError } = await supabase
            .from('cards')
            .select('id, slug, content')
            .ilike('content->>fullName', '%Marcela%');

        if (fetchError) return NextResponse.json({ error: 'Search failed', detail: fetchError });

        if (!cards || cards.length === 0) {
            return NextResponse.json({ error: 'No Marcela card found to fix.' });
        }

        const results = [];
        for (const card of cards) {
            const updatedContent = {
                ...card.content,
                fullName: 'Marcela McCall'
            };

            // Set slug to 'marcelamccall' if it's currently empty or if it's the intended one
            const { error: updateError } = await supabase
                .from('cards')
                .update({ 
                    content: updatedContent,
                    slug: 'marcelamccall' // FORCE the correct slug
                })
                .eq('id', card.id);

            results.push({
                id: card.id,
                oldSlug: card.slug,
                newSlug: 'marcelamccall',
                success: !updateError,
                error: updateError
            });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Applied fix: Set name and slug for Marcela.",
            results 
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message });
    }
}
