'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Check, Shield, Loader2, ArrowRight } from 'lucide-react';

const ActivationContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');
    const plan = searchParams.get('plan');
    const quantity = searchParams.get('quantity');

    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        address: '',
        city: '',
        zip: '',
        country: 'USA'
    });

    useEffect(() => {
        if (!sessionId) {
            // Optional: Redirect if no session, but for now let's just show a message or allow manual entry for testing
            // router.push('/pricing');
        }
    }, [sessionId]);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        // Explicit Validation Check
        const requiredFields = ['fullName', 'email', 'password', 'address', 'city', 'zip'];
        const missing = requiredFields.filter(f => !formData[f as keyof typeof formData]);

        if (missing.length > 0) {
            alert('Please fill out all required fields to activate your profile.');
            return;
        }

        setLoading(true);

        try {
            // 1. Create Supabase User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        shipping_address: `${formData.address}, ${formData.city}, ${formData.zip}, ${formData.country}`,
                        plan: plan || 'independent',
                        quantity: parseInt(quantity || '1'),
                        stripe_session_id: sessionId,
                        referrer: localStorage.getItem('tapos_referral_code') || null,
                        affiliate_referrer: localStorage.getItem('tapos_affiliate_code') || null
                    }
                }
            });

            if (authError) throw authError;

            // 2. We could auto-create a card here, but the standard flow might rely on the user logging in.
            // Let's assume on Sign Up success, we move to success step.
            setStep(2);

            // Auto-login logic (signInWithPassword) often needed if signUp doesn't auto-session (depends on email confirm)
            // But let's try to sign them in or prompt check email.
            // If email confirmation is off, they are logged in.

            // Allow a brief pause then redirect
            setTimeout(() => {
                router.push('/');
            }, 2000);

        } catch (err: any) {
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!sessionId) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4 font-syncopate">ACCESS DENIED</h1>
                    <p className="text-white/50 mb-6">No active payment session detected.</p>
                    <a href="/pricing" className="px-6 py-3 bg-white text-black rounded-lg font-bold">RETURN TO PRICING</a>
                </div>
            </div>
        );
    }

    if (step === 2) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
                <div className="text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_#22c55e]">
                        <Check size={40} className="text-black" />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 font-syncopate uppercase">SYSTEM UNLOCKED</h1>
                    <p className="text-white/50 mb-6 text-xl">Initializing your command center...</p>
                    <Loader2 className="animate-spin w-8 h-8 text-neon-blue mx-auto" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050510] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="fixed inset-0 bg-cyber-grid bg-[length:40px_40px] opacity-20 pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Payment Verified
                    </div>
                    <h1 className="text-3xl font-bold font-syncopate mb-2">ACTIVATE PROFILE</h1>
                    <p className="text-white/50">Enter delivery details to unlock your hardware.</p>
                </div>

                <form onSubmit={handleRegister} className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-white/40 mb-2 ml-1">Full Name</label>
                            <input
                                required
                                type="text"
                                placeholder="Javi Sanchez"
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-blue focus:outline-none transition"
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-white/40 mb-2 ml-1">Email Address</label>
                            <input
                                required
                                type="email"
                                placeholder="javi@example.com"
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-blue focus:outline-none transition"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase text-white/40 mb-2 ml-1">Create Password</label>
                            <input
                                required
                                type="password"
                                placeholder="••••••••"
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-blue focus:outline-none transition"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <label className="block text-xs font-bold uppercase text-white/40 mb-4 ml-1">One-Time Shipping Address</label>

                        <div className="space-y-4">
                            <input
                                required
                                type="text"
                                placeholder="Street Address"
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-blue focus:outline-none transition"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    required
                                    type="text"
                                    placeholder="City"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-blue focus:outline-none transition"
                                    value={formData.city}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                />
                                <input
                                    required
                                    type="text"
                                    placeholder="ZIP / Postal"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-neon-blue focus:outline-none transition"
                                    value={formData.zip}
                                    onChange={e => setFormData({ ...formData, zip: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !formData.fullName || !formData.email || !formData.password || !formData.address || !formData.city || !formData.zip}
                        className="w-full py-4 bg-neon-blue hover:bg-white text-black font-bold uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)] disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <>Unlock Access <ArrowRight size={18} /></>}
                    </button>

                </form>

                <p className="text-center text-xs text-white/30 mt-8">
                    By clicking Unlock, you agree to the TapOS <a href="/terms" className="underline hover:text-white">Terms of Service</a>.
                </p>
            </div>
        </div>
    );
}

export default function ActivationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="animate-spin text-neon-blue w-8 h-8" />
            </div>
        }>
            <ActivationContent />
        </Suspense>
    );
}
