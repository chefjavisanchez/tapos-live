'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle, XCircle, Mail, User, Clock, Loader2, Lock, ShieldCheck, LogOut, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState<any[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        checkAuthAndFetch();
    }, []);

    const checkAuthAndFetch = async () => {
        try {
            // 1. Check Session
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Not logged in -> Redirect to login
                return router.push('/login');
            }

            // PROACTIVE REFRESH
            const { data: { session: freshSession }, error: refreshError } = await supabase.auth.refreshSession();
            const activeSession = freshSession || session;

            const allowedAdmins = ['javi@tapygo.com', 'chefjavisanchez@gmail.com'];
            if (!allowedAdmins.includes(activeSession.user.email || '')) {
                setError(`ACCESS DENIED: You are logged in as ${activeSession.user.email}. Authorization required.`);
                setLoading(false);
                return;
            }

            // 2. Fetch Data with Token
            const res = await fetch('/api/admin/data', {
                headers: {
                    'Authorization': `Bearer ${activeSession.access_token}`
                }
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to load data');
            }

            const data = await res.json();

            // CALCULATE REFERRAL STATS
            const counts: { [key: string]: number } = {};
            data.forEach((c: any) => {
                const ref = c.content?.referrer;
                if (ref) counts[ref] = (counts[ref] || 0) + 1;
            });

            const dataWithStats = data.map((c: any) => ({
                ...c,
                referralCount: counts[c.slug] || 0
            }));

            setCards(dataWithStats);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-neon-blue">
                <Loader2 className="animate-spin mr-2" /> VERIFYING ACCESS...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-red-500 gap-4">
                <Lock size={48} />
                <h1 className="text-2xl font-bold">SECURITY ALERT</h1>
                <p>{error}</p>
                <div className="flex gap-4">
                    <button onClick={() => router.push('/')} className="text-white underline">Return Home</button>
                    <button onClick={async () => {
                        await supabase.auth.signOut();
                        router.push('/login');
                    }} className="text-neon-blue font-bold border border-neon-blue px-4 py-2 rounded">
                        RE-AUTHENTICATE
                    </button>
                </div>
            </div>
        );
    }

    const handleActivate = async (cardId: string) => {
        if (!confirm('Are you sure you want to FORCE ACTIVATE this user?')) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return router.push('/login');

            const res = await fetch('/api/admin/activate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ cardId })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed');
            }

            alert('User Activated Successfully');
            checkAuthAndFetch(); // Refresh list

        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDelete = async (cardId: string) => {
        if (!confirm('⚠️ DANGER: Are you sure you want to PERMANENTLY DELETE this user? This action cannot be undone.')) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return router.push('/login');

            const res = await fetch('/api/admin/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ cardId })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed');
            }

            alert('User Deleted Successfully');
            checkAuthAndFetch(); // Refresh list

        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleRescue = async (cardId: string, currentEmail: string) => {
        const newEmail = prompt(`ENTER NEW EMAIL for this user:\n(Currently: ${currentEmail})`, currentEmail);
        if (newEmail === null) return; // Cancelled

        const newPassword = prompt(`ENTER NEW TEMPORARY PASSWORD (Optional):\nLeave blank to keep existing password.`);
        if (newPassword === null) return; // Cancelled

        if (newEmail === currentEmail && !newPassword) {
            return alert('No changes made.');
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return router.push('/login');

            // Show Loading State (Basic)
            setLoading(true);

            const res = await fetch('/api/admin/rescue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    cardId,
                    newEmail: newEmail !== currentEmail ? newEmail : undefined,
                    newPassword: newPassword || undefined
                })
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed');
            }

            alert('✅ USER RESCUED!\nCredentials updated successfully.');
            checkAuthAndFetch();

        } catch (err: any) {
            alert('❌ ERROR: ' + err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black bg-cyber-grid p-8 text-white font-mono animate-in fade-in">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                    <div className="p-3 bg-neon-blue/20 rounded-xl border border-neon-blue text-neon-blue">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-wider font-syncopate text-white">GOD MODE</h1>
                        <p className="text-neon-blue font-bold">SUPER ADMIN DASHBOARD</p>
                    </div>
                    <div className="ml-auto flex items-center gap-4">
                        <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-xs">
                            TOTAL USERS: <span className="text-neon-blue text-lg font-bold ml-2">{cards.length}</span>
                        </div>
                        <button onClick={() => router.push('/')} className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2">
                            EXIT <LogOut size={14} />
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-xs tracking-wider">
                                    <th className="p-4">Status</th>
                                    <th className="p-4">User Identity</th>
                                    <th className="p-4">Contact Info</th>
                                    <th className="p-4 text-center">Referrals</th>
                                    <th className="p-4">Slug / URL</th>
                                    <th className="p-4">Joined</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {cards.map((card) => {
                                    const content = card.content || {};
                                    const userDetails = card.userDetails || {};
                                    const metadata = userDetails.metadata || {};

                                    const isActive = content.subscription === 'active' || metadata.plan_status === 'active';
                                    const refCount = (card as any).referralCount || 0;
                                    const isWinner = refCount >= 5;
                                    const email = userDetails.email || content.email || 'No Email';
                                    const name = metadata.full_name || content.fullName || card.title || 'Unknown';
                                    const plan = metadata.plan || 'independent';

                                    return (
                                        <tr key={card.id} className="hover:bg-white/5 transition">
                                            <td className="p-4">
                                                <div className="flex flex-col gap-2">
                                                    {isActive ? (
                                                        <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-1 rounded text-[10px] font-bold border border-green-500/20">
                                                            <CheckCircle size={10} /> ACTIVE
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded text-[10px] font-bold border border-yellow-500/20">
                                                            <Clock size={10} /> PENDING
                                                        </span>
                                                    )}
                                                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase border ${plan === 'corporate' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                        {plan} {plan === 'corporate' && <span className="ml-1 text-[10px] text-white">x{metadata.quantity || 1}</span>}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                                                        {content.profileImage ? <img src={content.profileImage} className="w-full h-full object-cover" /> : <User size={16} className="text-white/20" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white mb-0.5">{name}</div>
                                                        <div className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                                                            <Shield size={10} /> {card.id.slice(0, 8)}...
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-white/80 font-bold text-xs truncate max-w-[180px]">
                                                        <Mail size={12} className="text-neon-blue" /> {email}
                                                    </div>

                                                    {metadata.shipping_address && (
                                                        <div className="mt-2 p-2 rounded bg-white/5 border border-white/5">
                                                            <div className="text-[9px] font-black text-neon-blue uppercase mb-1 flex items-center gap-1">
                                                                <Clock size={10} /> SHIPPING DETAILS
                                                            </div>
                                                            <div className="text-[11px] leading-tight text-white/70 italic">
                                                                {metadata.shipping_address}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className={`inline-flex flex-col items-center justify-center p-2 rounded-lg ${isWinner ? 'bg-yellow-500/20 border border-yellow-500' : 'bg-white/5'}`}>
                                                    <span className={`text-xl font-bold font-rajdhani ${isWinner ? 'text-yellow-400' : 'text-white'}`}>{refCount}</span>
                                                    <span className="text-[10px] text-gray-400 uppercase">REFS</span>
                                                </div>
                                                {isWinner && <div className="text-[10px] font-bold text-yellow-500 mt-1 animate-pulse">🏆 WINNER</div>}
                                            </td>
                                            <td className="p-4">
                                                <a href={`/${card.slug}`} target="_blank" className="text-neon-blue hover:underline font-mono">
                                                    /{card.slug}
                                                </a>
                                            </td>
                                            <td className="p-4 text-gray-500 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={12} />
                                                    {new Date(card.created_at).toLocaleDateString()}
                                                </div>
                                                <div>{new Date(card.created_at).toLocaleTimeString()}</div>
                                            </td>
                                            <td className="p-4">
                                                {!isActive ? (
                                                    <button
                                                        onClick={() => handleActivate(card.id)}
                                                        className="px-3 py-1 bg-neon-blue/10 hover:bg-neon-blue text-neon-blue hover:text-black border border-neon-blue/50 rounded text-xs font-bold transition flex items-center gap-2"
                                                    >
                                                        <ShieldCheck size={12} /> ACTIVATE
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-green-500 font-bold text-xs border border-green-500/20 px-2 py-0.5 rounded bg-green-900/10">ACTIVE</span>
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Re-trigger GHL Webhook?')) handleActivate(card.id);
                                                            }}
                                                            title="Re-Sync / Re-Trigger Webhook"
                                                            className="p-1.5 hover:bg-white/10 rounded-full text-white/30 hover:text-white transition"
                                                        >
                                                            <ShieldCheck size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRescue(card.id, email)}
                                                            className="px-2 py-1 bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-black border border-yellow-500/50 rounded text-xs font-bold transition flex items-center gap-1"
                                                            title="Rescue Account (Change Email/Password)"
                                                        >
                                                            <Lock size={12} /> RESCUE
                                                        </button>
                                                    </div>
                                                )}

                                                {/* DELETE ACTION (ONLY FOR LOCKED/INACTIVE) */}
                                                {!isActive && (
                                                    <button
                                                        onClick={() => handleDelete(card.id)}
                                                        className="mt-2 px-3 py-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 rounded text-xs font-bold transition flex items-center gap-2 w-full justify-center"
                                                    >
                                                        <Trash2 size={12} /> DELETE
                                                    </button>
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
    );
}
