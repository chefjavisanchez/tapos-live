import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Check 1: Env Vars Presence
    const status = {
        url_configured: !!sbUrl,
        service_key_found: !!serviceKey,
        service_key_length: serviceKey ? serviceKey.length : 0,
        service_key_preview: serviceKey ? `${serviceKey.substring(0, 5)}...` : 'N/A'
    };

    let adminCheck = 'PENDING';
    let errorMsg = null;

    // Check 2: Try Admin Access
    if (sbUrl && serviceKey) {
        try {
            const adminClient = createClient(sbUrl, serviceKey, {
                auth: { persistSession: false }
            });

            // Try to read a sensitive table or just check health
            // We'll try to count cards, which admin should be able to do regardless of RLS
            const { count, error } = await adminClient
                .from('cards')
                .select('*', { count: 'exact', head: true });

            if (error) {
                adminCheck = 'FAILED';
                errorMsg = error.message;
            } else {
                adminCheck = 'SUCCESS';
            }
        } catch (e: any) {
            adminCheck = 'EXCEPTION';
            errorMsg = e.message;
        }
    }

    return NextResponse.json({
        system_status: status,
        admin_connection: adminCheck,
        error: errorMsg,
        timestamp: new Date().toISOString()
    });
}
