import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

    const { data, error } = await supabase
        .from('cards')
        .select('content')
        .eq('slug', slug)
        .single();

    if (error || !data) {
        console.error('Profile Lite Error:', error);
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const content = data.content || {};
    return NextResponse.json({
        name: content.fullName || '',
        email: content.email || '',
        phone: content.phone || '',
        title: content.jobTitle || '',
        company: content.company || '',
        eventOwnerId: content.eventOwnerId || null
    });
}
