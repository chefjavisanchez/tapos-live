'use client';

import { Rocket, Zap, Shield, Globe, ArrowRight, Share2, Trees, smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-neon-blue selection:text-black font-sans">

            {/* BACKGROUND EFFECTS */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50"></div>
            <div className="fixed inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-20 pointer-events-none"></div>
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-neon-blue/10 to-transparent pointer-events-none"></div>

            {/* NAVBAR */}
            <nav className="fixed top-0 w-full z-40 backdrop-blur-md border-b border-white/5 bg-black/50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* LOGO PLACEHOLDER */}
                        <div className="text-2xl font-bold font-syncopate tracking-tighter">
                            TAP<span className="text-neon-blue drop-shadow-[0_0_10px_rgba(0,243,255,0.8)]">OS</span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/login')}
                            className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/10 transition font-medium text-sm tracking-wide"
                        >
                            LOGIN
                        </button>
                        <button
                            onClick={() => router.push('/login?view=sign_up')}
                            className="px-6 py-2 rounded-full bg-neon-blue text-black font-bold text-sm tracking-wide hover:scale-105 transition shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                        >
                            GET IMPULSO
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative pt-40 pb-32 px-6 flex flex-col items-center text-center">

                {/* FLOATING ELEMENTS */}
                <div className="absolute top-40 left-10 md:left-40 w-32 h-32 bg-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-20 right-10 md:right-40 w-64 h-64 bg-neon-blue/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                    <span className="text-xs font-mono uppercase tracking-widest text-white/70">System Online v2.0</span>
                </div>

                {/* LOGO IMAGE (User to replace src) */}
                <div className="mb-12 relative group animate-in zoom-in duration-1000">
                    <div className="absolute inset-0 bg-neon-blue/20 blur-[60px] group-hover:bg-neon-blue/30 transition-all duration-500"></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/logo.png" // User uploaded logo
                        alt="TapOS Impulso"
                        className="h-24 md:h-32 relative z-10 drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<h1 class="text-6xl md:text-8xl font-black font-syncopate tracking-tighter flex items-center justify-center gap-4">TAP<span class="text-neon-blue">OS</span> <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400 font-cookie">Impulso</span></h1>';
                        }}
                    />
                </div>

                <h1 className="max-w-4xl text-5xl md:text-7xl font-bold font-syncopate leading-tight mb-8 tracking-tighter">
                    THE NETWORKING GAME<br />
                    HAS CHANGED. <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-purple-500 animate-pulse">FOREVER.</span>
                </h1>

                <p className="max-w-2xl text-lg md:text-xl text-white/50 mb-12 leading-relaxed">
                    Stop wasting money on paper business cards that end up in the trash.
                    Switch to <strong className="text-white">TapOS Impulso</strong>. The last card you will ever need.
                    Share contact info, payments, and socials with a single tap.
                </p>

                <div className="flex flex-col md:flex-row gap-6 w-full max-w-md md:max-w-none justify-center">
                    <button onClick={() => router.push('/login')} className="group relative px-8 py-4 bg-neon-blue text-black font-black text-lg uppercase tracking-wider rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,243,255,0.6)]">
                        <div className="absolute inset-0 bg-white/40 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative flex items-center gap-2">
                            Get Your Card <Rocket size={20} />
                        </span>
                    </button>
                    <button onClick={() => router.push('/login')} className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-lg uppercase tracking-wider rounded-xl hover:bg-white/10 transition flex items-center justify-center gap-2">
                        Access Dashboard
                    </button>
                </div>
            </section>

            {/* MARQUEE */}
            <div className="w-full bg-neon-blue text-black py-4 overflow-hidden flex font-syncopate font-bold text-xl tracking-widest whitespace-nowrap">
                <div className="animate-marquee flex gap-12">
                    <span>NFC TECHNOLOGY</span> • <span>NO APP REQUIRED</span> • <span>WORKS ON IPHONE & ANDROID</span> • <span>ECO-FRIENDLY</span> • <span>INSTANT SHARING</span> •
                    <span>NFC TECHNOLOGY</span> • <span>NO APP REQUIRED</span> • <span>WORKS ON IPHONE & ANDROID</span> • <span>ECO-FRIENDLY</span> • <span>INSTANT SHARING</span> •
                </div>
            </div>

            {/* FEATURES GRID */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold font-syncopate text-center mb-20">
                    WHY <span className="text-neon-blue">UPGRADE?</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-neon-blue/50 hover:bg-white/10 transition duration-500 group">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <Trees className="text-green-400 w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Save Money & Trees</h3>
                        <p className="text-white/50 leading-relaxed">
                            A traditional professional spends ~$200/year on paper cards. TapOS is a one-time purchase that lasts a lifetime. Plus, you save forests.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-white/10 transition duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px]"></div>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <Zap className="text-purple-400 w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Instant Impact</h3>
                        <p className="text-white/50 leading-relaxed">
                            No more typing numbers. Just tap your card to their phone and your info saves instantly. It's magic that wins clients.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition duration-500 group">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-yellow-500/5 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <Shield className="text-orange-400 w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">God Mode Control</h3>
                        <p className="text-white/50 leading-relaxed">
                            Update your details anytime from your dashboard. Your card is never outdated. Changed jobs? New phone? Update it in seconds.
                        </p>
                    </div>
                </div>
            </section>

            {/* INTERACTIVE DEMO CTA */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-b from-gray-900 to-black border border-white/10 p-12 md:p-24 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-neon-blue/5 blur-[100px]"></div>

                    <h2 className="relative text-4xl md:text-6xl font-black font-syncopate mb-8 tracking-tighter">
                        READY TO <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white">LAUNCH?</span>
                    </h2>

                    <p className="relative text-xl text-white/60 mb-12 max-w-2xl mx-auto">
                        Join thousands of professionals who have already upgraded their networking game.
                    </p>

                    <button
                        onClick={() => router.push('/login')}
                        className="relative z-10 px-12 py-6 bg-white text-black font-black text-xl rounded-full hover:scale-105 transition duration-300 shadow-[0_10px_40px_rgba(255,255,255,0.2)]"
                    >
                        START NOW
                    </button>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 border-t border-white/5 text-center text-white/30 text-sm">
                <p className="text-white/30">Copyright &copy; 2026 TapOS Impulsó. All Rights Reserved.</p>
            </footer>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
             `}</style>
        </div>
    );
}
