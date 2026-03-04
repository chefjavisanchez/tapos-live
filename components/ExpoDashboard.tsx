'use client';

import { Trophy, Users, Zap, ExternalLink, Ticket, ArrowUpRight, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ExpoDashboard({ leads, cards }: { leads: any[], cards: any[] }) {
    const [isSponsor, setIsSponsor] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSponsorStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserId(user.id);
                if (user.user_metadata?.is_sponsor) {
                    setIsSponsor(true);
                }
            }
            setLoading(false);
        };
        checkSponsorStatus();
    }, []);

    const verifiedLeads = leads.filter(l => l.is_verified);
    const totalLeads = leads.length;
    const totalViews = cards.reduce((acc, c) => acc + (c.content?.analytics?.views || 0), 0);
    const estimatedROI = (totalViews * 0.45).toFixed(2);

    if (loading) return <div className="p-10 text-[#ffde00] animate-pulse">VERIFYING SPONSOR CREDENTIALS...</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 relative">

            {/* LOCKED OVERLAY FOR NON-SPONSORS */}
            {!isSponsor && (
                <div className="absolute inset-x-0 -top-4 -bottom-4 z-50 flex items-center justify-center p-6 rounded-[3rem] overflow-hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>
                    <div className="relative z-10 max-w-xl w-full bg-gradient-to-br from-[#ffde00]/20 via-black to-purple-500/10 border border-[#ffde00]/30 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(255,222,0,0.15)] text-center animate-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 bg-[#ffde00]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#ffde00]/30 text-[#ffde00]">
                            <Lock size={40} className="animate-pulse" />
                        </div>

                        <h2 className="text-3xl font-black font-syncopate uppercase mb-4 leading-tight">
                            UNLOCK <span className="text-[#ffde00]">EXPO MODE</span>
                        </h2>

                        <p className="text-white/70 text-sm mb-8 leading-relaxed font-medium">
                            Transform your TapOS <span className="text-[#ffde00] font-bold">"Impulso"</span> into a lead-generation machine. Unlock real-time verified capture,
                            instant raffle entry, and the high-speed Global Passport registration system.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <a
                                href="https://buy.stripe.com/3cIaEW3ICeje1cR62r3gk0A"
                                target="_blank"
                                className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:border-[#ffde00]/50 transition cursor-pointer group"
                            >
                                <Sparkles size={16} className="text-[#ffde00] mb-2 group-hover:scale-110 transition" />
                                <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Event Booster</p>
                                <p className="text-lg font-bold text-white">$199<span className="text-sm text-white/40 font-medium">/event</span></p>
                                <p className="text-[9px] text-[#ffde00] font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Select Plan ➔</p>
                            </a>
                            <a
                                href="https://buy.stripe.com/8x24gy4MG4IE2gVcqP3gk0B"
                                target="_blank"
                                className="p-4 bg-[#ffde00]/5 border border-[#ffde00]/20 rounded-2xl text-left hover:border-[#ffde00]/50 transition cursor-pointer group"
                            >
                                <Trophy size={16} className="text-[#ffde00] mb-2 group-hover:scale-110 transition" />
                                <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">Global Sponsor</p>
                                <p className="text-lg font-bold text-white">$999<span className="text-sm text-white/40 font-medium">/year</span></p>
                                <p className="text-[9px] text-[#ffde00] font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Best Value ➔</p>
                            </a>
                        </div>

                        <a
                            href="https://www.tapos360.com"
                            target="_blank"
                            className="block w-full bg-[#ffde00] hover:bg-white text-black font-black py-5 rounded-[1.5rem] text-sm uppercase tracking-[0.2em] transition-all transform hover:scale-[1.02] shadow-[0_10px_30px_rgba(255,222,0,0.2)]"
                        >
                            ACTIVATE MISSION CONTROL
                        </a>

                        <div className="mt-8 pt-6 border-t border-white/5 text-left">
                            <p className="text-[10px] text-white font-black uppercase tracking-[0.2em] mb-4 text-center">Implementation Blueprint</p>
                            <div className="space-y-3">
                                <div className="flex gap-3">
                                    <div className="text-[#ffde00] font-bold text-xs">01</div>
                                    <p className="text-[11px] text-white">Invite guests to register at <span className="underline decoration-[#ffde00] font-bold">tapos360.com/passport?host=XXXXX</span></p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="text-[#ffde00] font-bold text-xs">02</div>
                                    <p className="text-[11px] text-white">Vendors use the TapOS scanner in <strong>Expo Mode</strong> to scan visitor QRs.</p>
                                </div>
                                <div className="flex gap-3">
                                    <div className="text-[#ffde00] font-bold text-xs">03</div>
                                    <p className="text-[11px] text-white">Leads sync instantly to <u>both</u> the Vendor and Host dashboards.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex flex-col items-center gap-2">
                            <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-bold">
                                30-day cancellation notice required for annual plans.
                            </p>
                            <a href="mailto:support@tapos360.com" className="text-[9px] text-white/40 hover:text-white underline uppercase tracking-widest">
                                Manage Subscription / Cancel
                            </a>
                        </div>
                    </div>
                </div>
            )}

            <header className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#ffde00]/20 rounded-lg text-[#ffde00]">
                        <Ticket size={24} />
                    </div>
                    <h1 className="text-4xl font-black font-syncopate uppercase">EXPO <span className="text-[#ffde00]">DASHBOARD</span></h1>
                </div>
                <p className="text-white/50 font-medium">Real-time interaction matrix and ROI verification.</p>
            </header>

            {/* HIGH-IMPACT STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gradient-to-br from-[#ffde00]/20 to-black border border-[#ffde00]/30 rounded-[2.5rem] p-8 shadow-[0_0_30px_rgba(255,222,0,0.1)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Trophy size={80} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[#ffde00] text-xs font-black uppercase tracking-[0.3em] mb-4">Raffle Entries</p>
                        <h2 className="text-6xl font-black text-white font-syncopate mb-2">{verifiedLeads.length}</h2>
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Verified Guest Interactions</p>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Users size={80} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-white/30 text-xs font-black uppercase tracking-[0.3em] mb-4">Total Spoken With</p>
                        <h2 className="text-6xl font-black text-white font-syncopate mb-2">{totalLeads}</h2>
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Gross Networking Reach</p>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-neon-blue/20 to-black border border-neon-blue/30 rounded-[2.5rem] p-8 shadow-[0_0_30px_rgba(0,243,255,0.1)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={80} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-neon-blue text-xs font-black uppercase tracking-[0.3em] mb-4">Verified ROI</p>
                        <h2 className="text-6xl font-black text-white font-syncopate mb-2">${estimatedROI}</h2>
                        <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Digital Conservation Value</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* RECENT VERIFIED LEADS */}
                <div className="bg-black border border-white/10 rounded-[2rem] overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Live Verified Stream</h3>
                        <span className="text-[10px] font-bold text-[#ffde00] animate-pulse">● LIVE</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {verifiedLeads.length > 0 ? (
                            verifiedLeads.map((lead, i) => (
                                <div key={lead.id} className="p-4 border-b border-white/5 flex items-center justify-between hover:bg-white/5 transition">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#ffde00]/10 border border-[#ffde00]/20 flex items-center justify-center text-[#ffde00]">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{lead.full_name}</p>
                                            <p className="text-[10px] text-white/40 font-mono italic">{new Date(lead.created_at).toLocaleTimeString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-[#ffde00] font-black uppercase">+1 ENTRY</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-white/20">
                                <p className="text-sm font-bold uppercase tracking-widest">No verified scans yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/20 rounded-[2rem] p-8">
                        <h3 className="text-lg font-black uppercase tracking-widest text-white mb-6 flex items-center gap-3">
                            <Zap className="text-purple-400" size={20} /> Sponsor Tools
                        </h3>
                        <div className="space-y-4">
                            <button
                                onClick={() => {
                                    const link = `${window.location.origin}/passport?host=${userId}`;
                                    navigator.clipboard.writeText(link);
                                    alert("Personalized registration link copied!");
                                }}
                                className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/30 transition group"
                            >
                                <div>
                                    <p className="text-sm font-bold text-white uppercase">Personalized registration</p>
                                    <p className="text-[10px] text-white/40">Guests register via your unique host link</p>
                                </div>
                                <ArrowUpRight size={16} className="text-[#ffde00] group-hover:scale-110 transition" />
                            </button>
                            <a
                                href={`/passport?host=${userId}`}
                                target="_blank"
                                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/30 transition group"
                            >
                                <div>
                                    <p className="text-sm font-bold text-white uppercase">Open Passport Form</p>
                                    <p className="text-[10px] text-white/40">Open this on a tablet at your booth</p>
                                </div>
                                <ExternalLink size={16} className="text-white/20 group-hover:text-white transition" />
                            </a>
                            <div className="p-4 bg-[#ffde00]/10 rounded-xl border border-[#ffde00]/20">
                                <p className="text-[10px] text-[#ffde00] font-black uppercase mb-1">PRO TIP</p>
                                <p className="text-xs text-white/60 leading-relaxed italic">
                                    Turn on <strong>Expo Mode</strong> in your scanner to instantly capture guest info and award raffle entries!
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center">
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] mb-4">Event ROI Status</p>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-12 h-1 bg-neon-blue shadow-[0_0_10px_#00f3ff]"></div>
                            ))}
                        </div>
                        <p className="text-xs text-white/60">Your digital presence is saving thousands of pages of paper and accelerating your networking by 400%.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
