import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        // 1. Verify Admin Session (Server-Side)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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
        const { cardId, newEmail, newPassword } = await req.json();
        if (!cardId) return NextResponse.json({ error: 'Missing Card ID' }, { status: 400 });

        // 3. Get the Card to find the User ID
        const { data: card, error: fetchError } = await supabase
            .from('cards')
            .select('user_id, content')
            .eq('id', cardId)
            .single();

        if (fetchError || !card) {
            return NextResponse.json({ error: 'Card Not Found' }, { status: 404 });
        }

        const userId = card.user_id;

        // 4. Update Auth User (Email & Password)
        const updates: any = {};
        if (newEmail) updates.email = newEmail;
        if (newPassword) updates.password = newPassword;
        // Auto-confirm the email changement so they don't get stuck in "Confirmation Pending"
        if (newEmail) updates.email_confirm = true;

        if (Object.keys(updates).length > 0) {
            const { error: updateAuthError } = await supabase.auth.admin.updateUserById(
                userId,
                updates
            );

            if (updateAuthError) {
                console.error("Auth Update Error", updateAuthError);
                throw new Error(`Auth Update Failed: ${updateAuthError.message}`);
            }
        }

        // 5. Update Card Content (Sync Email)
        if (newEmail) {
            const newContent = { ...card.content, email: newEmail };
            const { error: updateCardError } = await supabase
                .from('cards')
                .update({ content: newContent })
                .eq('id', cardId);

            if (updateCardError) throw updateCardError;
        }

        return NextResponse.json({ success: true, message: 'User Credentials Updated Successfully' });

    } catch (err: any) {
        console.error('Update User Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
