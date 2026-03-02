import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '@/lib/admin-config';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const token = authHeader.replace('Bearer ', '');
        const { data: { user: adminUser }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !adminUser || !isAdmin(adminUser.email)) {
            return NextResponse.json({ error: 'Forbidden: Admin Access Only' }, { status: 403 });
        }

        const { userId, isSponsor } = await req.json();
        if (!userId) return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });

        // Update User Metadata via Admin Auth API
        const { data, error: updateError } = await supabase.auth.admin.updateUserById(
            userId,
            { user_metadata: { is_sponsor: isSponsor } }
        );

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, isSponsor });

    } catch (err: any) {
        console.error('Toggle Sponsor Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
