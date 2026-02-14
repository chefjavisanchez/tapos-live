'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Shield, Zap, Users, Building2, BarChart3, ArrowRight, Terminal } from 'lucide-react';

export default function PricingPage() {
    const router = useRouter();
    const [corporateQty, setCorporateQty] = useState<number | string>(5);
    const [loading, setLoading] = useState(false);

    const handleCheckout = async (plan: 'independent' | 'corporate') => {
        setLoading(true);
        const qtyRaw = plan === 'corporate' ? (typeof corporateQty === 'string' ? parseInt(corporateQty) || 0 : corporateQty) : 1;

        if (plan === 'corporate' && qtyRaw < 5) {
            alert('Corporate setup requires a minimum of 5 users.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan,
                    quantity: qtyRaw,
                    referralCode: localStorage.getItem('tapos_referral_code') || undefined
                })
            });

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Checkout failed');
            }
        } catch (err: any) {
            alert('Checkout Error: ' + err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050510] text-white font-sans overflow-x-hidden selection:bg-neon-blue selection:text-black">

            {/* BACKGROUND EFFECTS */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50"></div>
            <div className="fixed inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-20 pointer-events-none"></div>
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-neon-blue/10 to-transparent pointer-events-none"></div>

            {/* NAVIGATION */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050510]/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-neon-blue/20 neon-glow flex items-center justify-center border border-neon-blue/50">
                            <span className="text-neon-blue font-bold text-xl">T</span>
                        </div>
                        <span className="font-syncopate font-bold text-xl tracking-tighter">TAP<span className="text-neon-blue">OS</span></span>
                    </a>
                    <div className="flex items-center gap-4">
                        <a href="/" className="text-sm font-bold hover:text-white transition text-white/70">BACK TO HOME</a>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 container mx-auto">

                <div className="text-center mb-16 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <h1 className="text-4xl md:text-6xl font-black font-syncopate mb-6">
                        CHOOSE YOUR <span className="text-neon-blue">WEAPON</span>
                    </h1>
                    <p className="text-xl text-white/60 leading-relaxed">
                        Whether you are a solo operator or running a global fleet, we have the infrastructure you need to dominate.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* INDEPENDENT PLAN */}
                    <div className="relative group rounded-[2.5rem] bg-black border border-white/10 hover:border-neon-blue/50 overflow-hidden transition-all duration-300">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 blur-[80px]"></div>

                        <div className="p-10 relative z-10 h-full flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold font-syncopate mb-2">INDEPENDENT</h3>
                                <p className="text-white/50 text-sm uppercase tracking-widest font-bold">For Solo Operators</p>
                            </div>

                            <div className="mb-10">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold font-rajdhani">$109.99</span>
                                </div>
                                <p className="text-neon-blue text-sm mt-3 font-bold">
                                    LIFETIME ACCESS (Includes Shipping)
                                </p>
                            </div>

                            <div className="space-y-4 mb-8 flex-grow">
                                <FeatureItem text="Physical PVC Card Included" />
                                <FeatureItem text="TapOS Cloud Dashboard" />
                                <FeatureItem text="AI Lead Scanner (Unlimited)" />
                                <FeatureItem text="Programmable Actions & Rewards" />
                                <FeatureItem text="Partner Rights (Resell & Earn)" />
                                <FeatureItem text="Quick-Start Guide: Pre-Register Profile, Lead Capture & YouTube Setup" />
                            </div>

                            <button
                                onClick={() => handleCheckout('independent')}
                                disabled={loading}
                                className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-neon-blue hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Activate Now'}
                            </button>
                        </div>
                    </div>

                    {/* CORPORATE PLAN */}
                    <div className="relative group rounded-[2.5rem] bg-gradient-to-b from-[#0A0A15] to-black border border-white/10 hover:border-purple-500/50 overflow-hidden transition-all duration-300">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[80px]"></div>

                        <div className="p-10 relative z-10 h-full flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold font-syncopate mb-2">CORPORATE</h3>
                                <p className="text-white/50 text-sm uppercase tracking-widest font-bold">For Teams & Scale</p>
                            </div>

                            <div className="mb-10">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold font-rajdhani">$75</span>
                                    <span className="text-xl text-white/50 font-bold uppercase">/ User</span>
                                </div>
                                <p className="text-purple-400 text-sm mt-3 font-bold">
                                    + Monthly License & Shipping
                                </p>
                            </div>

                            <div className="space-y-4 mb-8 flex-grow">
                                <FeatureItem text="Master Dashboard Control" icon={<Shield size={16} className="text-purple-400" />} />
                                <FeatureItem text="Employee ID Management (/1, /2...)" />
                                <FeatureItem text="Corporate Branding on Hardware" />
                                <FeatureItem text="Team Analytics & Lead Tracking" />

                                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-xs text-white/40 uppercase font-bold mb-3">Volume Licensing (Monthly)</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-white/70">
                                            <span>5 - 20 Users</span>
                                            <span className="text-white font-bold">$10 / mo</span>
                                        </div>
                                        <div className="flex justify-between text-white/70">
                                            <span>21 - 100 Users</span>
                                            <span className="text-white font-bold">$8 / mo</span>
                                        </div>
                                        <div className="flex justify-between text-white/70">
                                            <span>101+ Users</span>
                                            <span className="text-white font-bold">$6 / mo</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity Selector */}
                                <div className="bg-black/40 p-4 rounded-xl border border-white/10 group-hover:border-purple-500/30 transition-colors">
                                    <label className="text-[10px] text-white/40 uppercase font-black tracking-widest block mb-4">Quantity: Number of Operators</label>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-1">
                                            <button
                                                onClick={() => setCorporateQty(prev => Math.max(1, (typeof prev === 'string' ? parseInt(prev) || 0 : prev) - 1))}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-md transition-colors text-white/60 hover:text-white"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={corporateQty}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === '') {
                                                        setCorporateQty('');
                                                    } else {
                                                        setCorporateQty(parseInt(val));
                                                    }
                                                }}
                                                className="w-16 bg-transparent text-center text-white font-rajdhani font-bold text-2xl focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                            <button
                                                onClick={() => setCorporateQty(prev => (typeof prev === 'string' ? parseInt(prev) || 0 : prev) + 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-md transition-colors text-white/60 hover:text-white"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-[10px] text-white/40 uppercase font-black tracking-widest">Total First Payment</div>
                                            <div className="text-2xl font-bold text-purple-400 font-rajdhani">
                                                {/* Fixed $75 Setup + Shipping + Tiered License */}
                                                ${(() => {
                                                    const qty = typeof corporateQty === 'string' ? parseInt(corporateQty) || 0 : corporateQty;
                                                    return (
                                                        (75 * qty) +
                                                        (qty === 0 ? 0 : (qty >= 21 ? (qty > 100 ? 59.99 : 39.99) : 19.99)) +
                                                        ((qty <= 20 ? 10 : qty <= 100 ? 8 : 6) * qty)
                                                    ).toLocaleString(undefined, { minimumFractionDigits: 2 });
                                                })()}
                                            </div>
                                            <div className="text-[10px] text-white/30 truncate max-w-[140px]">
                                                {typeof corporateQty === 'number' && corporateQty < 5 ?
                                                    <span className="text-amber-500 font-bold">Min 5 required</span> :
                                                    '$75/ea Setup + License'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleCheckout('corporate')}
                                disabled={loading}
                                className="w-full py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-black hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Start Corporate Setup'}
                            </button>
                        </div>
                    </div>

                </div>

                <div className="mt-20 text-center">
                    <p className="text-white/40 text-sm mb-4">NEED ENTERPRISE IMPLEMENTATION?</p>
                    <a href="mailto:javi@tapygo.com" className="inline-flex items-center gap-2 text-neon-blue hover:text-white transition font-bold uppercase tracking-widest text-sm">
                        Contact Sales Team <ArrowRight size={16} />
                    </a>
                </div>

            </main>
        </div>
    );
}

function FeatureItem({ text, icon }: { text: string, icon?: any }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
                {icon || <Check size={16} className="text-neon-blue" />}
            </div>
            <span className="text-white/80 font-medium">{text}</span>
        </div>
    )
}
