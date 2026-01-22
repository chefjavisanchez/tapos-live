'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function ShopPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);
    const [cards, setCards] = useState<any[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string>('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [planType, setPlanType] = useState('independent');

    useEffect(() => {
        const fetchCards = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data } = await supabase
                .from('cards')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data && data.length > 0) {
                setCards(data);
                setSelectedCardId(data[0].id); // Default to first
            }

            // Plan & Admin Check
            setPlanType(user.user_metadata?.plan || 'independent');
            const email = user.email?.toLowerCase().trim() || '';
            if (['javi@tapygo.com', 'chefjavisanchez@gmail.com'].includes(email)) {
                setIsAdmin(true);
            }

            setLoading(false);
        };
        fetchCards();
    }, [router]);

    const handleBuy = async () => {
        setBuying(true);
        const card = cards.find(c => c.id === selectedCardId);
        if (!card) return;

        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardId: card.id,
                    email: card.content?.email,
                    slug: card.slug,
                    title: card.content?.fullName,
                    variant: 'bracelet' // THE KEY
                })
            });
            const session = await response.json();
            if (session.url) {
                window.location.href = session.url;
            } else {
                alert('Checkout Error: ' + session.error);
                setBuying(false);
            }
        } catch (err) {
            console.error(err);
            alert('Connection Error');
            setBuying(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-black flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="flex min-h-screen bg-black bg-cyber-grid bg-[length:40px_40px]">
            <DashboardSidebar
                isAdmin={isAdmin}
                planType={planType}
                userCard={cards[0]}
            />

            <div className="flex-1 p-8 overflow-y-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center border-b border-white/10 pb-4">
                    <h1 className="text-2xl font-syncopate font-bold flex items-center gap-2">
                        <ShoppingBag className="text-neon-purple" /> HARDWARE STORE
                    </h1>
                </div>

                <div className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-8 text-center relative">

                        <div className="absolute top-0 right-0 bg-neon-purple text-black text-xs font-bold px-3 py-1 rounded-bl-xl">
                            UPGRADE
                        </div>

                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <ShoppingBag size={48} className="text-white" />
                        </div>

                        <h2 className="text-2xl font-bold mb-2">TapOS NFC Bracelet</h2>
                        <p className="text-gray-400 text-sm mb-6">
                            Wearable digital identity. Tap your bracelet to instantly share your profile. Waterproof and durable.
                        </p>

                        {/* Selector if multiple cards */}
                        {cards.length > 1 && (
                            <div className="mb-6 text-left">
                                <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">Link to Card:</label>
                                <select
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-neon-purple"
                                    value={selectedCardId}
                                    onChange={(e) => setSelectedCardId(e.target.value)}
                                >
                                    {cards.map(c => (
                                        <option key={c.id} value={c.id}>{c.content?.fullName || c.slug}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="bg-black/30 rounded-xl p-4 mb-8 space-y-2 border border-white/5">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">NFC Bracelet</span>
                                <span>$30.00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Shipping</span>
                                <span>$7.99</span>
                            </div>
                            <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-neon-purple">
                                <span>Total</span>
                                <span>$37.99</span>
                            </div>
                        </div>

                        <button
                            onClick={handleBuy}
                            disabled={buying}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {buying ? <Loader2 className="animate-spin" /> : 'Buy Now'}
                        </button>

                        <p className="text-[10px] text-gray-600 mt-4">State-of-the-art NFC Technology • Secured by Stripe</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
