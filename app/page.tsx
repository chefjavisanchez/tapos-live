'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Terminal, CreditCard, User, Settings, LogOut, LayoutGrid, Loader2, Shield, Gift, ShoppingBag, Eye, Share2, UserPlus } from "lucide-react";
import { useRouter } from 'next/navigation';

import LandingPage from '@/components/LandingPage'; // Import Landing Page

export default function Home() {
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false); // NEW STATE
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchCards = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                // If no user, we are just on the Landing Page. Stop here.
                setLoading(false);
                return;
            }

            // If user exists, we are authenticated
            setIsAuthenticated(true);

            // ROBUST CHECK admin logic...
            const email = user.email?.toLowerCase().trim() || '';
            const allowedAdmins = ['javi@tapygo.com', 'chefjavisanchez@gmail.com'];

            if (allowedAdmins.includes(email)) {
                setIsAdmin(true);
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
        // Instead of push login, we just reload or reset state to show landing
        window.location.href = '/';
    };

    // 1. LOADING STATE (Prevent Glitch/Flash)
    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
            </div>
        );
    }

    // 2. SHOW LANDING PAGE IF NOT LOGGED IN
    if (!isAuthenticated) {
        return <LandingPage />;
    }

    return (
        <main className="flex min-h-screen bg-space-900 bg-cyber-grid bg-[length:40px_40px]">

            {/* MOBILE MENU OVERLAY */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-[#050510] flex flex-col p-6 animate-in slide-in-from-left duration-200">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center gap-2">
                            <Terminal className="text-neon-blue w-6 h-6" />
                            <h1 className="font-syncopate text-lg tracking-tighter">TAP<span className="text-neon-blue">OS</span></h1>
                        </div>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white/10 rounded-full">
                            <LogOut className="rotate-180" size={20} />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-4 text-lg">
                        <NavItem href="/" icon={<LayoutGrid size={24} />} label="Dashboard" onClick={() => setMobileMenuOpen(false)} />
                        <NavItem href="/" icon={<CreditCard size={24} />} label="My Cards" onClick={() => setMobileMenuOpen(false)} />
                        <NavItem href="/profile" icon={<User size={24} />} label="Profile" onClick={() => setMobileMenuOpen(false)} />
                        <NavItem href="/referrals" icon={<Gift size={24} />} label="Rewards" onClick={() => setMobileMenuOpen(false)} />
                        <NavItem href="/shop" icon={<ShoppingBag size={24} />} label="Hardware Store" onClick={() => setMobileMenuOpen(false)} />
                        <NavItem href="/settings" icon={<Settings size={24} />} label="Settings" onClick={() => setMobileMenuOpen(false)} />
                        {isAdmin && <NavItem href="/admin" icon={<Shield size={24} />} label="God Mode" onClick={() => setMobileMenuOpen(false)} />}
                    </nav>

                    <div className="mt-auto border-t border-white/10 pt-6">
                        <button onClick={handleSignOut} className="flex items-center gap-3 text-white/50 hover:text-white">
                            <LogOut size={24} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}

            {/* SIDEBAR (Desktop) */}
            <aside className="w-64 border-r border-white/10 glass-panel flex flex-col p-6 max-md:hidden sticky top-0 h-screen overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-3 mb-10 shrink-0">
                    <div className="w-10 h-10 rounded-full bg-neon-blue neon-glow flex items-center justify-center">
                        <Terminal className="text-black w-6 h-6" />
                    </div>
                    <h1 className="font-syncopate text-xl tracking-tighter">TAP<span className="text-neon-blue">OS</span></h1>
                </div>

                <nav className="flex flex-col gap-2 flex-grow shrink-0">
                    <NavItem href="/" icon={<LayoutGrid size={20} />} label="Dashboard" active />
                    <NavItem href="/" icon={<CreditCard size={20} />} label="My Cards" />
                    <NavItem href="/profile" icon={<User size={20} />} label="Profile" />
                    <NavItem href="/referrals" icon={<Gift size={20} />} label="Rewards" />
                    <NavItem href="/shop" icon={<ShoppingBag size={20} />} label="Hardware Store" />
                    <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" />
                    {isAdmin && (
                        <div className="pt-4 mt-4 border-t border-white/10">
                            <NavItem href="/admin" icon={<Shield size={20} />} label="God Mode" />
                        </div>
                    )}
                </nav>

                {/* SIDEBAR ANALYTICS - PREMIUM REWARDS STYLE */}
                {cards.length > 0 && (
                    <div className="my-6 relative overflow-hidden rounded-2xl border border-neon-blue/20 bg-gradient-to-br from-gray-900 to-black p-5 shadow-2xl shrink-0">

                        {/* Shine Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/5 to-transparent opacity-50 pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-[10px] uppercase font-bold text-neon-blue tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse"></span>
                                    Overview
                                </h4>
                                <div className="px-2 py-0.5 rounded bg-neon-blue/10 border border-neon-blue/20 text-[9px] font-bold text-neon-blue">
                                    LIVE
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-6">
                                {/* VIEWS */}
                                <div className="bg-black/40 rounded-lg p-2 border border-white/5 text-center">
                                    <span className="text-[9px] uppercase text-white/40 block mb-1">Views</span>
                                    <span className="text-lg font-bold font-rajdhani text-white">
                                        {cards[0].content?.analytics?.views || 0}
                                    </span>
                                </div>

                                {/* SAVES */}
                                <div className="bg-black/40 rounded-lg p-2 border border-white/5 text-center">
                                    <span className="text-[9px] uppercase text-white/40 block mb-1">Saves</span>
                                    <span className="text-lg font-bold font-rajdhani text-neon-green" style={{ color: '#4ade80' }}>
                                        {cards[0].content?.analytics?.saves || 0}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => {
                                    if (navigator.share) {
                                        navigator.share({
                                            title: cards[0].content.fullName,
                                            url: window.location.origin + '/' + cards[0].slug
                                        })
                                    } else {
                                        navigator.clipboard.writeText(window.location.origin + '/' + cards[0].slug);
                                        alert('Link Copied!');
                                    }
                                }} className="flex flex-col items-center justify-center gap-1 p-3 bg-neon-blue hover:bg-white text-black rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(0,243,255,0.2)] hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                                    <Share2 size={16} />
                                    Share
                                </button>

                                <a href={`/${cards[0].slug}`} target="_blank" className="flex flex-col items-center justify-center gap-1 p-3 bg-white/5 hover:bg-white/10 text-white hover:text-white rounded-xl border border-white/10 hover:border-white/30 font-bold text-[10px] uppercase tracking-wider transition-all">
                                    <Eye size={16} />
                                    Preview
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-6 border-t border-white/10 shrink-0">
                    <button onClick={handleSignOut} className="flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-200">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 p-8 overflow-y-auto">

                {/* MOBILE HEADER (Visible on small screens only) */}
                <div className="md:hidden flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-white">
                            <LayoutGrid size={28} />
                        </button>
                        <Terminal className="text-neon-blue w-6 h-6 ml-2" />
                        <h1 className="font-syncopate text-lg tracking-tighter">TAP<span className="text-neon-blue">OS</span></h1>
                    </div>

                    <div className="flex items-center gap-2">
                        {isAdmin && (
                            <a href="/admin" className="p-2 bg-neon-blue/20 rounded-lg text-neon-blue hover:text-white border border-neon-blue/50">
                                <Shield size={20} />
                            </a>
                        )}
                        <button onClick={handleSignOut} className="p-2 bg-white/5 rounded-lg text-white/70 hover:text-white">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

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

function NavItem({ icon, label, active = false, href, onClick }: { icon: any, label: string, active?: boolean, href: string, onClick?: () => void }) {
    return (
        <a href={href} onClick={onClick} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
            {icon}
            <span className="font-medium">{label}</span>
        </a>
    )
}
