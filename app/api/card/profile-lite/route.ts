import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
        .from('cards')
        .select('content')
        .eq('slug', slug)
        .single();

    if (error || !data) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const content = data.content || {};
    return NextResponse.json({
        name: content.fullName || '',
        email: content.email || '',
        phone: content.phone || '',
        title: content.jobTitle || '',
        company: content.company || ''
    });
}
