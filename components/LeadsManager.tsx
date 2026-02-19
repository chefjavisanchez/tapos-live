import React, { useState, useMemo } from 'react';
import { Search, Filter, FileSpreadsheet, User, CreditCard, Calendar } from 'lucide-react';

interface Lead {
    id?: string;
    created_at?: string;
    date: string;
    name: string;
    email?: string;
    phone?: string;
    note?: string;
    owner_id?: string;
    cardTitle?: string; // Enhanced lead type to include source card
    cardId?: string;
}

interface Props {
    cards: any[];
    leads?: any[];
}

export default function LeadsManager({ cards, leads = [] }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCardId, setSelectedCardId] = useState<string>('all');

    // Aggregate all leads from all cards and the SQL table
    const allLeads = useMemo(() => {
        let cardLeads: Lead[] = [];
        cards.forEach(card => {
            if (card.content?.leads) {
                const ls = card.content.leads.map((l: any) => ({
                    ...l,
                    cardTitle: card.title,
                    cardId: card.id
                }));
                cardLeads = [...cardLeads, ...ls];
            }
        });

        let sqlLeads: Lead[] = [];
        if (leads && leads.length > 0) {
            sqlLeads = leads.map((l: any) => {
                const sourceCard = cards.find(c => c.id === l.card_id);
                return {
                    id: l.id,
                    created_at: l.created_at,
                    date: l.created_at || new Date().toISOString(),
                    name: l.name,
                    email: l.email,
                    phone: l.phone,
                    note: l.note,
                    owner_id: l.owner_id,
                    cardTitle: sourceCard ? sourceCard.title : undefined,
                    cardId: l.card_id
                };
            });
        }

        const combined = [...sqlLeads, ...cardLeads];
        return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [cards, leads]);

    // Filter leads
    const filteredLeads = useMemo(() => {
        return allLeads.filter(lead => {
            const matchesSearch =
                lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.phone?.includes(searchTerm);

            const matchesCard = selectedCardId === 'all' || lead.cardId === selectedCardId;

            return matchesSearch && matchesCard;
        });
    }, [allLeads, searchTerm, selectedCardId]);

    const downloadCSV = () => {
        if (filteredLeads.length === 0) return alert('No leads to export.');
        const headers = ["Date", "Name", "Email", "Phone", "Note", "Source Card"];
        const rows = filteredLeads.map(l => [
            new Date(l.date).toLocaleDateString(),
            l.name,
            l.email,
            l.phone,
            `"${(l.note || '').replace(/\n/g, ' ')}"`,
            `"${l.cardTitle || 'Unknown'}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `tapos_all_leads_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="animate-in fade-in duration-700">
            <header className="mb-8">
                <h1 className="text-4xl font-black mb-2 font-syncopate uppercase">LEAD <span className="text-neon-blue">MANAGER</span></h1>
                <p className="text-white/50 font-medium">View and export all contacts captured across your TapOS cards.</p>
            </header>

            <div className="bg-[#050510] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative">

                {/* CONTROLS */}
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5">

                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-neon-blue/50 transition"
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        {/* Card Filter */}
                        <div className="relative">
                            <select
                                value={selectedCardId}
                                onChange={(e) => setSelectedCardId(e.target.value)}
                                className="bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white appearance-none cursor-pointer hover:border-white/30 transition text-sm font-bold uppercase min-w-[200px]"
                            >
                                <option value="all">All Cards</option>
                                {cards.map(card => (
                                    <option key={card.id} value={card.id}>{card.title}</option>
                                ))}
                            </select>
                            <Filter className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={16} />
                        </div>

                        {/* Export */}
                        <button
                            onClick={downloadCSV}
                            className="flex items-center gap-2 bg-neon-blue hover:bg-white text-black px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition shadow-[0_0_20px_rgba(0,243,255,0.2)]"
                        >
                            <FileSpreadsheet size={16} /> Export CSV
                        </button>
                    </div>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-white/2 border-b border-white/10">
                    <div className="p-6 text-center">
                        <div className="text-white/40 text-[10px] items-center justify-center gap-2 uppercase font-black tracking-widest flex mb-2">
                            <User size={14} /> Total Contacts
                        </div>
                        <div className="text-3xl font-black text-white font-rajdhani">{filteredLeads.length}</div>
                    </div>
                    <div className="p-6 text-center">
                        <div className="text-white/40 text-[10px] items-center justify-center gap-2 uppercase font-black tracking-widest flex mb-2">
                            <CreditCard size={14} /> Active Sources
                        </div>
                        <div className="text-3xl font-black text-neon-blue font-rajdhani">
                            {selectedCardId === 'all'
                                ? new Set(filteredLeads.map(l => l.cardId)).size
                                : (filteredLeads.length > 0 ? 1 : 0)}
                        </div>
                    </div>
                    <div className="p-6 text-center">
                        <div className="text-white/40 text-[10px] items-center justify-center gap-2 uppercase font-black tracking-widest flex mb-2">
                            <Calendar size={14} /> Latest Capture
                        </div>
                        <div className="text-xl font-bold text-white font-rajdhani mt-1">
                            {filteredLeads.length > 0 ? new Date(filteredLeads[0].date).toLocaleDateString() : '-'}
                        </div>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-white/70">
                        <thead className="bg-white/5 text-xs uppercase font-bold text-white/40 sticky top-0 backdrop-blur-md">
                            <tr>
                                <th className="p-6 font-mono">Date</th>
                                <th className="p-6">Name</th>
                                <th className="p-6">Contact Details</th>
                                <th className="p-6">Source Card</th>
                                <th className="p-6">Note</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-white/30 italic">
                                        No leads found matching your filters.
                                    </td>
                                </tr>
                            ) : filteredLeads.map((lead, i) => (
                                <tr key={i} className="hover:bg-white/5 transition group">
                                    <td className="p-6 font-mono text-xs text-white/40 border-l-2 border-transparent group-hover:border-neon-blue transition-colors">
                                        {new Date(lead.date).toLocaleDateString()}
                                        <div className="text-[10px] opacity-50">{new Date(lead.date).toLocaleTimeString()}</div>
                                    </td>
                                    <td className="p-6 font-bold text-white text-lg font-rajdhani">{lead.name}</td>
                                    <td className="p-6">
                                        <div className="flex flex-col gap-1 text-xs">
                                            {lead.email && <a href={`mailto:${lead.email}`} className="text-neon-blue hover:underline flex items-center gap-2">@{lead.email}</a>}
                                            {lead.phone && <span className="text-white/50 flex items-center gap-2">#{lead.phone}</span>}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide text-white/70 border border-white/10">
                                            {lead.cardTitle}
                                        </span>
                                    </td>
                                    <td className="p-6 text-xs text-white/50 max-w-xs truncate">{lead.note || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
