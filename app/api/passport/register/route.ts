import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Resend } from 'resend';
import { PassportEmailTemplate } from '@/components/emails/PassportEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    console.log('--- Passport Registration Start ---');
    try {
        const body = await req.json();
        console.log('Registration Payload:', body);
        const { fullName, email, phone, company } = body;

        if (!fullName || !email) {
            console.warn('Missing required fields:', { fullName, email });
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        // 1. Generate Slug
        const randomStr = Math.random().toString(36).substring(2, 7);
        const namePart = fullName.toLowerCase().replace(/\s+/g, '-').substring(0, 15);
        const slug = `p-${randomStr}-${namePart}`;
        console.log('Generated Slug:', slug);

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
        console.log('Inserting into Supabase...');
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
        console.log('Supabase Insert Success:', data.id);

        // 3. Send Email via Resend
        try {
            console.log('Sending Email via Resend...');
            if (!process.env.RESEND_API_KEY) {
                console.error('RESEND_API_KEY is missing in process.env!');
            }

            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://tapos360.com/${slug}`;

            const { data: emailResponse, error: emailError } = await resend.emails.send({
                from: 'TapOS <javi@tapygo.com>',
                to: [email],
                subject: 'Your Event Passport is Activated! 🎫',
                react: PassportEmailTemplate({ fullName, slug, qrUrl }),
                text: `Hello ${fullName}! Your Event Passport for Konecta Expo 2026 is activated. Your Access ID is ${slug.slice(-5).toUpperCase()}. You can view your digital badge at: https://tapos360.com/${slug}`,
            });

            if (emailError) {
                console.error('❌ Resend API Error Response:', emailError);
                console.log('Resend Error Details:', JSON.stringify(emailError, null, 2));
            } else {
                console.log('✅ Resend Email Success! Response ID:', emailResponse?.id);
            }
        } catch (catastrophicError) {
            console.error('🔥 Critical Failure in Resend Integration:', catastrophicError);
        }

        console.log('--- Passport Registration Success ---');
        return NextResponse.json({ success: true, slug });

    } catch (error: any) {
        console.error('Passport Registration Error:', error);
        return NextResponse.json({ error: error.message || 'Registration failed' }, { status: 500 });
    }
}
