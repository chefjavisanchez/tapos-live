'use client';

import { useState, Suspense } from 'react'; // Added Suspense for searchParams
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowRight, CreditCard, User, AlertTriangle, Loader2 } from 'lucide-react';

function CreateForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const referralCode = searchParams.get('ref'); // CAPTURE REFERRAL

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        title: '',
        slug: '',
        fullName: '',
        jobTitle: ''
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            // The basic data structure for the card
            const initialContent = {
                fullName: form.title,
                jobTitle: form.jobTitle,
                theme: 'neon-blue',
                referrer: referralCode || null, // SAVE REFERRER HERE

                // Default Placeholder Data (From Leyda Template)
                profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
                bio: "Digital innovator transforming how professionals connect.",
                email: user.email || "contact@example.com",
                phone: "+1 (555) 000-0000",
                website: "https://example.com",
                company: form.title,

                socials: [
                    { platform: "linkedin", url: "#" },
                    { platform: "instagram", url: "#" }
                ],

                features: [
                    { title: "Direct Contact", icon: "Phone" },
                    { title: "Portfolio", icon: "Briefcase" }
                ]
            };

            // CHECK UNIQUE SLUG
            const slugToCheck = form.slug.toLowerCase().replace(/\s+/g, '-');
            const { data: existing } = await supabase
                .from('cards')
                .select('id')
                .eq('slug', slugToCheck)
                .maybeSingle();

            if (existing) {
                throw new Error(`The ID "${slugToCheck}" is already taken. Please choose another.`);
            }

            const { data, error } = await supabase
                .from('cards')
                .insert([
                    {
                        user_id: user.id,
                        title: form.title,
                        slug: form.slug.toLowerCase().replace(/\s+/g, '-'),
                        content: initialContent
                    }
                ])
                .select()
                .single();

            if (error) throw error;

            // CHECK REFERRALS & TRIGGER REWARDS (Async)
            if (referralCode) {
                fetch('/api/referrals/check', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ referrer: referralCode })
                }).catch(err => console.error('Ref Check Failed', err));
            }

            // -----------------------------------------------------
            // TRIGGER GOHIGHLEVEL LEAD (Async - Fire & Forget)
            // -----------------------------------------------------
            fetch('/api/ghl/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cardId: data.id,
                    slug: form.slug,
                    email: user.email,
                    name: form.title, // User Name / Title
                    jobTitle: form.jobTitle,
                    phone: '' // Send empty to avoid overwriting real numbers in GHL with the placeholder
                })
            }).catch(err => console.error('GHL Lead Trigger Failed', err));
            // -----------------------------------------------------

            // Success! Go to dashboard
            alert("Card Authorized! Systems Online.");
            router.push(`/editor?id=${data.id}`);

        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black bg-cyber-grid p-8 text-white flex items-center justify-center">

            <div className="max-w-2xl w-full glass-panel border border-white/10 rounded-2xl p-8 relative overflow-hidden">

                {/* Header */}
                <div className="mb-8 border-b border-white/10 pb-6">
                    <div className="mb-4 flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 md:gap-3 text-center md:text-left">
                        <div className="p-3 bg-neon-blue/20 rounded-xl border border-neon-blue text-neon-blue">
                            <Sparkles size={24} />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-wider">CREATE DIGITAL PROFILE</h1>
                    </div>
                </div>

                <p className="text-white/50 mb-8">
                    Configure your public digital identity. This will be your unique URL.
                </p>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm font-bold flex items-center gap-2">
                        <AlertTriangle size={16} />
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* TITLE */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-neon-blue uppercase">Full Name or Business Name</label>
                        <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-neon-blue transition"
                                placeholder="e.g. Javi Sanchez"
                                required
                            />
                        </div>
                    </div>

                    {/* SLUG */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-neon-blue uppercase">Custom Link Handle</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-mono">tapos360.com/</span>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-36 pr-4 text-white focus:outline-none focus:border-neon-blue transition font-mono"
                                placeholder="your-name"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck="false"
                                required
                            />
                        </div>
                    </div>

                    {/* ROLE */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-neon-blue uppercase">Role / Title</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                            <input
                                type="text"
                                value={form.jobTitle} // Changed to form.jobTitle
                                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} // Changed to form.jobTitle
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-neon-blue transition"
                                placeholder="e.g. CEO & Founder"
                                required
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="w-full bg-neon-blue hover:bg-white text-black font-bold py-5 rounded-xl mt-8 flex items-center justify-center gap-2 transition hover:scale-[1.02] shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'CREATE PROFILE'} <ArrowRight size={20} />
                    </button>
                </div>

            </div> {/* Closing div for glass-panel */}
        </div>
    );
}

export default function CreateCardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
            <CreateForm />
        </Suspense>
    );
}
