'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle, XCircle, Mail, User, Clock, Loader2, Lock, ShieldCheck } from 'lucide-react';

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
            setCards(data);

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
                    <div className="ml-auto bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-xs">
                        TOTAL USERS: <span className="text-neon-blue text-lg font-bold ml-2">{cards.length}</span>
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
                                    <th className="p-4">Slug / URL</th>
                                    <th className="p-4">Joined</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {cards.map((card) => {
                                    const content = card.content || {};
                                    const isActive = content.subscription === 'active';
                                    const email = content.email || 'No Email';
                                    const name = content.fullName || card.title || 'Unknown';

                                    return (
                                        <tr key={card.id} className="hover:bg-white/5 transition">
                                            <td className="p-4">
                                                {isActive ? (
                                                    <span className="inline-flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs border border-green-500/20">
                                                        <CheckCircle size={12} /> ACTIVE
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded text-xs border border-yellow-500/20">
                                                        <XCircle size={12} /> LOCKED
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden">
                                                        {content.profileImage && <img src={content.profileImage} className="w-full h-full object-cover" />}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white">{name}</div>
                                                        <div className="text-xs text-gray-500 font-mono">{card.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-white/80">
                                                        <Mail size={12} className="text-neon-blue" /> {email}
                                                    </div>
                                                    {content.phone && (
                                                        <div className="text-xs text-gray-500 pl-5">{content.phone}</div>
                                                    )}
                                                    {content.shipping && content.shipping.address && (
                                                        <div className="mt-2 text-[10px] text-gray-400 border-t border-white/10 pt-1 pl-1">
                                                            <div className="font-bold text-neon-blue mb-0.5">📍 SHIPPING ADDR:</div>
                                                            <div className="text-white">{content.shipping.address}</div>
                                                            <div>{content.shipping.city}, {content.shipping.state} {content.shipping.zip}</div>
                                                            <div>{content.shipping.country}</div>
                                                        </div>
                                                    )}
                                                </div>
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
                                                {!isActive && (
                                                    <button
                                                        onClick={() => handleActivate(card.id)}
                                                        className="px-3 py-1 bg-neon-blue/10 hover:bg-neon-blue text-neon-blue hover:text-black border border-neon-blue/50 rounded text-xs font-bold transition flex items-center gap-2"
                                                    >
                                                        <ShieldCheck size={12} /> ACTIVATE
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
