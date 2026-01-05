import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { Shield, CheckCircle, XCircle, Mail, User, Clock } from 'lucide-react';

// FORCE DYNAMIC (Always fetch fresh data)
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // 1. SERVICE ROLE CLIENT (Bypasses RLS to see ALL users)
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2. FETCH ALL CARDS
    const { data: cards, error } = await supabaseAdmin
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        return <div className="p-10 text-red-500">Error loading admin data: {error.message}</div>;
    }

    // 3. SECURE VIEW (Only show to you - basic protection for now)
    // For now, this page is 'open' if you know the URL, BUT since it's using the Service Key solely for rendering,
    // we should add a check. Ideally, we check if the logged-in user is YOU.
    // I'll add a simple client-side gate or server-side email check if you provide your email.
    // For now, it will list data.

    return (
        <div className="min-h-screen bg-black bg-cyber-grid p-8 text-white font-mono">
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
                        TOTAL USERS: <span className="text-neon-blue text-lg font-bold ml-2">{cards?.length || 0}</span>
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
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {cards?.map((card) => {
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
