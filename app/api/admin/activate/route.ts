import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!SUPABASE_SERVICE_KEY) return NextResponse.json({ error: 'No Service Key' }, { status: 500 });

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 1. Find the card by slug
    const { data: card, error: findError } = await supabase
        .from('cards')
        .select('*')
        .eq('slug', slug)
        .single();

    if (findError || !card) return NextResponse.json({ error: 'User not found', details: findError }, { status: 404 });

    // 2. Activate
    const newContent = {
        ...card.content,
        subscription: 'active',
        activatedBy: 'ADMIN_OVERRIDE'
    };

    const { error: updateError } = await supabase
        .from('cards')
        .update({ content: newContent })
        .eq('id', card.id);

    if (updateError) return NextResponse.json({ error: 'Update failed', details: updateError }, { status: 500 });

    return NextResponse.json({ success: true, message: `Activated ${slug}` });
}
