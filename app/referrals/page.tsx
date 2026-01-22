'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Terminal, CreditCard, User, Settings, LogOut, LayoutGrid, Loader2, Shield, Gift, AlertTriangle, CheckCircle2, ChevronRight, Copy } from "lucide-react";
import { useRouter } from 'next/navigation';
import { isAdmin as checkIsAdmin } from '@/lib/admin-config';
import Link from 'next/link';
import DashboardSidebar from '@/components/DashboardSidebar';

// REUSABLE NAV ITEM (Inlined for consistency)
const NavItem = ({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) => (
    <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${active
            ? "bg-neon-blue/10 text-white border border-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.3)]"
            : "text-white/50 hover:bg-white/5 hover:text-white"
            }`}
    >
        <div className={`transition-transform duration-300 ${active ? "scale-110 text-neon-blue" : "group-hover:scale-110"}`}>
            {icon}
        </div>
        <span className="font-medium tracking-wide text-sm">{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />}
    </Link>
);

export default function RewardsPage() {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [referrals, setReferrals] = useState<any[]>([]);
    const [userSlug, setUserSlug] = useState('');
    const [copied, setCopied] = useState(false);
    const [planType, setPlanType] = useState('independent');
    const [primaryCard, setPrimaryCard] = useState<any>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const fetchReferrals = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            // Plan & Admin Check
            setPlanType(user.user_metadata?.plan || 'independent');
            if (checkIsAdmin(user.email)) setIsAdmin(true);

            // 1. Get User's Slug (Primary Card)
            const { data: myCard } = await supabase
                .from('cards')
                .select('slug')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true }) // First card is primary
                .limit(1)
                .single();

            if (myCard) {
                setUserSlug(myCard.slug);
                setPrimaryCard(myCard);

                // 2. Count Referrals (Cards where referrer == mySlug)
                // Note: referrer is in content JSONB
                const { data: refs, error } = await supabase
                    .from('cards')
                    .select('id, created_at, content')
                    .contains('content', { referrer: myCard.slug });

                if (refs) setReferrals(refs);
            }
            setLoading(false);
        };

        fetchReferrals();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const copyToClipboard = () => {
        if (!userSlug) return;
        navigator.clipboard.writeText(`https://tapos360.com/create?ref=${userSlug}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // --- CALCULATIONS ---
    const POINTS_PER_REF = 100;
    const GOAL = 500;
    const totalPoints = referrals.length * POINTS_PER_REF;
    const currentCyclePoints = totalPoints % GOAL;
    const cyclesCompleted = Math.floor(totalPoints / GOAL);
    const progressPercent = (currentCyclePoints / GOAL) * 100;

    // SVG Circle Math
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progressPercent / 100) * circumference;

    return (
        <main className="flex min-h-screen bg-space-900 bg-cyber-grid bg-[length:40px_40px]">

            <DashboardSidebar
                isAdmin={isAdmin}
                planType={planType}
                userCard={primaryCard}
            />

            {/* MAIN CONTENT Area */}
            <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
                {(!mounted || loading) ? (
                    <div className="flex items-center justify-center h-full text-neon-blue"><Loader2 className="animate-spin" size={48} /></div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* HEADER */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
                            <div>
                                <h2 className="text-3xl font-bold font-syncopate text-white mb-2">REWARDS PROGRAM <Gift className="inline text-neon-blue ml-2" /></h2>
                                <p className="text-white/60">Invite friends to build their TapOS Identity & Win Big</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-neon-blue font-bold uppercase tracking-widest mb-1">Total Earned</div>
                                <div className="text-4xl font-bold font-rajdhani text-white">{totalPoints} <span className="text-lg text-white/50">PTS</span></div>
                            </div>
                        </div>

                        {/* HERO: METRIC & CTA */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* LEFT: PROGRESS CHART */}
                            {/* LEFT: METRICS & STRATEGY */}
                            <div className="flex flex-col gap-6">

                                {/* DUAL CIRCLES ROW */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* 1. AD REWARDS CIRCLE */}
                                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center text-center group hover:border-neon-blue/30 transition-all duration-500">
                                        <div className="absolute inset-0 bg-neon-blue/5 opacity-0 group-hover:opacity-100 transition duration-500" />
                                        <div className="relative w-32 h-32 mb-4">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="64" cy="64" r="58" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                                                <circle cx="64" cy="64" r="58" stroke="#00f3ff" strokeWidth="8" fill="none"
                                                    strokeDasharray={2 * Math.PI * 58}
                                                    strokeDashoffset={(2 * Math.PI * 58) - (currentCyclePoints / GOAL) * (2 * Math.PI * 58)}
                                                    strokeLinecap="round" className="transition-all duration-1000 ease-out shadow-[0_0_20px_#00f3ff]" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <div className="text-2xl font-bold font-rajdhani text-white animate-pulse">{currentCyclePoints}</div>
                                                <div className="text-[8px] font-bold text-white/50 uppercase tracking-widest">/ {GOAL} PTS</div>
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Ad Rewards</h3>
                                    </div>

                                    {/* 2. PARTNER PROGRAM CIRCLE */}
                                    <div className="bg-gradient-to-br from-green-900/20 to-black border border-green-500/20 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center text-center group hover:border-green-400/30 transition-all duration-500">
                                        <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition duration-500" />
                                        <div className="relative w-32 h-32 mb-4">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="64" cy="64" r="58" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                                                <circle cx="64" cy="64" r="58" stroke="#48bb78" strokeWidth="8" fill="none"
                                                    strokeDasharray={2 * Math.PI * 58}
                                                    strokeDashoffset={2 * Math.PI * 58} // Empty for now
                                                    strokeLinecap="round" className="transition-all duration-1000 ease-out shadow-[0_0_20px_#48bb78]" />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <div className="text-2xl font-bold font-rajdhani text-green-400">$0</div>
                                                <div className="text-[8px] font-bold text-white/50 uppercase tracking-widest">EARNED</div>
                                            </div>
                                        </div>
                                        <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">Partner Ops</h3>
                                    </div>
                                </div>

                                {/* TRACKING & PAYMENT STRATEGY */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <Shield size={18} className="text-neon-blue" /> Tracking & Payment Strategy
                                        </h3>
                                        <span className="text-[10px] bg-white/10 text-white/50 px-2 py-1 rounded border border-white/10 uppercase">Beta Mode</span>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-500/20 rounded text-blue-400"><CreditCard size={16} /></div>
                                                <div>
                                                    <div className="text-xs font-bold text-white">Payout Method</div>
                                                    <div className="text-[10px] text-white/50">Manual Transfer (Net-30)</div>
                                                </div>
                                            </div>
                                            <button className="text-[10px] text-neon-blue hover:text-white transition">CONFIGURE</button>
                                        </div>

                                        <div className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-purple-500/20 rounded text-purple-400"><Terminal size={16} /></div>
                                                <div>
                                                    <div className="text-xs font-bold text-white">Tracking Pixel</div>
                                                    <div className="text-[10px] text-green-400">● Active (Global Cookie)</div>
                                                </div>
                                            </div>
                                            <button className="text-[10px] text-neon-blue hover:text-white transition">VIEW TAGS</button>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-white/10">
                                            <p className="text-[10px] text-white/40 leading-relaxed text-center">
                                                Automated payouts and real-time email notifications are currently being provisioned.
                                                Ensure your Stripe Connect account is ready for instant transfers.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* RIGHT: REWARD INFO & LINK */}
                            <div className="space-y-6">
                                {/* Reward Box */}
                                <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 rounded-3xl p-8 relative overflow-hidden shine-effect">
                                    <div className="absolute top-0 right-0 p-3">
                                        <div className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-1 rounded border border-purple-500/40 uppercase animate-pulse">
                                            Limited Time Offer
                                        </div>
                                    </div>
                                    <h3 className="text-gold text-lg font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_gold]" /> Next Reward
                                    </h3>
                                    <div className="text-3xl font-bold text-white mb-4">30 DAYS FREE ADS</div>
                                    <p className="text-white/70 text-sm mb-6 leading-relaxed">
                                        Reach {GOAL} Points to unlock a full month of featured advertising in the
                                        <span className="text-neon-blue font-bold"> JAVEELIST D+</span>.
                                        Boost your visibility instantly!
                                    </p>
                                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                        <AlertTriangle size={16} className="text-red-500 flex-shrink-0" />
                                        <p className="text-xs text-red-300 font-bold">Hurry! Point requirement increases to 1000 soon!</p>
                                    </div>
                                </div>

                                {/* AFFILIATE PROGRAM SECTION (ADDED) */}
                                <div className="bg-gradient-to-br from-green-900/40 to-black border border-green-500/30 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><User size={16} /></div>
                                        <span className="text-sm font-bold text-green-400 uppercase tracking-wider">TapOS Partner Program</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-1">EARN 15% COMMISSION</h3>
                                    <p className="text-white/60 text-xs mb-4">Promote TapOS Premium plans and earn recurring revenue for every successful signup.</p>
                                    <button onClick={() => window.location.href = 'mailto:javi@tapygo.com?subject=Join%20Partner%20Program&body=I%20am%20interested%20in%20becoming%20a%20TapOS%20Partner.'} className="w-full py-2 bg-green-500 hover:bg-green-400 text-black font-bold uppercase rounded-lg text-xs transition shadow-[0_0_15px_rgba(72,187,120,0.4)]">
                                        Join Affiliate Program
                                    </button>
                                </div>

                                {/* Link Box */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <div className="text-xs text-neon-blue font-bold uppercase mb-2">Your Referral Link</div>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-sm text-white/80 font-mono truncate">
                                            https://tapos360.com/create?ref={userSlug}
                                        </div>
                                        <button
                                            onClick={copyToClipboard}
                                            className="bg-neon-blue text-black px-4 rounded-lg font-bold hover:bg-white transition flex items-center gap-2"
                                        >
                                            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ACHIEVEMENTS / CYCLES */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white uppercase tracking-wider border-l-4 border-neon-blue pl-4">Achievements</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map((cycle) => {
                                    const unlocked = cyclesCompleted >= cycle;
                                    return (
                                        <div key={cycle} className={`p-6 rounded-2xl border ${unlocked ? 'bg-neon-blue/10 border-neon-blue' : 'bg-white/5 border-white/10 opacity-50'} flex flex-col items-center text-center transition-all duration-300`}>
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 text-2xl shadow-lg border-2 ${unlocked ? 'bg-gold border-white text-black shadow-[0_0_20px_gold]' : 'bg-white/10 border-white/10 grayscale'}`}>
                                                {unlocked ? '🏆' : '🔒'}
                                            </div>
                                            <div className={`font-bold ${unlocked ? 'text-white' : 'text-white/40'}`}>CYCLE {cycle}</div>
                                            <div className="text-[10px] uppercase tracking-widest text-neon-blue mt-1">{cycle * 5} REFERRALS</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                    </div>
                )}
            </div>

            {/* INLINE STYLE FOR SHINE EFFECT */}
            <style jsx>{`
                .shine-effect {
                    position: relative;
                }
                .shine-effect::before {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%; width: 100%; height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent);
                    transform: skewX(-20deg);
                    animation: shine 6s infinite;
                }
                @keyframes shine {
                    0% { left: -100%; }
                    20% { left: 100%; }
                    100% { left: 100%; }
                }
            `}</style>

        </main>
    );
}
