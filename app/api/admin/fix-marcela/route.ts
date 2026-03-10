import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { data: byContent } = await supabase
            .from('cards')
            .select('*')
            .ilike('content->>fullName', '%Marcela%');

        const { data: bySlug } = await supabase
            .from('cards')
            .select('*')
            .ilike('slug', '%marcela%');

        return NextResponse.json({ 
            byContent: byContent || [], 
            bySlug: bySlug || [] 
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message });
    }
}
