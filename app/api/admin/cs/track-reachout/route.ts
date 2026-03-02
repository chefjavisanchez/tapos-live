import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '@/lib/admin-config';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const token = authHeader.replace('Bearer ', '');
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user } } = await supabase.auth.getUser(token);
        if (!user || !isAdmin(user.email)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        const { userId } = await req.json();
        if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

        // Update with Service Role
        const adminDb = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { error } = await adminDb.auth.admin.updateUserById(userId, {
            user_metadata: { last_contacted_at: new Date().toISOString() }
        });

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
