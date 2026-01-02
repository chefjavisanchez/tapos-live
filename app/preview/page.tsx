import { supabase } from '@/lib/supabase';
import CardEngine from '@/components/CardEngine';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function PreviewPage({ searchParams }: { searchParams: { id: string } }) {
    const cardId = searchParams.id;

    if (!cardId) return <div className="text-white">No Card ID Provided</div>;

    const { data: card } = await supabase
        .from('cards')
        .select('content, slug')
        .eq('id', cardId)
        .single();

    if (!card) return <div className="text-white">Card Not Found</div>;

    return <CardEngine data={card.content} slug={card.slug} />;
}
