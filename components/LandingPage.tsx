'use client';

import { useState, useEffect } from 'react';
import { Rocket, Zap, Shield, Globe, ArrowRight, Share2, Trees, Smartphone } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
    const router = useRouter();
    const [focusedPhone, setFocusedPhone] = useState<number | null>(null);

    // Close focus when clicking background
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const container = document.getElementById('tg-hero-mega-container');
            // If click is outside the phones (but inside the hero), reset focus
            // The container itself triggers this, so we check if the target is NOT a phone
            if (focusedPhone !== null && !(e.target as Element).closest('.phone-mockup')) {
                setFocusedPhone(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [focusedPhone]);

    const handlePhoneClick = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (focusedPhone === index) {
            setFocusedPhone(null);
        } else {
            setFocusedPhone(index);
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
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-neon-blue/20 neon-glow flex items-center justify-center border border-neon-blue/50">
                            <span className="text-neon-blue font-bold text-xl">T</span>
                        </div>
                        <span className="font-syncopate font-bold text-xl tracking-tighter">TAP<span className="text-neon-blue">OS</span></span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                        <a href="#features" className="hover:text-neon-blue transition">Features</a>
                        <a href="#demo" className="hover:text-neon-blue transition">Live Demo</a>
                        <a href="#pricing" className="hover:text-neon-blue transition">Pricing</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/login" className="text-sm font-bold hover:text-white transition text-white/70">LOGIN</a>
                        <a href="/login?view=sign_up" className="bg-neon-blue hover:bg-white text-black px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                            GET IMPULSO
                        </a>
                    </div>
                </div>
            </nav>

                        <span className="relative flex items-center gap-2">
                            Get Your Card <Rocket size={20} />
                        </span>
                    </button>
                    <button onClick={() => router.push('/login')} className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold text-lg uppercase tracking-wider rounded-xl hover:bg-white/10 transition flex items-center justify-center gap-2">
                        Access Dashboard
                    </button>
                </div >
            </section >

        {/* MARQUEE */ }
        < div className = "w-full bg-neon-blue text-black py-4 overflow-hidden flex font-syncopate font-bold text-xl tracking-widest whitespace-nowrap" >
            <div className="animate-marquee flex gap-12">
                <span>NFC TECHNOLOGY</span> • <span>NO APP REQUIRED</span> • <span>WORKS ON IPHONE & ANDROID</span> • <span>ECO-FRIENDLY</span> • <span>INSTANT SHARING</span> •
                <span>NFC TECHNOLOGY</span> • <span>NO APP REQUIRED</span> • <span>WORKS ON IPHONE & ANDROID</span> • <span>ECO-FRIENDLY</span> • <span>INSTANT SHARING</span> •
            </div>
            </div >

        {/* FEATURES GRID */ }
        < section className = "py-32 px-6 max-w-7xl mx-auto" >
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
            </section >

        {/* INTERACTIVE DEMO CTA */ }
        < section className = "py-20 px-6" >
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
            </section >

        {/* FOOTER */ }
        < footer className = "py-12 border-t border-white/5 text-center text-white/30 text-sm" >
            <p className="text-white/30">Copyright &copy; 2026 TapOS Impulsó. All Rights Reserved.</p>
            </footer >

        <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
             `}</style>
        </div >
    );
}
