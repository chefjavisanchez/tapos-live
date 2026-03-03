import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Resend } from 'resend';
import { PassportEmailTemplate } from '@/components/emails/PassportEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { fullName, email, phone, company } = await req.json();

        if (!fullName || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        // 1. Generate Slug
        const randomStr = Math.random().toString(36).substring(2, 7);
        const namePart = fullName.toLowerCase().replace(/\s+/g, '-').substring(0, 15);
        const slug = `p-${randomStr}-${namePart}`;

        const initialContent = {
            fullName,
            email,
            phone,
            company,
            theme: 'gold',
            is_lite: true,
            event: 'Konecta con Crema Spring Expo',
            profileImage: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop",
            bio: "Official Event Guest"
        };

        // 2. Insert into Supabase using admin client
        const { data, error: insertError } = await supabaseAdmin
            .from('cards')
            .insert([
                {
                    title: `${fullName}'s Passport`,
                    slug: slug,
                    content: initialContent,
                    user_id: null
                }
            ])
            .select()
            .single();

        if (insertError) {
            console.error('Supabase Insert Error:', insertError);
            throw insertError;
        }

        // 3. Send Email via Resend
        try {
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://tapos360.com/${slug}`;

            await resend.emails.send({
                from: 'TapOS <javi@tapygo.com>',
                to: [email],
                subject: 'Your Event Passport is Activated! 🎫',
                react: PassportEmailTemplate({ fullName, slug, qrUrl }),
            });
        } catch (emailError) {
            console.error('Resend Email Error:', emailError);
            // Don't fail the whole request if email fails, but log it
        }

        return NextResponse.json({ success: true, slug });

    } catch (error: any) {
        console.error('Passport Registration Error:', error);
        return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
    }
}
