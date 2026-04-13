'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Sparkles, ArrowRight, User, Mail, Phone, Ticket, Loader2, Calendar, Download, MapPin, AlertTriangle } from 'lucide-react';
import { generateCalendarLinks } from '@/lib/calendar';
import { EVENT_CONFIG } from '@/lib/event-config';

export default function PassportPage() {
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        company: ''
    });
    const [eventOwnerId, setEventOwnerId] = useState<string | null>(null);
    const [generatedSlug, setGeneratedSlug] = useState('');
    const [emailStatus, setEmailStatus] = useState('');
    const [currentEvent, setCurrentEvent] = useState<any>(null);

    useEffect(() => {
        const fetchEventAndHost = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const host = searchParams.get('host');
            const eventSlug = searchParams.get('event');

            if (host) setEventOwnerId(host);

            if (eventSlug) {
                try {
                    const { data, error: eventError } = await supabase
                        .from('events')
                        .select('*')
                        .eq('slug', eventSlug)
                        .single();

                    if (!eventError && data) {
                        setCurrentEvent(data);
                        // Assign the lead to the event creator if no explicit host was passed
                        if (!host && data.owner_id) {
                            setEventOwnerId(data.owner_id);
                        }
                    } else {
                        console.warn('Event not found, falling back to default config.');
                        // If slug provided but not found, we use fallback
                        setCurrentEvent({
                            title: EVENT_CONFIG.title,
                            date_text: EVENT_CONFIG.date,
                            time_text: EVENT_CONFIG.time,
                            address: EVENT_CONFIG.address,
                            description: EVENT_CONFIG.description
                        });
                    }
                } catch (err) {
                    console.error('Error fetching event:', err);
                }
            } else {
                // No slug provided, use default
                setCurrentEvent({
                    title: EVENT_CONFIG.title,
                    date_text: EVENT_CONFIG.date,
                    time_text: EVENT_CONFIG.time,
                    address: EVENT_CONFIG.address,
                    description: EVENT_CONFIG.description
                });
            }
            setPageLoading(false);
        };

        fetchEventAndHost();
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/passport/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...form, 
                    eventOwnerId, 
                    eventId: currentEvent?.id || null,
                    eventTitle: currentEvent?.title || EVENT_CONFIG.title,
                    eventDate: currentEvent?.date_text || EVENT_CONFIG.date
                })
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || 'Registration failed');

            setGeneratedSlug(result.slug);
            setEmailStatus(result.emailStatus);

            if (result.emailStatus.startsWith('error')) {
                console.error('📧 Email Diagnostic:', result.diagnostics);
            }

            setSuccess(true);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="animate-spin text-[#ffde00]" size={40} />
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <div className="w-full max-w-sm glass-panel border border-[#ffde00]/30 rounded-[2.5rem] p-8 relative overflow-hidden animate-in zoom-in-95 duration-500">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#ffde00] to-transparent"></div>

                    <div className="mb-8 flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-[#ffde00]/10 border border-[#ffde00] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(255,222,0,0.2)]">
                            <Ticket className="text-[#ffde00]" size={32} />
                        </div>
                        <h1 className="font-syncopate text-xl font-bold text-white uppercase tracking-tighter italic">PASSPORT ACTIVATED</h1>
                        <p className="text-[#ffde00] text-xs font-bold uppercase tracking-widest mt-2 px-3 py-1 bg-[#ffde00]/10 rounded-full">Official Guest</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl mb-8 shadow-[0_0_30px_rgba(255,255,255,0.1)] inline-block">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://tapos360.com/${generatedSlug}`}
                            alt="Your Passport QR"
                            className="w-48 h-48"
                        />
                    </div>

                    <div className="text-left space-y-4 mb-8">
                        <div>
                            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Event Location</p>
                            <p className="text-white font-rajdhani font-bold text-sm leading-tight">{currentEvent?.address}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Guest Name</p>
                            <p className="text-white font-rajdhani font-bold text-lg">{form.fullName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Email</p>
                                <p className="text-white/70 text-xs font-medium truncate">{form.email}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Phone</p>
                                <p className="text-white/70 text-xs font-medium">{form.phone || 'N/A'}</p>
                            </div>
                        </div>
                        {form.company && (
                            <div>
                                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Business</p>
                                <p className="text-white/70 text-xs font-medium">{form.company}</p>
                            </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-white/5">
                            <div>
                                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Raffle Status</p>
                                <p className="text-[#ffde00] font-bold">READY TO SCAN</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Raffle Number</p>
                                <p className="text-white/50 font-mono text-xs tracking-tighter uppercase">{generatedSlug.split('-')[1]}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-8">
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest text-center">Save Event to Calendar</p>
                        <div className="flex gap-2">
                            <a
                                href={generateCalendarLinks({
                                    title: currentEvent?.title,
                                    description: currentEvent?.description,
                                    location: currentEvent?.address,
                                    start: currentEvent?.id ? new Date() : EVENT_CONFIG.startDate, // Need better date handling for custom events
                                    end: currentEvent?.id ? new Date() : EVENT_CONFIG.endDate
                                }).googleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] uppercase font-bold transition"
                            >
                                <Calendar size={14} className="text-[#ffde00]" /> Google
                            </a>
                            <a
                                href={generateCalendarLinks({
                                    title: currentEvent?.title,
                                    description: currentEvent?.description,
                                    location: currentEvent?.address,
                                    start: currentEvent?.id ? new Date() : EVENT_CONFIG.startDate,
                                    end: currentEvent?.id ? new Date() : EVENT_CONFIG.endDate
                                }).icsDataUri}
                                download="event-passport.ics"
                                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] uppercase font-bold transition"
                            >
                                <Download size={14} className="text-[#ffde00]" /> iCal / Outlook
                            </a>
                        </div>
                    </div>

                    {emailStatus !== 'sent' && (
                        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-[10px] text-red-400 font-bold uppercase tracking-widest animate-pulse">
                            ⚠️ Email Issue: {emailStatus || 'Unknown Error'}
                        </div>
                    )}

                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 text-white/30 hover:text-white text-[10px] uppercase font-bold tracking-widest transition"
                    >
                        Register Another Guest
                    </button>
                </div>

                <p className="mt-8 text-white/20 text-[10px] uppercase tracking-[0.3em] font-medium">Sponsor Passport Experience &bull; TapOS 3.0</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black bg-cyber-grid p-6 text-white flex flex-col items-center justify-center">

            <div className="mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="p-2 bg-[#ffde00]/20 rounded-lg text-[#ffde00]">
                        <Ticket size={24} />
                    </div>
                    <h1 className="font-syncopate text-2xl font-bold tracking-tighter uppercase">TAP<span className="text-[#ffde00]">O</span>S PASS</h1>
                </div>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">{currentEvent?.title}</p>
                <p className="text-[#ffde00] text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{currentEvent?.date_text} • {currentEvent?.time_text}</p>
            </div>

            <div className="w-full max-w-md glass-panel border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">

                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                required
                                value={form.fullName}
                                onChange={e => setForm({ ...form, fullName: e.target.value })}
                                type="text"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#ffde00]/50 transition"
                                placeholder="e.g. Jane Foster"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    required
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    type="email"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#ffde00]/50 transition"
                                    placeholder="jane@expo.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Company</label>
                            <div className="relative">
                                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    required
                                    value={form.company}
                                    onChange={e => setForm({ ...form, company: e.target.value })}
                                    type="text"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#ffde00]/50 transition"
                                    placeholder="e.g. Acme Inc"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                            <input
                                required
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                                type="tel"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#ffde00]/50 transition"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <p className="text-[9px] text-white/20 text-center uppercase tracking-widest px-4 italic">
                        By registering, you agree to share your contact info with event sponsors to receive raffle alerts.
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#ffde00] hover:bg-white text-black font-black py-5 rounded-[1.5rem] mt-4 flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] shadow-[0_0_30px_rgba(255,222,0,0.2)] group"
                    >
                        {loading ? <Loader2 className="animate-spin text-black" /> : (
                            <>
                                GENERATE MY PASSPORT <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </>
                        )}
                    </button>
                </form>

                {error && <p className="mt-4 text-red-500 text-xs text-center font-bold">{error}</p>}
            </div>

            <div className="mt-12 flex items-center gap-4 opacity-30 group hover:opacity-100 transition-opacity">
                <div className="w-10 h-[1px] bg-white"></div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">TAPOS ID</p>
                <div className="w-10 h-[1px] bg-white"></div>
            </div>
        </div>
    );
}
