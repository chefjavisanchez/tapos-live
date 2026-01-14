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

            {/* 3D HERO MEGA CONTAINER */}
            <div id="tg-hero-mega-container" className="pt-20">
                <div className="tg-hero">
                    <div className="glow-circle"></div>

                    <div className="tg-hero-content animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <img src="/logo.png" alt="TapOS" className="h-24 mb-6 drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]" />
                        <h1 className="font-syncopate">THE NETWORKING GAME<br />HAS CHANGED. <span className="text-neon-blue">FOREVER.</span></h1>
                        <p>Stop wasting money on paper business cards that end up in the trash. Switch to TapOS Impulso. The last card you will ever need.</p>
                    </div>

                    <div className={`tg-visuals-container ${focusedPhone !== null ? 'has-focus' : ''}`} id="tg-phone-container">

                        {/* Phone 1 (Outermost Left) - Julio */}
                        <div
                            className={`phone-mockup phone-1 ${focusedPhone === 1 ? 'is-focused' : ''}`}
                            onClick={(e) => handlePhoneClick(1, e)}
                        >
                            <div className="phone-screen">
                                <img src="/mockup_julio.png" alt="Julio Aviles" className="mockup-img" />
                            </div>
                        </div>

                        {/* Phone 2 (Inner Left) - Sean */}
                        <div
                            className={`phone-mockup phone-2 ${focusedPhone === 2 ? 'is-focused' : ''}`}
                            onClick={(e) => handlePhoneClick(2, e)}
                        >
                            <div className="phone-screen">
                                <img src="/mockup_sean.png" alt="Sean Michael Flynn" className="mockup-img" />
                            </div>
                        </div>

                        {/* Phone 3 (Center) - Javi */}
                        <div
                            className={`phone-mockup phone-3 ${focusedPhone === 3 ? 'is-focused' : ''}`}
                            onClick={(e) => handlePhoneClick(3, e)}
                        >
                            <div className="phone-screen">
                                <img src="/mockup_javi.png" alt="Javi Sanchez" className="mockup-img" />
                            </div>
                        </div>

                        {/* Phone 4 (Inner Right) - Javier */}
                        <div
                            className={`phone-mockup phone-4 ${focusedPhone === 4 ? 'is-focused' : ''}`}
                            onClick={(e) => handlePhoneClick(4, e)}
                        >
                            <div className="phone-screen">
                                <img src="/mockup_javier.png" alt="Javier Pomales" className="mockup-img" />
                            </div>
                        </div>

                        {/* Phone 5 (Outer Right) - Leyda */}
                        <div
                            className={`phone-mockup phone-5 ${focusedPhone === 5 ? 'is-focused' : ''}`}
                            onClick={(e) => handlePhoneClick(5, e)}
                        >
                            <div className="phone-screen">
                                <img src="/mockup_leyda.png" alt="Leyda Sanchez" className="mockup-img" />
                            </div>
                        </div>

                    </div>

                    <div className="tg-cta-bottom z-40">
                        <a href="/login?view=sign_up" className="tg-btn-large">Get Your Tap & Go Today</a>
                    </div>

                </div>

                <style jsx>{`
                    /* --- SCOPED CSS --- */
                    #tg-hero-mega-container {
                    font-family: 'Poppins', sans-serif;
                    width: 100%;
                    overflow: hidden;
                    position: relative;
                    --primary-color: #6366f1;
                    }

                    #tg-hero-mega-container .tg-hero {
                    min-height: 90vh; 
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    padding: 40px 20px 60px;
                    position: relative;
                    }

                    #tg-hero-mega-container .tg-hero-content {
                    width: 100%;
                    max-width: 800px;
                    color: white;
                    z-index: 10;
                    text-align: center;
                    margin-bottom: 20px; 
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    }

                    #tg-hero-mega-container h1 {
                    font-size: 3.5rem;
                    line-height: 1.1;
                    margin-top: 0;
                    margin-bottom: 20px;
                    background: linear-gradient(to right, #fff, #94a3b8);
                    -webkit-background-clip: text;
                    color: white; 
                    font-weight: 700;
                    }

                    #tg-hero-mega-container p {
                    font-size: 1.1rem;
                    color: #94a3b8;
                    margin-bottom: 10px;
                    line-height: 1.6;
                    max-width: 600px;
                    }

                    #tg-hero-mega-container .tg-visuals-container {
                        width: 100%;
                        max-width: 1000px;
                        height: 450px; 
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        perspective: 1500px; 
                        position: relative;
                        margin-bottom: 40px;
                        transition: all 0.5s ease;
                        z-index: 20;
                    }

                    #tg-hero-mega-container .tg-visuals-container.has-focus .phone-mockup:not(.is-focused) {
                    opacity: 0.3;
                    filter: blur(3px) grayscale(0.8) !important;
                    pointer-events: none; 
                    }

                    #tg-hero-mega-container .phone-mockup {
                    width: 180px;
                    height: 360px;
                    background: #000;
                    border-radius: 35px;
                    border: 6px solid #1e293b;
                    position: absolute; 
                    overflow: hidden;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.6);
                    transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1); 
                    cursor: pointer;
                    top: 50%;
                    left: 50%;
                    margin-top: -180px; 
                    margin-left: -90px;
                    }

                    #tg-hero-mega-container .phone-mockup.is-focused {
                    transform: translate3d(0, 0, 100px) scale(1.3) rotateY(0deg) !important;
                    z-index: 100 !important;
                    filter: brightness(1.1) !important;
                    border-color: #00f3ff;
                    box-shadow: 0 50px 100px rgba(0,0,0,0.9), 0 0 40px rgba(0,243,255,0.3);
                    animation: none !important;
                    }

                    #tg-hero-mega-container .phone-mockup:hover:not(.is-focused) {
                        border-color: #94a3b8;
                        z-index: 25; 
                    }

                    #tg-hero-mega-container .phone-screen {
                    width: 100%;
                    height: 100%;
                    background: #000;
                    overflow: hidden;
                    border-radius: 28px;
                    pointer-events: none; 
                    }

                    #tg-hero-mega-container .mockup-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    }
                    
                    #tg-hero-mega-container .phone-3:not(.is-focused) {
                    z-index: 10;
                    transform: translateZ(100px) translateY(0);
                    animation: floatCenter 6s ease-in-out infinite;
                    }

                    #tg-hero-mega-container .phone-2:not(.is-focused) {
                    z-index: 8;
                    transform: translateX(-160px) translateZ(20px) rotateY(-20deg);
                    animation: floatLeftInner 6s ease-in-out infinite 0.3s;
                    }
                    #tg-hero-mega-container .phone-4:not(.is-focused) {
                    z-index: 8;
                    transform: translateX(160px) translateZ(20px) rotateY(20deg);
                    animation: floatRightInner 6s ease-in-out infinite 0.3s;
                    }

                    #tg-hero-mega-container .phone-1:not(.is-focused) {
                    z-index: 5;
                    transform: translateX(-300px) translateZ(-80px) rotateY(-35deg) scale(0.95);
                    animation: floatLeftOuter 6s ease-in-out infinite 0.6s;
                    filter: brightness(0.7); 
                    }
                    #tg-hero-mega-container .phone-5:not(.is-focused) {
                    z-index: 5;
                    transform: translateX(300px) translateZ(-80px) rotateY(35deg) scale(0.95);
                    animation: floatRightOuter 6s ease-in-out infinite 0.6s;
                    filter: brightness(0.7);
                    }

                    @keyframes floatCenter { 0%, 100% { margin-top: -180px; } 50% { margin-top: -200px; } }
                    @keyframes floatLeftInner { 0%, 100% { margin-top: -180px; } 50% { margin-top: -195px; } }
                    @keyframes floatRightInner { 0%, 100% { margin-top: -180px; } 50% { margin-top: -195px; } }
                    @keyframes floatLeftOuter { 0%, 100% { margin-top: -180px; } 50% { margin-top: -190px; } }
                    @keyframes floatRightOuter { 0%, 100% { margin-top: -180px; } 50% { margin-top: -190px; } }

                    #tg-hero-mega-container .tg-btn-large {
                        background: linear-gradient(135deg, #00f3ff, #0066ff);
                        color: black;
                        padding: 18px 45px;
                        text-decoration: none;
                        border-radius: 50px;
                        font-weight: 800;
                        font-size: 1.2rem;
                        display: inline-block;
                        box-shadow: 0 10px 30px rgba(0, 243, 255, 0.3);
                        transition: transform 0.3s ease, box-shadow 0.3s ease;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    #tg-hero-mega-container .tg-btn-large:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 20px 50px rgba(0, 243, 255, 0.5);
                        color: white;
                    }

                    #tg-hero-mega-container .glow-circle {
                    position: absolute;
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(0,243,255,0.05) 0%, rgba(0,0,0,0) 60%);
                    top: 40%; left: 50%; transform: translate(-50%, -50%);
                    z-index: 1; pointer-events: none;
                    }

                    @media (max-width: 900px) {
                        #tg-hero-mega-container h1 { font-size: 2.8rem; }
                        #tg-hero-mega-container .tg-visuals-container { transform: scale(0.8); }
                    }

                    @media (max-width: 600px) {
                    #tg-hero-mega-container h1 { font-size: 2rem; }
                    #tg-hero-mega-container .tg-visuals-container {
                        height: 350px;
                        transform: scale(0.65);
                        margin-top: -50px;
                    }
                    #tg-hero-mega-container .phone-2:not(.is-focused) { transform: translateX(-100px) translateZ(20px) rotateY(-20deg); }
                    #tg-hero-mega-container .phone-4:not(.is-focused) { transform: translateX(100px) translateZ(20px) rotateY(20deg); }
                    #tg-hero-mega-container .phone-1:not(.is-focused) { transform: translateX(-180px) translateZ(-80px) rotateY(-35deg) scale(0.95); }
                    #tg-hero-mega-container .phone-5:not(.is-focused) { transform: translateX(180px) translateZ(-80px) rotateY(35deg) scale(0.95); }
                    }
                `}</style>
            </div>

            {/* MARQUEE */}
            < div className="w-full bg-neon-blue text-black py-4 overflow-hidden flex font-syncopate font-bold text-xl tracking-widest whitespace-nowrap" >
                <div className="animate-marquee flex gap-12">
                    <span>NFC TECHNOLOGY</span> • <span>NO APP REQUIRED</span> • <span>WORKS ON IPHONE & ANDROID</span> • <span>ECO-FRIENDLY</span> • <span>INSTANT SHARING</span> •
                    <span>NFC TECHNOLOGY</span> • <span>NO APP REQUIRED</span> • <span>WORKS ON IPHONE & ANDROID</span> • <span>ECO-FRIENDLY</span> • <span>INSTANT SHARING</span> •
                </div>
            </div >

            {/* FEATURES GRID */}
            < section className="py-32 px-6 max-w-7xl mx-auto" >
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

            {/* INTERACTIVE DEMO CTA */}
            < section className="py-20 px-6" >
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

            {/* FOOTER */}
            < footer className="py-12 border-t border-white/5 text-center text-white/30 text-sm" >
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
