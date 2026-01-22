'use client';

import { Terminal, LayoutGrid, User, Users, Gift, ShoppingBag, Shield, Settings, CreditCard, LogOut, Eye, Share2 } from "lucide-react";
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

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
    activeTab?: string,
    setActiveTab?: (tab: any) => void,
    userCard?: any
}) {
    const router = useRouter();
    const pathname = usePathname();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const isDashboard = pathname === '/';

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
                    icon={<CreditCard size={20} />}
                    label="My Cards"
                    active={false}
                    onClick={() => {
                        if (isDashboard) {
                            setActiveTab?.('dashboard');
                        } else {
                            router.push('/');
                        }
                    }}
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
                    </div>
                )}
            </nav>

            {/* STATS WIDGET */}
            <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4 shrink-0 overflow-hidden relative group">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]"></span>
                        <span className="text-[10px] font-black tracking-widest text-white/40 uppercase">Overview</span>
                    </div>
                    <div className="px-2 py-0.5 bg-neon-blue/20 text-neon-blue text-[9px] font-black rounded border border-neon-blue/30 uppercase">Live</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        <div className="text-[9px] text-white/30 uppercase font-bold mb-1">Views</div>
                        <div className="text-xl font-black font-rajdhani text-white">{userCard?.content?.views || 0}</div>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                        <div className="text-[9px] text-white/30 uppercase font-bold mb-1">Saves</div>
                        <div className="text-xl font-black font-rajdhani text-neon-blue">{userCard?.content?.saves || 0}</div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition overflow-hidden">
                        <Share2 size={14} className="mx-auto text-white/60" />
                    </button>
                    <button
                        onClick={() => userCard?.slug && window.open(`/${userCard.slug}`, '_blank')}
                        className="flex-1 py-2 bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/30 rounded-lg transition overflow-hidden"
                    >
                        <Eye size={14} className="mx-auto text-neon-blue" />
                    </button>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 shrink-0">
                <button onClick={handleSignOut} className="flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-200">
                    <LogOut size={20} />
                    <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}


