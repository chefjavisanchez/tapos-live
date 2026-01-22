import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '@/lib/admin-config';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        // 1. Verify Admin Session (Server-Side)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // MUST use Service Role to bypass potential RLS

        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Verify the token belongs to Javi
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: 'Forbidden: Invalid Token' }, { status: 403 });
        }

        if (!isAdmin(user.email)) {
            return NextResponse.json({ error: 'Forbidden: Admin Access Only' }, { status: 403 });
        }

        // 2. Parse Body
        const { cardId } = await req.json();
        if (!cardId) return NextResponse.json({ error: 'Missing Card ID' }, { status: 400 });

        // 3. Delete the Card from the Database
        const { error: deleteError } = await supabase
            .from('cards')
            .delete()
            .eq('id', cardId);

        if (deleteError) {
            throw deleteError;
        }

        return NextResponse.json({ success: true, message: 'Card Permanently Deleted' });

    } catch (err: any) {
        console.error('Delete Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
