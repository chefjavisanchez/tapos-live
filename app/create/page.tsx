'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, CreditCard, User } from 'lucide-react';

export default function CreateCardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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
                fullName: form.fullName,
                jobTitle: form.jobTitle,
                theme: 'neon-blue',

                // Default Placeholder Data (From Leyda Template)
                profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
                bio: "Digital innovator transforming how professionals connect.",
                email: "contact@example.com",
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

            // Success! Go to dashboard (or later, the editor)
            alert("Card Authorized! Systems Online.");
            router.push('/');

        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black bg-cyber-grid p-8 text-white flex items-center justify-center">

            <div className="max-w-2xl w-full glass-panel border border-white/10 rounded-2xl p-8 relative overflow-hidden">

                {/* Header */}
                <div className="mb-8 border-b border-white/10 pb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-neon-blue/20 rounded-lg border border-neon-blue">
                            <Sparkles className="text-neon-blue" size={24} />
                        </div>
                        <h1 className="text-2xl font-bold font-syncopate">INITIATE NEW CARD</h1>
                    </div>
                    <p className="text-white/50">Configure the core parameters for your digital identity.</p>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Project Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neon-blue uppercase tracking-wider">Project / Business Name</label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue transition"
                                    placeholder="e.g. TapOS Main"
                                    required
                                />
                            </div>
                        </div>

                        {/* Custom URL Slug */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neon-blue uppercase tracking-wider">Secure Link ID</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-white/30 text-sm">tapos.com/</span>
                                <input
                                    type="text"
                                    value={form.slug}
                                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-24 pr-4 text-white focus:outline-none focus:border-neon-blue transition"
                                    placeholder="your-name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Personal Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neon-blue uppercase tracking-wider">Agent Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                                <input
                                    type="text"
                                    value={form.fullName}
                                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue transition"
                                    placeholder="e.g. Javi Sanchez"
                                    required
                                />
                            </div>
                        </div>

                        {/* Job Title */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neon-blue uppercase tracking-wider">Role / Title</label>
                            <input
                                type="text"
                                value={form.jobTitle}
                                onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-neon-blue transition"
                                placeholder="e.g. CEO & Founder"
                                required
                            />
                        </div>

                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-neon-blue hover:bg-white text-black font-bold py-4 rounded-lg uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                        >
                            {loading ? 'Initializing System...' : 'Launch Card Protocol'}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}
