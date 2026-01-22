'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Terminal, CreditCard, User, Settings, LogOut, LayoutGrid, Loader2, Shield, Gift, ShoppingBag, Eye, Share2, UserPlus, Users } from "lucide-react";
import { useRouter } from 'next/navigation';

import LandingPage from '@/components/LandingPage'; // Import Landing Page
import DashboardSidebar from '@/components/DashboardSidebar'; // Import Sidebar

export default function Home() {
    const [cards, setCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // NEW CORPORATE STATES
    const [appUser, setAppUser] = useState<any>(null);
    const [planType, setPlanType] = useState('independent');
    const [activeTab, setActiveTab] = useState<'dashboard' | 'team'>('dashboard');
    const [teamMembers, setTeamMembers] = useState<any[]>([]);

    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const searchParams = new URLSearchParams(window.location.search);
        const tab = searchParams.get('tab');
        if (tab === 'team') setActiveTab('team');

        const fetchCards = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            setIsAuthenticated(true);
            setAppUser(user);

            // Plan Check
            const plan = user.user_metadata?.plan || 'independent';
            setPlanType(plan);

            const email = user.email?.toLowerCase().trim() || '';
            const allowedAdmins = ['javi@tapygo.com', 'chefjavisanchez@gmail.com'];

            if (allowedAdmins.includes(email)) {
                setIsAdmin(true);
            }

            const { data } = await supabase
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
        window.location.href = '/';
    };

    if (!mounted || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LandingPage />;
    }

    return (
        <main className="flex min-h-screen bg-black bg-cyber-grid bg-[length:40px_40px]">

            {/* MOBILE MENU OVERLAY */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-[#050510] flex flex-col p-6 animate-in slide-in-from-left duration-200 overflow-y-auto">
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
                        <NavItem icon={<LayoutGrid size={24} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} />
                        {planType === 'corporate' && (
                            <NavItem icon={<UserPlus size={24} />} label="Team Control" active={activeTab === 'team'} onClick={() => { setActiveTab('team'); setMobileMenuOpen(false); }} />
                        )}
                        <NavItem href="/profile" icon={<User size={24} />} label="Profile" />
                        <NavItem href="/referrals" icon={<Gift size={24} />} label="Rewards" />
                        <NavItem href="/shop" icon={<ShoppingBag size={24} />} label="Hardware Store" />
                        <NavItem href="/settings" icon={<Settings size={24} />} label="Settings" />
                        {isAdmin && <NavItem href="/admin" icon={<Shield size={24} />} label="God Mode" />}
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
            <DashboardSidebar
                isAdmin={isAdmin}
                planType={planType}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userCard={cards[0]}
            />

            {/* MAIN CONTENT */}
            <div className="flex-1 p-8 overflow-y-auto">

                {/* MOBILE HEADER */}
                <div className="md:hidden flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-white">
                            <LayoutGrid size={24} />
                        </button>
                        <h1 className="font-syncopate text-lg tracking-tighter uppercase ml-2">TAP<span className="text-neon-blue">OS</span></h1>
                    </div>
                    {isAdmin && (
                        <a href="/admin" className="p-2 bg-neon-blue/20 rounded-lg text-neon-blue">
                            <Shield size={20} />
                        </a>
                    )}
                </div>

                {activeTab === 'dashboard' ? (
                    <div className="animate-in fade-in duration-700">
                        {/* HEADER */}
                        <header className="flex justify-between items-center mb-10">
                            <div>
                                <h1 className="text-4xl font-black mb-2 font-syncopate uppercase">OPERATIONAL STATUS: <span className="text-neon-blue">GO</span></h1>
                                <p className="text-white/50 font-medium">Welcome back, {appUser?.user_metadata?.full_name || 'Operator'}.</p>
                            </div>
                            {cards.length === 0 && (
                                <a href="/create" className="bg-neon-blue hover:bg-white text-black px-8 py-3 rounded-xl font-bold uppercase text-sm tracking-widest transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                                    Create New Card
                                </a>
                            )}
                        </header>

                        {/* CARDS GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cards.map((card) => (
                                <div key={card.id} className="relative group rounded-[2rem] bg-black border border-white/10 hover:border-neon-blue/50 p-6 transition-all duration-300 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 blur-[40px] group-hover:bg-neon-blue/10 transition-all"></div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                                <CreditCard className="text-neon-blue" size={28} />
                                            </div>
                                            <span className={`px-3 py-1 text-[10px] font-black rounded-full border ${card.content?.subscription === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
                                                {card.content?.subscription === 'active' ? 'ACTIVE' : 'PENDING'}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-bold mb-1 font-rajdhani text-white">{card.title}</h3>
                                        <p className="text-white/40 text-sm mb-8 font-mono">tapos360.com/{card.slug}</p>

                                        <div className="flex gap-2">
                                            <a href={`/editor?id=${card.id}`} className="flex-1 py-3 bg-neon-blue text-black font-bold rounded-xl text-center text-xs uppercase tracking-widest transition hover:bg-white">Edit</a>
                                            <a href={`/${card.slug}`} target="_blank" className="flex-1 py-3 bg-white/5 text-white font-bold rounded-xl border border-white/10 text-center text-xs uppercase tracking-widest transition hover:bg-white/10">Preview</a>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {cards.length === 0 && (
                                <a href="/create" className="relative group rounded-[2rem] border-2 border-dashed border-white/10 hover:border-neon-blue/50 bg-white/5 flex flex-col items-center justify-center p-10 transition-all min-h-[280px]">
                                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-neon-blue group-hover:border-neon-blue transition-all">
                                        <UserPlus className="text-white/40 group-hover:text-black" size={32} />
                                    </div>
                                    <span className="text-white/50 font-black uppercase tracking-widest text-sm group-hover:text-white">Initialize Your Profile</span>
                                </a>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <header className="mb-10">
                            <h1 className="text-4xl font-black mb-2 font-syncopate uppercase">TEAM <span className="text-purple-400">CONTROL</span></h1>
                            <p className="text-white/50 font-medium">Manage your corporate accounts and distribution.</p>
                        </header>

                        <div className="rounded-[2.5rem] bg-black border border-white/10 overflow-hidden shadow-2xl">
                            <div className="p-10 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Corporate Roster</h3>
                                    <p className="text-sm text-white/40 font-medium">Active members under your enterprise license.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-[10px] text-white/40 uppercase font-black">Slots Used</div>
                                        <div className="text-xl font-bold font-rajdhani text-purple-400">0 / {appUser?.user_metadata?.quantity || '...'}</div>
                                    </div>
                                    <button className="bg-purple-500 hover:bg-white text-black px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                        Invite Member
                                    </button>
                                </div>
                            </div>

                            <div className="p-24 text-center">
                                <Users size={64} className="text-white/5 mx-auto mb-6" />
                                <h3 className="text-2xl font-bold mb-2 text-white/80">Deployment Ready</h3>
                                <p className="text-white/40 max-w-sm mx-auto mb-10 leading-relaxed font-medium">No members have been added to your corporate cloud yet. Invite team members to grant them access to their TapOS profiles.</p>
                                <button className="inline-flex items-center gap-3 text-purple-400 font-black uppercase tracking-tighter text-sm hover:text-white transition">
                                    <Share2 size={16} /> DOWNLOAD ONBOARDING LINK
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

function NavItem({
    icon,
    label,
    active = false,
    href,
    onClick
}: {
    icon: any,
    label: string,
    active?: boolean,
    href?: string,
    onClick?: () => void
}) {
    const content = (
        <>
            {icon}
            <span className="font-bold uppercase text-[11px] tracking-widest">{label}</span>
        </>
    );

    const baseClass = `flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-300 ${active
        ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
        : 'text-white/50 hover:text-white hover:bg-white/5'
        }`;

    if (onClick) {
        return <button onClick={onClick} className={baseClass}>{content}</button>;
    }

    return (
        <a href={href} className={baseClass}>
            {content}
        </a>
    );
}
