'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, MapPin, Plus, Trash2, Edit, ExternalLink, Copy, CheckCircle2, Loader2, Link as LinkIcon, Ticket } from 'lucide-react';

interface Event {
    id: string;
    title: string;
    description: string;
    date_text: string;
    time_text: string;
    address: string;
    slug: string;
    is_active: boolean;
    created_at: string;
}

export default function EventManager() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Partial<Event>>({
        title: '',
        description: '',
        date_text: '',
        time_text: '',
        address: '',
        slug: '',
        is_active: true
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setEvents(data || []);
        } catch (err: any) {
            console.error('Error fetching events:', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const eventData = {
                ...editingEvent,
                owner_id: user.id,
                slug: editingEvent.slug || editingEvent.title?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `event-${Date.now()}`
            };

            let error;
            if (editingEvent.id) {
                const { error: err } = await supabase
                    .from('events')
                    .update(eventData)
                    .eq('id', editingEvent.id);
                error = err;
            } else {
                const { error: err } = await supabase
                    .from('events')
                    .insert([eventData]);
                error = err;
            }

            if (error) throw error;

            alert('Event saved successfully!');
            setIsEditing(false);
            fetchEvents();
        } catch (err: any) {
            alert('Error saving event: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event? This will not delete the leads already captured.')) return;

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchEvents();
        } catch (err: any) {
            alert('Error deleting event: ' + err.message);
        }
    };

    const copyPassportLink = (slug: string) => {
        const link = `${window.location.origin}/passport?event=${slug}`;
        navigator.clipboard.writeText(link);
        alert('Event Passport link copied!');
    };

    if (loading) return <div className="p-10 text-neon-blue flex items-center gap-2"><Loader2 className="animate-spin" /> LOADING EVENTS...</div>;

    return (
        <div className="animate-in fade-in duration-700">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-4xl font-black mb-2 font-syncopate uppercase">EVENT <span className="text-[#ffde00]">HUB</span></h1>
                    <p className="text-white/50 font-medium">Create and manage multiple high-conversion event landing pages.</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => {
                            setEditingEvent({ title: '', description: '', date_text: '', time_text: '', address: '', slug: '', is_active: true });
                            setIsEditing(true);
                        }}
                        className="bg-[#ffde00] hover:bg-white text-black px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest transition flex items-center gap-2"
                    >
                        <Plus size={16} /> Create New Event
                    </button>
                )}
            </header>

            {isEditing ? (
                <div className="max-w-2xl bg-black border border-white/10 rounded-[2rem] p-8 animate-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-2xl font-bold mb-8 font-rajdhani uppercase tracking-wider">{editingEvent.id ? 'Edit Event' : 'Initialize New Event'}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Event Title</label>
                            <input
                                value={editingEvent.title}
                                onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })}
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ffde00]/50 transition"
                                placeholder="e.g. Spring Networking Expo"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Date</label>
                            <input
                                value={editingEvent.date_text}
                                onChange={e => setEditingEvent({ ...editingEvent, date_text: e.target.value })}
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ffde00]/50 transition"
                                placeholder="e.g. April 30, 2026"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Time</label>
                            <input
                                value={editingEvent.time_text}
                                onChange={e => setEditingEvent({ ...editingEvent, time_text: e.target.value })}
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ffde00]/50 transition"
                                placeholder="e.g. 5:00 PM"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Address / Location</label>
                            <input
                                value={editingEvent.address}
                                onChange={e => setEditingEvent({ ...editingEvent, address: e.target.value })}
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ffde00]/50 transition"
                                placeholder="Full address of the event venue"
                            />
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Description (Optional)</label>
                            <textarea
                                value={editingEvent.description}
                                onChange={e => setEditingEvent({ ...editingEvent, description: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[#ffde00]/50 transition min-h-[100px]"
                                placeholder="What is this event about?"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">URL Slug</label>
                            <input
                                value={editingEvent.slug}
                                onChange={e => setEditingEvent({ ...editingEvent, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white font-mono text-sm focus:outline-none focus:border-[#ffde00]/50 transition"
                                placeholder="spring-expo"
                            />
                        </div>

                        <div className="flex items-center gap-4 col-span-2 pt-4">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex-1 bg-[#ffde00] hover:bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-[0_0_30px_rgba(255,222,0,0.2)]"
                            >
                                {saving ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={18} /> SAVE EVENT ARCHITECTURE</>}
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-8 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl border border-white/10 transition"
                            >
                                CANCEL
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {events.length > 0 ? (
                        events.map(event => (
                            <div key={event.id} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-[#ffde00]/50 transition-all duration-300">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffde00]/5 blur-[40px] group-hover:bg-[#ffde00]/10 transition-all"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                            <Ticket className="text-[#ffde00]" size={24} />
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingEvent(event); setIsEditing(true); }} className="p-2 text-white/40 hover:text-white transition"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete(event.id)} className="p-2 text-white/40 hover:text-red-500 transition"><Trash2 size={18} /></button>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2 font-rajdhani">{event.title}</h3>
                                    
                                    <div className="space-y-2 mb-8">
                                        <div className="flex items-center gap-3 text-white/50 text-xs">
                                            <Calendar size={14} className="text-[#ffde00]" /> {event.date_text}
                                        </div>
                                        <div className="flex items-center gap-3 text-white/50 text-xs">
                                            <Clock size={14} className="text-[#ffde00]" /> {event.time_text}
                                        </div>
                                        <div className="flex items-center gap-3 text-white/50 text-xs text-wrap truncate">
                                            <MapPin size={14} className="text-[#ffde00]" /> {event.address}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => copyPassportLink(event.slug)}
                                            className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition"
                                        >
                                            <Copy size={16} /> Copy URL
                                        </button>
                                        <a 
                                            href={`/passport?event=${event.slug}`} 
                                            target="_blank"
                                            className="flex-1 py-4 bg-[#ffde00] hover:bg-white text-black font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(255,222,0,0.2)]"
                                        >
                                            <ExternalLink size={16} /> Open Form
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 bg-white/2 border-2 border-dashed border-white/10 rounded-[3rem] text-center">
                            <Calendar size={64} className="text-white/5 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-white/40 uppercase tracking-widest">No Events Mission-Ready</h3>
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="mt-6 text-[#ffde00] font-black uppercase tracking-tighter text-sm hover:underline"
                            >
                                + INITIALIZE YOUR FIRST EVENT PROFILE
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
