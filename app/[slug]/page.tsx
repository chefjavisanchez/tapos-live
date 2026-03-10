import { Suspense } from 'react';
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import CardEngine from '@/components/CardEngine';
import { notFound, redirect } from 'next/navigation';

// Type for the params
type Props = {
    params: { slug: string }
};

// FORCE DYNAMIC - Prevents Caching of DB Data
export const dynamic = 'force-dynamic';

// 1. GENERATE METADATA FOR SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { data } = await supabase
        .from('cards')
        .select('content')
        .eq('slug', params.slug)
        .limit(1);

    const card = data?.[0];

    if (!card) {
        return {
            title: 'Card Not Found | TapOS Impulso',
        };
    }

    const content = card.content || {};
    const { fullName = 'Digital Identity', jobTitle = 'Professional', company = 'TapOS', profileImage } = content;

    return {
        title: `${fullName} | ${jobTitle} | TapOS Impulso`,
        description: `Connect with ${fullName}, ${jobTitle} at ${company}. Powered by TapOS Impulso.`,
        openGraph: {
            title: `${fullName} - Digital Card`,
            description: `View the professional profile of ${fullName}.`,
            images: [
                {
                    url: '/opengraph-image.png',
                    width: 1200,
                    height: 630,
                },
            ],
            type: 'profile',
        },
    };
}

// 2. SERVER COMPONENT PAGE
export default async function Page({ params }: Props) {
    const slug = params?.slug || '';

    // PASSPORT REDIRECT: If scanned by a regular browser, redirect to main site.
    // The Event Mode scanner will process this via the API directly.
    if (slug.startsWith('p-')) {
        redirect('https://www.tapos360.com');
    }

    const { data, error } = await supabase
        .from('cards')
        // We select ID to pass to Stripe for activation, and USER_ID for ownership check
        .select('id, user_id, content')
        .eq('slug', params.slug)
        .limit(1);

    const card = data?.[0];

    if (error || !card) {
        // DEBUGGING 404
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-black text-white p-10 text-center font-mono">
                <h1 className="text-2xl text-red-500 mb-4">DEBUG: CARD NOT FOUND</h1>
                <p>Slug requested: <strong>{params?.slug || 'undefined'}</strong></p>
                <div className="bg-gray-800 p-4 rounded text-left text-xs mt-4 w-full max-w-lg overflow-auto">
                    <p className="text-yellow-400">Database Error:</p>
                    <pre>{JSON.stringify(error, null, 2)}</pre>
                    <p className="text-blue-400 mt-2">Possible Causes:</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li>Slug mismatch (case sensitive?)</li>
                        <li>Row Level Security (RLS) blocking 'select' for public/anon</li>
                        <li>Database connection issue</li>
                    </ul>
                </div>
            </div>
        );
    }

    // 3. SECURITY CHECK: IS CARD ACTIVE?
    // We allow "Preview" mode (if specifically enabled), if Subscription is Active, or if it's a Lite Passport
    const isActive = card.content.subscription === 'active' || card.content.is_lite === true;

    if (!isActive) {
        // Redirection logic for inactive profiles as requested by the user
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center font-mono text-white relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#ffde00] to-transparent animate-shimmer"></div>

                <div className="z-10 bg-[#050510] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full relative">
                    <div className="w-20 h-20 bg-[#ffde00]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#ffde00]/30">
                        <i className="ph-fill ph-lock-key text-[#ffde00] text-3xl"></i>
                    </div>

                    <h1 className="text-3xl font-black font-syncopate uppercase mb-3 leading-tight">Identity <span className="text-[#ffde00]">Locked</span></h1>
                    <p className="text-white/50 text-xs mb-10 leading-relaxed font-medium">
                        This TapOS profile hasn&apos;t been activated by the owner. If this is your profile, activation is required to go live.
                    </p>

                    <a href="https://www.tapos360.com/pricing" className="block w-full bg-[#ffde00] hover:bg-white text-black font-black py-5 rounded-[1.2rem] transition transform hover:scale-[1.02] shadow-[0_10px_30px_rgba(255,222,0,0.2)] mb-4 text-xs tracking-widest uppercase">
                        ACTIVATE PROFILE
                    </a>

                    <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] text-center mt-6">
                        <a href="https://www.tapos360.com" className="hover:text-white transition">Back to tapos360.com</a>
                    </p>
                </div>
            </div>
        );
    }

    // 4. FETCH LEADS FOR SYNC - DISABLED FOR PRIVACY (LEADS ARE PERSONAL)
    // We no longer fetch or pass remote leads to the public profile page.
    const remoteLeads: any[] = [];

    // Pass data to Client Component
    return (
        <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-[#00F3FF]">LOADING TAPOS IDENTITY...</div>}>
            <CardEngine data={card.content} slug={params.slug} ownerId={card.user_id} cardId={card.id} remoteLeads={remoteLeads} />
        </Suspense>
    );
}
