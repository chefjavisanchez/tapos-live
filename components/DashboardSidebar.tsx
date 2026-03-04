'use client';

import { Terminal, LayoutGrid, User, Users, Gift, ShoppingBag, Shield, Settings, CreditCard, LogOut, Eye, Share2, Ticket, ArrowUpRight } from "lucide-react";
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

import { updateCSMetrics, calculateOnboardingScore } from '@/lib/cs-tracking';

const NavItem = ({ icon, label, href, active, onClick, router }: { icon: any, label: string, href?: string, active?: boolean, onClick?: () => void, router: any }) => {
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

    if (onClick) return <button onClick={onClick} className={baseClass}>{content}</button>;
    return (
        <button onClick={() => router.push(href || '/')} className={baseClass}>
            {content}
        </button>
    );
};

export default function DashboardSidebar({
    isAdmin,
    planType,
    activeTab,
    setActiveTab,
    userCard
}: {
    isAdmin: boolean,
    planType: string,
    activeTab?: 'dashboard' | 'team' | 'leads' | 'expo',
    setActiveTab?: (tab: 'dashboard' | 'team' | 'leads' | 'expo') => void,
    userCard?: any
}) {
    const router = useRouter();
    const pathname = usePathname();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const isDashboard = pathname === '/';
    const [mounted, setMounted] = useState(false);
    const [onboardingScore, setOnboardingScore] = useState(0);
    const [isSponsor, setIsSponsor] = useState(false);

    useEffect(() => {
        setMounted(true);

        const trackActivity = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            setIsSponsor(!!user.user_metadata?.is_sponsor);

            // Update UI score immediately
            if (userCard) {
                const metrics = calculateOnboardingScore(userCard.content);
                setOnboardingScore(metrics.score);

                // Track backend only once per session to avoid noise/overhead
                const sessionTracked = sessionStorage.getItem('tapos_active_tracked');
                if (!sessionTracked) {
                    await updateCSMetrics(user.id, userCard.content);
                    sessionStorage.setItem('tapos_active_tracked', 'true');
                }
            }
        };

        trackActivity();
    }, [userCard]);

    if (!mounted) return <aside className="w-72 border-r border-white/10 bg-black/40 backdrop-blur-xl max-md:hidden h-screen" />;

    return (
        <aside className="w-72 border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col p-6 max-md:hidden sticky top-0 h-screen overflow-hidden">
            <div className="flex items-center gap-3 mb-10 shrink-0">
                <div className="w-10 h-10 rounded-full bg-neon-blue neon-glow flex items-center justify-center border border-neon-blue/50">
                    <Terminal className="text-black w-6 h-6" />
                </div>
                <h1 className="font-syncopate text-xl tracking-tighter uppercase">TAP<span className="text-neon-blue font-black">OS</span></h1>
            </div>

            <nav className="flex flex-col gap-2 flex-grow overflow-y-auto pr-2 custom-scrollbar">
                <NavItem
                    icon={<LayoutGrid size={20} />}
                    label="Dashboard"
                    active={isDashboard && activeTab === 'dashboard'}
                    onClick={isDashboard ? () => setActiveTab?.('dashboard') : () => router.push('/')}
                    router={router}
                />
                <NavItem
                    icon={<Users size={20} />} // Reusing Users icon or similar
                    label="Leads"
                    active={isDashboard && activeTab === 'leads'}
                    onClick={isDashboard ? () => setActiveTab?.('leads') : () => router.push('/?tab=leads')}
                    router={router}
                />
                <NavItem
                    icon={<Ticket size={20} className="text-[#ffde00]" />}
                    label="Expo Mode"
                    active={isDashboard && activeTab === 'expo'}
                    onClick={isDashboard ? () => setActiveTab?.('expo') : () => router.push('/?tab=expo')}
                    router={router}
                />

                {planType === 'corporate' && (
                    <NavItem
                        icon={<Users size={20} />}
                        label="Team Control"
                        active={activeTab === 'team'}
                        onClick={() => {
                            if (isDashboard) setActiveTab?.('team');
                            else router.push('/?tab=team');
                        }}
                        router={router}
                    />
                )}

                <NavItem href="/profile" icon={<User size={20} />} label="Profile" active={pathname === '/profile'} router={router} />
                <NavItem href="/referrals" icon={<Gift size={20} />} label="Rewards" active={pathname === '/referrals'} router={router} />
                <NavItem href="/shop" icon={<ShoppingBag size={20} />} label="Hardware Store" active={pathname === '/shop'} router={router} />
                <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" active={pathname === '/settings'} router={router} />

                {isAdmin && (
                    <div className="pt-4 mt-4 border-t border-white/10">
                        <NavItem href="/admin" icon={<Shield size={20} />} label="God Mode" active={pathname === '/admin'} router={router} />
                        <NavItem href="/admin/affiliates" icon={<Users size={20} />} label="Affiliates" active={pathname === '/admin/affiliates'} router={router} />
                    </div>
                )}

                {/* SUCCESS SCORE CARD (CS FEATURE) */}
                <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-neon-blue/10 to-purple-500/10 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Success Score</span>
                        <span className="text-[10px] font-bold text-neon-blue">{onboardingScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
                        <div
                            className="h-full bg-neon-blue transition-all duration-1000 ease-out shadow-[0_0_10px_#00f3ff]"
                            style={{ width: `${onboardingScore}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-white/50 leading-tight">
                        {onboardingScore < 100
                            ? "Complete your profile to unlock maximum visibility."
                            : "Your profile is fully optimized for conversions!"}
                    </p>
                </div>
            </nav>


            <div className="mt-6 pt-6 border-t border-white/10 shrink-0">
                <button onClick={handleSignOut} className="flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-200">
                    <LogOut size={20} />
                    <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}


