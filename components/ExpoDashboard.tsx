'use client';

import { Trophy, Users, Zap, ExternalLink, Ticket, ArrowUpRight, CheckCircle2 } from "lucide-react";

export default function ExpoDashboard({ leads, cards }: { leads: any[], cards: any[] }) {
    const verifiedLeads = leads.filter(l => l.is_verified);
    const totalLeads = leads.length;
    const totalViews = cards.reduce((acc, c) => acc + (c.content?.analytics?.views || 0), 0);
    const estimatedROI = (totalViews * 0.45).toFixed(2);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                            <a
                                href="/passport"
                                target="_blank"
                                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/30 transition group"
                            >
                                <div>
                                    <p className="text-sm font-bold text-white uppercase">Guest Registration</p>
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
