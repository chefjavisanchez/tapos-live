
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
    const { data: card } = await supabase
        .from('cards')
        .select('content')
        .eq('slug', params.slug)
        .single();

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
                    url: profileImage || 'https://tapos.com/default-cover.jpg',
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
    const { data: card, error } = await supabase
        .from('cards')
        .select('content')
        .eq('slug', params.slug)
        .single();

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

    // Pass data to Client Component
    return <CardEngine data={card.content} slug={params.slug} />;
}
