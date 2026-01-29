import { X, FileSpreadsheet } from 'lucide-react';

interface Lead {
    name: string;
    email: string;
    phone: string;
    note?: string;
    date: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    leads: Lead[];
    cardTitle: string;
}

export default function LeadViewer({ isOpen, onClose, leads, cardTitle }: Props) {
    if (!isOpen) return null;

    const downloadCSV = () => {
        if (!leads || leads.length === 0) return alert('No leads to export.');
        const headers = ["Name", "Email", "Phone", "Note", "Date"];
        const rows = leads.map(l => [
            l.name,
            l.email,
            l.phone,
            `"${(l.note || '').replace(/\n/g, ' ')}"`,
            new Date(l.date).toLocaleDateString()
        ]);

        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `leads_${cardTitle.replace(/\s+/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="bg-[#050510] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">

                {/* HEADER */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div>
                        <h2 className="text-xl font-bold text-white font-rajdhani uppercase tracking-wider">Lead Database</h2>
                        <p className="text-white/40 text-xs">Captures for: <span className="text-neon-blue">{cardTitle}</span></p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={downloadCSV} className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500 text-green-400 hover:text-white px-4 py-2 rounded-lg transition border border-green-500/20 text-xs font-bold uppercase">
                            <FileSpreadsheet size={16} /> Export CSV
                        </button>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition text-white/50 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="overflow-auto flex-1 p-0">
                    <table className="w-full text-left text-sm text-white/70">
                        <thead className="bg-white/5 text-xs uppercase font-bold text-white/40 sticky top-0 backdrop-blur-md">
                            <tr>
                                <th className="p-4 font-mono">Date</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Note</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {leads.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-10 text-center text-white/30 italic">
                                        No leads captured yet.
                                    </td>
                                </tr>
                            ) : leads.map((lead, i) => (
                                <tr key={i} className="hover:bg-white/5 transition">
                                    <td className="p-4 font-mono text-xs text-white/40">{new Date(lead.date).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold text-white">{lead.name}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col text-xs">
                                            {lead.email && <a href={`mailto:${lead.email}`} className="text-neon-blue hover:underline">{lead.email}</a>}
                                            {lead.phone && <span className="text-white/50">{lead.phone}</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-xs text-white/50 max-w-xs truncate">{lead.note || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-white/10 bg-black/20 text-center">
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">TapOS Secure Database • Total Records: {leads.length}</p>
                </div>
            </div>
        </div>
    );
}
