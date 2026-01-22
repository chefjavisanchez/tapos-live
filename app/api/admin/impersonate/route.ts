import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '@/lib/admin-config';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        const authHeader = req.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user || !isAdmin(user.email)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { userId } = await req.json();
        if (!userId) return NextResponse.json({ error: 'Missing User ID' }, { status: 400 });

        // Generate a magic link for this user
        const { data: { user: targetUser }, error: fetchError } = await supabase.auth.admin.getUserById(userId);
        if (fetchError || !targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const { data, error: linkError } = await supabase.auth.admin.generateLink({
            type: 'magiclink',
            email: targetUser.email!,
            options: {
                redirectTo: `${new URL(req.url).origin}/`
            }
        });

        if (linkError) throw linkError;

        return NextResponse.json({
            success: true,
            magicLink: data.properties.action_link
        });

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
