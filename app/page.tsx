'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Terminal, CreditCard, User, Settings, LogOut, LayoutGrid, Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function Home() {
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCards = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data, error } = await supabase
                .from('cards')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setCards(data);
            setLoading(false);
        };

        fetchCards();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <main className="flex min-h-screen bg-space-900 bg-cyber-grid bg-[length:40px_40px]">

            {/* SIDEBAR */}
            <aside className="w-64 border-r border-white/10 glass-panel flex flex-col p-6 max-md:hidden sticky top-0 h-screen">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-full bg-neon-blue neon-glow flex items-center justify-center">
                        <Terminal className="text-black w-6 h-6" />
                    </div>
                    <h1 className="font-syncopate text-xl tracking-tighter">TAP<span className="text-neon-blue">OS</span></h1>
                </div>

                <nav className="flex flex-col gap-2 flex-grow">
                    <NavItem href="/" icon={<LayoutGrid size={20} />} label="Dashboard" active />
                    <NavItem href="/" icon={<CreditCard size={20} />} label="My Cards" />
                    <NavItem href="/profile" icon={<User size={20} />} label="Profile" />
                    <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" />
                </nav>

                <div className="mt-auto pt-6 border-t border-white/10">
                    <button onClick={handleSignOut} className="flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-200">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 p-8 overflow-y-auto">

                {/* HEADER */}
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 font-syncopate">WELCOME TO <span className="text-neon-blue">TAPOS IMPULSO</span></h1>
                        <p className="text-white/50">System Operational. All systems go.</p>
                    </div>
                    {/* ONLY SHOW CREATE BUTTON IF NO CARDS EXIST */}
                    {cards.length === 0 && (
                        <a href="/create" className="bg-neon-blue hover:bg-white text-black px-6 py-3 rounded-lg font-bold uppercase text-sm tracking-wider transition-all shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]">
                            Create New Card
                        </a>
                    )}
                </header>

                {/* CARDS GRID */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="animate-spin text-neon-blue w-12 h-12" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* REAL CARDS FROM DB */}
                        {cards.map((card) => (
                            <div key={card.id} className="glass-panel p-6 rounded-2xl group hover:border-neon-blue/50 transition duration-300">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center">
                                        <CreditCard className="text-neon-blue" />
                                    </div>
                                    <span className={`px-3 py-1 text-xs rounded-full border ${card.content.subscription === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                        {card.content.subscription === 'active' ? 'ACTIVE' : 'LOCKED'}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-1 font-rajdhani">{card.title}</h3>
                                <p className="text-white/40 text-sm mb-6">tapos360.com/{card.slug}</p>
                                <div className="flex gap-2">
                                    <a href={`/editor?id=${card.id}`} className="flex-1 py-3 bg-neon-blue/10 hover:bg-neon-blue hover:text-black border border-neon-blue/20 rounded text-center text-sm font-bold uppercase tracking-wider transition">Edit</a>
                                    <a href={`/${card.slug}`} target="_blank" className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-center text-sm font-medium transition">View</a>
                                </div>
                            </div>
                        ))}

                        {/* ADD NEW PLACEHOLDER */}
                        {cards.length === 0 && (
                            <a href="/create" className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center border-dashed border-white/20 hover:border-neon-blue hover:bg-neon-blue/5 transition cursor-pointer min-h-[220px]">
                                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                                    <span className="text-3xl text-white/50 group-hover:text-neon-blue">+</span>
                                </div>
                                <span className="text-white/50 group-hover:text-white font-medium uppercase tracking-widest text-sm">Initialize Project</span>
                            </a>
                        )}

                    </div>
                )}

            </div>
        </main>
    );
}

function NavItem({ icon, label, active = false, href }: { icon: any, label: string, active?: boolean, href: string }) {
    return (
        <a href={href} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
            {icon}
            <span className="font-medium">{label}</span>
        </a>
    )
}
