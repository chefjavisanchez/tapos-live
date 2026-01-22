'use client';

import { Check, Shield, Zap, Users, Building2, BarChart3, ArrowRight, Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const router = useRouter();

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
                        CHOOSE YOUR <span className="text-neon-blue">PROTOCOL</span>
                    </h1>
                    <p className="text-xl text-white/60 leading-relaxed">
                        Whether you are a solo visionary or leading a high-performance team, TapOS delivers the infrastructure you need to dominate.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* INDEPENDENT PLAN */}
                    <div className="relative group rounded-[2.5rem] bg-black/40 border border-white/10 hover:border-neon-blue/50 overflow-hidden transition-all duration-300">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition duration-500">
                            <Zap className="w-24 h-24 text-neon-blue -rotate-12 transform translate-x-8 -translate-y-8" />
                        </div>

                        <div className="p-10 relative z-10 h-full flex flex-col">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold font-syncopate mb-2">INDEPENDENT</h3>
                                <p className="text-white/50 text-sm uppercase tracking-widest font-bold">For Solo Owners</p>
                            </div>

                            <div className="mb-10">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold font-rajdhani">$99</span>
                                    <span className="text-xl text-white/50 font-bold uppercase">/ Lifetime</span>
                                </div>
                                <p className="text-green-400 text-sm mt-3 font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    ONE-TIME PAYMENT
                                </p>
                            </div>

                            <div className="space-y-4 mb-10 flex-grow">
                                <FeatureItem text="Lifetime Digital Profile Access" />
                                <FeatureItem text="Physical PVC Card Hardware Kit" />
                                <FeatureItem text="AI Lead Scanner (CSV Export)" />
                                <FeatureItem text="Programmable Rewards (500 pts)" />
                                <FeatureItem text="TapOS Partner Rights (15% Comm)" />
                            </div>

                            <button
                                onClick={() => router.push('/login?view=sign_up&plan=independent')}
                                className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest rounded-xl hover:bg-neon-blue hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                            >
                                Activate Now
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
                                    <span className="text-xl text-white/50 font-bold uppercase">/ Setup</span>
                                </div>
                                <p className="text-purple-400 text-sm mt-3 font-bold">
                                    + Monthly License / User
                                </p>
                            </div>

                            <div className="space-y-4 mb-8 flex-grow">
                                <FeatureItem text="Master Dashboard Control" icon={<Shield size={16} className="text-purple-400" />} />
                                <FeatureItem text="Employee ID Management (/1, /2...)" />
                                <FeatureItem text="Corporate Branding on Hardware" />
                                <FeatureItem text="Team Analytics & Lead Tracking" />

                                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <p className="text-xs text-white/40 uppercase font-bold mb-3">Volume Licensing</p>
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
                            </div>

                            <button
                                onClick={() => router.push('/login?view=sign_up&plan=corporate')}
                                className="w-full py-4 bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:text-black hover:scale-[1.02] transition-all"
                            >
                                Start Corporate Setup
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
