import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    return handleCreate(req);
}

export async function POST(req: Request) {
    return handleCreate(req);
}

async function handleCreate(req: Request) {
    console.log("Creating dummy corporate account...");

    // 1. Verify Admin Session
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const supabaseCheck = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { user }, error: authErrorCheck } = await supabaseCheck.auth.getUser(token);

    if (authErrorCheck || !user || !['javi@tapygo.com', 'chefjavisanchez@gmail.com'].includes(user.email || '')) {
        return NextResponse.json({ error: 'Access Denied' }, { status: 403 });
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const testEmail = `corporate-${Math.floor(Math.random() * 1000)}@test.com`;
    const testName = 'Corporate Test Account';

    try {
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
        }

        // 1. Create Auth User
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: testEmail,
            password: 'Password123!',
            email_confirm: true,
            user_metadata: {
                full_name: testName,
                plan: 'corporate',
                quantity: 25,
                shipping_address: '789 Business Ave, Tech Park, 54321, USA'
            }
        });

        if (authError) {
            console.error("Auth Error:", authError);
            throw authError;
        }

        console.log("User created:", authData.user.id);

        // 2. Create Dummy Card so it shows in God Mode
        const { error: cardError } = await supabaseAdmin
            .from('cards')
            .insert({
                user_id: authData.user.id,
                slug: `test-corp-${authData.user.id.slice(0, 5)}`,
                content: {
                    fullName: testName,
                    subscription: 'active',
                    plan: 'corporate'
                }
            });

        if (cardError) {
            console.error("Card Error:", cardError);
            throw cardError;
        }

        return NextResponse.json({
            success: true,
            message: 'Corporate test account created!',
            email: testEmail,
            userId: authData.user.id
        });

    } catch (err: any) {
        console.error("Creation Failed:", err.message);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
