
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import CardEngine from '@/components/CardEngine';
import { notFound } from 'next/navigation';

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

    const { fullName, jobTitle, company, profileImage } = card.content;

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
    // We allow "Preview" mode (if specifically enabled) or if Subscription is Active
    const isActive = card.content.subscription === 'active';

    // If you want to allow the OWNER to view it, we'd need session checks, 
    // but since this is a static public page, we Lock it by default.
    // The "Preview" route we made earlier bypasses this because it renders CardEngine directly.

    if (!isActive) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center font-mono text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=1000')] bg-cover opacity-20 blur-sm animate-pulse"></div>

                <div className="z-10 bg-black/80 backdrop-blur-xl p-8 rounded-2xl border border-[#00F3FF]/30 shadow-2xl max-w-md w-full">
                    <div className="w-20 h-20 bg-[#00F3FF]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#00F3FF]/30 animate-bounce">
                        <i className="ph-fill ph-lock-key text-[#00F3FF] text-3xl"></i>
                    </div>

                    <h1 className="text-2xl font-bold uppercase tracking-widest mb-2 text-white">Profile Locked</h1>
                    <p className="text-white/50 text-sm mb-8">
                        This digital identity ({card.content.fullName}) has been created but not yet activated.
                    </p>

                    <a href={`https://buy.stripe.com/6oU00i6UOa2YcVzaiH3gk00?client_reference_id=${card.id}`} className="block w-full bg-[#00F3FF] hover:bg-white text-black font-bold py-4 rounded-xl transition transform hover:scale-105 shadow-lg shadow-[#00F3FF]/20 mb-4">
                        ACTIVATE CARD • $99
                    </a>

                    <p className="text-[10px] text-white/30 uppercase tracking-wider">
                        TapOS Secure Gateway
                    </p>
                </div>
            </div>
        );
    }

    // Pass data to Client Component
    return <CardEngine data={card.content} slug={params.slug} ownerId={card.user_id} cardId={card.id} />;
}
