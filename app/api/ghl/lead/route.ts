import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { cardId, slug, email, name, phone, jobTitle } = body;

        const GHL_URL = process.env.GHL_WEBHOOK_URL;

        if (!GHL_URL) {
            console.error('Missing GHL_WEBHOOK_URL');
            return NextResponse.json({ error: 'Server Config Error' }, { status: 500 });
        }

        console.log('🚀 Sending Lead to GHL:', { slug, email });

        const response = await fetch(GHL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event: 'NEW_USER_REGISTRATION',
                source: 'TAPOS_LEAD_GENERATION', // Distinct source for retargeting
                card_id: cardId,
                slug: slug,
                email: email,
                name: name,
                phone: phone,
                job_title: jobTitle,
                status: 'pending_payment'
            })
        });

        if (!response.ok) {
            console.error('GHL Webhook Failed:', await response.text());
            return NextResponse.json({ error: 'GHL Failed' }, { status: 502 });
        }

        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error('GHL Lead API Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
