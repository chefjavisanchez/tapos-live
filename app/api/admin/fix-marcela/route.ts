import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const slug = 'marcelamccall';
    const newName = 'Marcela McCall';

    try {
        // 1. Fetch current content
        const { data: card, error: fetchError } = await supabase
            .from('cards')
            .select('content')
            .eq('slug', slug)
            .single();

        if (fetchError || !card) {
            return NextResponse.json({ error: 'Card not found', detail: fetchError }, { status: 404 });
        }

        const updatedContent = {
            ...card.content,
            fullName: newName
        };

        // 2. Update content
        const { error: updateError } = await supabase
            .from('cards')
            .update({ content: updatedContent })
            .eq('slug', slug);

        if (updateError) {
            return NextResponse.json({ error: 'Update failed', detail: updateError }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: `Updated ${slug} to ${newName}` });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
