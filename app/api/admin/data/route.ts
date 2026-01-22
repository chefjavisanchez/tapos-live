import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '@/lib/admin-config';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // 1. Verify the User with standard Anon Key
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        console.error("Admin Auth Error:", authError);
        return NextResponse.json({ error: `Auth Failed: ${authError?.message || 'No User'}` }, { status: 401 });
    }

    // 2. SECURITY CHECK: SHARED CONFIG
    if (!isAdmin(user.email)) {
        console.warn(`⚠️ Unauthorized Admin Access Attempt by: ${user.email}`);
        return NextResponse.json({ error: 'Forbidden: Admins Only' }, { status: 403 });
    }

    // 3. Authorized! Fetch Data with Service Key
    const adminDb = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch Cards
    const { data: cards, error: dbError } = await adminDb
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Fetch Users (Auth)
    const { data: authUsers, error: usersError } = await adminDb.auth.admin.listUsers();

    if (usersError) {
        console.error("Fetch Users Error:", usersError);
        // Fallback to cards only if users can't be fetched
        return NextResponse.json(cards);
    }

    // Join Data
    const combinedData = cards.map(card => {
        const userMatch = authUsers.users.find(u => u.id === card.user_id);
        return {
            ...card,
            userDetails: userMatch ? {
                email: userMatch.email,
                metadata: userMatch.user_metadata,
                lastSignIn: userMatch.last_sign_in_at
            } : null
        };
    });

    return NextResponse.json(combinedData);
}
