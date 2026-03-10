import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Resend } from 'resend';
import { EVENT_CONFIG } from '@/lib/event-config';

export async function POST(req: Request) {
    try {
        const { secret } = await req.json();

        // Simple security check
        if (secret !== process.env.ADMIN_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Resend API Key missing' }, { status: 500 });
        }

        const resend = new Resend(apiKey);

        // 1. Fetch all "Lite" cards (Event Passports)
        // We look for is_lite: true in the content JSONB field
        const { data: cards, error } = await supabaseAdmin
            .from('cards')
            .select('content, slug')
            .eq('content->>is_lite', 'true');

        if (error) throw error;
        if (!cards || cards.length === 0) {
            return NextResponse.json({ message: 'No guests found to remind.' });
        }

        console.log(`🔔 Broadcasting reminders to ${cards.length} guests...`);

        const results = [];

        // 2. Send emails
        for (const card of cards) {
            const content = card.content;
            const email = content.email;
            const fullName = content.fullName;

            if (!email) continue;

            const { data: emailData, error: emailError } = await resend.emails.send({
                from: 'TapOS <javi@tapygo.com>',
                to: [email],
                subject: `Reminder: ${EVENT_CONFIG.title} starts in 2 days! 🎫`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #000;">Ready for the Event?</h2>
                        <p>Hi ${fullName},</p>
                        <p>We're excited to see you at <strong>${EVENT_CONFIG.title}</strong> in just two days!</p>
                        
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p><strong>When:</strong> ${EVENT_CONFIG.date} @ ${EVENT_CONFIG.time}</p>
                            <p><strong>Where:</strong> ${EVENT_CONFIG.address}</p>
                        </div>

                        <p>Don't forget to have your digital passport ready for scanning to enter the raffles:</p>
                        <a href="https://tapos360.com/${card.slug}" style="display: inline-block; background: #ffde00; color: #000; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-weight: bold;">VIEW MY PASSPORT</a>
                        
                        <p style="margin-top: 30px; font-size: 12px; color: #666;">
                            See you there!<br>
                            The TapOS Team
                        </p>
                    </div>
                `,
            });

            results.push({
                email,
                success: !emailError,
                id: emailData?.id,
                error: emailError?.message
            });
        }

        return NextResponse.json({
            success: true,
            total: cards.length,
            details: results
        });

    } catch (error: any) {
        console.error('Reminder Broadcast Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
