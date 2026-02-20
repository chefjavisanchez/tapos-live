'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Shield, Loader2, Lock, Users, DollarSign, CheckCircle2, ChevronRight, LogOut } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { isAdmin as checkIsAdmin } from '@/lib/admin-config';

interface Affiliate {
    affiliateSlug: string;
    affiliateName: string;
    affiliateEmail: string;
    totalReferrals: number;
    unpaidReferrals: number;
    paidReferrals: number;
    totalAmountOwed: number;
    historicalAmountPaid: number;
}

export default function AdminAffiliates() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
    const [globalStats, setGlobalStats] = useState({ totalOwed: 0, totalPaidHistorical: 0 });
    const [error, setError] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        checkAuthAndFetch();
    }, []);

    const checkAuthAndFetch = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return router.push('/login');

            if (!checkIsAdmin(session.user.email)) {
                setError(`ACCESS DENIED.`);
                setLoading(false);
                return;
            }

            const res = await fetch('/api/admin/affiliates', {
                headers: { 'Authorization': `Bearer ${session.access_token}` }
            });

            if (!res.ok) throw new Error('Failed to load affiliate data');

            const data = await res.json();
            if (data.success) {
                setAffiliates(data.affiliates);
                setGlobalStats(data.globalStats);
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkPaid = async (slug: string, amount: number) => {
        if (!confirm(`Are you sure you want to mark $${amount} as PAID for ${slug}? Ensure you have sent the money via PayPal.`)) return;

        try {
            setActionLoading(slug);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return router.push('/login');

            const res = await fetch('/api/admin/affiliates/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ affiliateSlug: slug })
            });

            const data = await res.json();
            if (data.success) {
                alert(`Success! Updated ${data.updatedCount} referrals to PAID.`);
                checkAuthAndFetch(); // Refresh Data
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err: any) {
            alert('Failed to connect: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    if (!mounted || loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-neon-blue">
                <Loader2 className="animate-spin mr-2" /> SCANNING AFFILIATE DATA...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 gap-4">
                <Lock size={48} />
                <h1 className="text-2xl font-bold">SECURITY ALERT</h1>
                <p>{error}</p>
                <button onClick={() => router.push('/')} className="text-white underline">Return Home</button>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-black bg-cyber-grid bg-[length:40px_40px]">
            <DashboardSidebar isAdmin={true} planType="admin" />

            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">

                    {/* HEADER */}
                    <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                        <div className="p-3 bg-neon-blue/20 rounded-xl border border-neon-blue text-neon-blue">
                            <Users size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-wider font-syncopate text-white">AFFILIATE PAYOUTS</h1>
                            <p className="text-neon-blue font-bold">Manual Net-30 Tracking</p>
                        </div>
                        <div className="ml-auto flex items-center gap-4">
                            <button onClick={() => router.push('/admin')} className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2">
                                BACK TO GOD MODE <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* GLOBAL STATS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white/5 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400">
                                    <DollarSign size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">TOTAL OWED (PENDING)</h3>
                                    <div className="text-4xl font-bold font-rajdhani text-red-400 mt-1">${globalStats.totalOwed}</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-green-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-green-500/20 border border-green-500/50 flex items-center justify-center text-green-400">
                                    <CheckCircle2 size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">LIFETIME PAID</h3>
                                    <div className="text-4xl font-bold font-rajdhani text-green-400 mt-1">${globalStats.totalPaidHistorical}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AFFILIATE LEDGER TABLE */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                        <div className="p-5 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-white tracking-widest">AFFILIATE LEDGER</h2>
                            <p className="text-xs text-white/50">*Only affiliates with Active referrals are shown.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-black/40 border-b border-white/10 text-gray-400 uppercase text-xs tracking-wider">
                                        <th className="p-4">Affiliate</th>
                                        <th className="p-4 text-center">Active Referrals</th>
                                        <th className="p-4 text-center">Paid vs Unpaid</th>
                                        <th className="p-4 text-right">Owed Amount</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {affiliates.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-8 text-center text-white/40">
                                                No affiliates with active referrals found.
                                            </td>
                                        </tr>
                                    )}
                                    {affiliates.map((aff) => {
                                        const isOwed = aff.totalAmountOwed > 0;

                                        return (
                                            <tr key={aff.affiliateSlug} className="hover:bg-white/5 transition">
                                                <td className="p-4">
                                                    <div className="font-bold text-white text-base">{aff.affiliateName}</div>
                                                    <div className="text-[10px] text-gray-500 font-mono mt-0.5">{aff.affiliateEmail}</div>
                                                    <a href={`/${aff.affiliateSlug}`} target="_blank" className="text-neon-blue text-xs hover:underline mt-1 inline-block">
                                                        /{aff.affiliateSlug}
                                                    </a>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="inline-flex bg-white/5 px-3 py-1 rounded text-lg font-bold font-rajdhani text-white">
                                                        {aff.totalReferrals}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <div className="flex flex-col text-[10px] font-bold">
                                                            <span className="text-green-400 text-sm">{aff.paidReferrals}</span>
                                                            <span className="text-gray-500 uppercase tracking-widest">Paid</span>
                                                        </div>
                                                        <div className="w-px h-6 bg-white/10"></div>
                                                        <div className="flex flex-col text-[10px] font-bold">
                                                            <span className={`${aff.unpaidReferrals > 0 ? 'text-red-400' : 'text-gray-500'} text-sm`}>{aff.unpaidReferrals}</span>
                                                            <span className="text-gray-500 uppercase tracking-widest">Unpaid</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex flex-col items-end">
                                                        <div className={`text-2xl font-bold font-rajdhani ${isOwed ? 'text-red-400' : 'text-white/30'}`}>
                                                            ${aff.totalAmountOwed}
                                                        </div>
                                                        <div className="text-[10px] text-green-500 font-mono mt-1">
                                                            Lifetime: ${aff.historicalAmountPaid}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {isOwed ? (
                                                        <button
                                                            disabled={actionLoading === aff.affiliateSlug}
                                                            onClick={() => handleMarkPaid(aff.affiliateSlug, aff.totalAmountOwed)}
                                                            className={`px-4 py-2 w-full justify-center rounded-lg text-xs font-bold transition flex items-center gap-2 border
                                                                ${actionLoading === aff.affiliateSlug
                                                                    ? 'bg-white/10 text-white/50 border-transparent cursor-not-allowed'
                                                                    : 'bg-neon-blue/20 hover:bg-neon-blue text-neon-blue hover:text-black border-neon-blue/50'}`}
                                                        >
                                                            {actionLoading === aff.affiliateSlug ? (
                                                                <><Loader2 size={14} className="animate-spin" /> UPDATING...</>
                                                            ) : (
                                                                <><CheckCircle2 size={14} /> MARK PAID</>
                                                            )}
                                                        </button>
                                                    ) : (
                                                        <div className="px-4 py-2 rounded-lg text-[10px] font-bold text-center bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-widest">
                                                            All Paid Up
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
