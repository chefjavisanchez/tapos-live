import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        // 1. Verify Admin Session (Server-Side)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // MUST use Service Role to bypass potential RLS

        // We verified the user is 'javi@tapygo.com' on the client, 
        // but for extra security we could verify the session token here too.
        // For now, we rely on the protection that this route is only known/called by the Admin Page 
        // which has its own auth check, but adding a token check is best practice.

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

        const allowedAdmins = ['javi@tapygo.com', 'chefjavisanchez@gmail.com'];
        if (!allowedAdmins.includes(user.email || '')) {
            return NextResponse.json({ error: 'Forbidden: Admin Access Only' }, { status: 403 });
        }

        // 2. Parse Body
        const { cardId } = await req.json();
        if (!cardId) return NextResponse.json({ error: 'Missing Card ID' }, { status: 400 });

        // 3. Fetch Current Card to Preserve Data
        const { data: card, error: fetchError } = await supabase
            .from('cards')
            .select('content')
            .eq('id', cardId)
            .single();

        if (fetchError || !card) {
            return NextResponse.json({ error: 'Card not found' }, { status: 404 });
        }

        // 4. Update Status to Active
        const newContent = {
            ...card.content,
            subscription: 'active',
            activatedBy: 'ADMIN_MANUAL_OVERRIDE',
            activatedAt: new Date().toISOString()
        };

        const { error: updateError } = await supabase
            .from('cards')
            .update({ content: newContent })
            .eq('id', cardId);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, message: 'Card Manually Activated' });

    } catch (err: any) {
        console.error('Activation Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
