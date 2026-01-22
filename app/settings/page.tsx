'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Settings, Lock, CreditCard, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [card, setCard] = useState<any>(null);
    const [openaiKey, setOpenaiKey] = useState('');
    const [saving, setSaving] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [planType, setPlanType] = useState('independent');
    const router = useRouter();

    useEffect(() => {
        const checkAccess = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data } = await supabase
                .from('cards')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (data) {
                setCard(data);
                // Initialize Key
                if (data.content?.openai_api_key) {
                    setOpenaiKey(data.content.openai_api_key);
                }
            }

            // Plan & Admin Check
            setPlanType(user.user_metadata?.plan || 'independent');
            const email = user.email?.toLowerCase().trim() || '';
            if (['javi@tapygo.com', 'chefjavisanchez@gmail.com'].includes(email)) {
                setIsAdmin(true);
            }

            setLoading(false);
        };
        checkAccess();
    }, []);

    const saveSettings = async () => {
        setSaving(true);
        if (!card) return;

        // Update JSONB content
        const newContent = {
            ...card.content,
            openai_api_key: openaiKey.trim()
        };

        const { error } = await supabase
            .from('cards')
            .update({ content: newContent })
            .eq('id', card.id);

        if (error) {
            alert('Failed to save settings.');
        } else {
            alert('Settings Saved Successfully!');
            // Update local state
            setCard({ ...card, content: newContent });
        }
        setSaving(false);
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

    // LOCKED VIEW
    if (!card || card.content.subscription !== 'active') {
        return (
            <div className="min-h-screen bg-black bg-cyber-grid p-8 flex items-center justify-center">
                <div className="max-w-md w-full glass-panel border border-yellow-500/30 p-8 rounded-2xl text-center">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
                        <Lock className="text-yellow-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">ACCESS RESTRICTED</h2>
                    <p className="text-white/50 mb-6">Settings are reserved for Activated Members only.</p>
                    <a href="/" className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-bold transition">
                        Return to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    // ACTIVE VIEW
    return (
        <div className="flex min-h-screen bg-black bg-cyber-grid bg-[length:40px_40px]">
            <DashboardSidebar
                isAdmin={isAdmin}
                planType={planType}
                userCard={card}
            />

            <div className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-2xl mx-auto">

                    <Link href="/" className="inline-flex items-center text-white/50 hover:text-white mb-6 transition">
                        <ArrowLeft className="mr-2" size={16} /> Back to Dashboard
                    </Link>

                    <div className="mb-8 flex items-center gap-4">
                        <div className="p-3 bg-neon-blue/20 rounded-xl border border-neon-blue">
                            <Settings className="text-neon-blue" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-syncopate">SYSTEM SETTINGS</h1>
                            <p className="text-white/50">Manage global configurations.</p>
                        </div>
                    </div>

                    <div className="grid gap-6">

                        {/* SUBSCRIPTION CARD */}
                        <div className="glass-panel border border-white/10 rounded-2xl p-6 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                                    <CreditCard className="text-green-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Lifetime Membership</h3>
                                    <p className="text-xs text-white/50">Status: <span className="text-green-400 font-bold uppercase">Active</span></p>
                                </div>
                            </div>
                            <button disabled className="px-4 py-2 bg-white/5 border border-white/10 rounded text-xs text-white/30 uppercase cursor-not-allowed">
                                Paid on {new Date(card.created_at).toLocaleDateString()}
                            </button>
                        </div>

                        {/* SECURITY CARD */}
                        <div className="glass-panel border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20">
                                    <ShieldCheck className="text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Security & Privacy</h3>
                                    <p className="text-xs text-white/50">Your data is encrypted and secure.</p>
                                </div>
                            </div>
                            <div className="text-sm text-white/60 space-y-2 pl-16">
                                <p>• Advanced Encryption Standard (AES) Enabled</p>
                                <p>• Public Profile: <a href={`/${card.slug}`} target="_blank" className="text-neon-blue hover:underline">tapos360.com/{card.slug}</a></p>
                            </div>
                        </div>

                        {/* AI TOOLS CONFIGURATION */}
                        <div className="glass-panel border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-30 pointer-events-none">
                                <i className="ph-fill ph-brain text-6xl text-purple-500"></i>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/20">
                                    <i className="ph-bold ph-magic-wand text-purple-400 text-xl"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">AI Scanner Turbo Mode</h3>
                                    <p className="text-xs text-white/50">Enhance your Lead Scanner accuracy with GPT-4 Vision.</p>
                                </div>
                            </div>

                            <div className="pl-0 md:pl-16 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Your OpenAI API Key</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="password"
                                            placeholder="sk-..."
                                            value={openaiKey}
                                            onChange={(e) => setOpenaiKey(e.target.value)}
                                            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-purple-500 outline-none transition font-mono"
                                        />
                                        <button
                                            onClick={saveSettings}
                                            disabled={saving}
                                            className="px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider transition disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 className="animate-spin" size={16} /> : 'Save'}
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-white/30">
                                        Don't have one? <a href="https://platform.openai.com/api-keys" target="_blank" className="text-purple-400 hover:underline">Get an API Key here</a>.
                                        Key is stored securely and only used for your scans.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
