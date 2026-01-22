'use client';

import { useState, useEffect } from 'react';
import { Rocket, Zap, Shield, Globe, ArrowRight, Share2, Trees, Smartphone, ScanEye, Tv, MessageSquareText, Video, LayoutGrid, Users, BarChart3, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import NetworkingOS from './NetworkingOS';


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
                        <img src="/logo.png" alt="TapOS" className="h-10 w-auto" />
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                        <a href="#features" className="hover:text-neon-blue transition">Features</a>
                        <a href="#benefits" className="hover:text-neon-blue transition">Benefits</a>
                        <a href="#faq" className="hover:text-neon-blue transition">FAQ</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/login" className="text-sm font-bold hover:text-white transition text-white/70">LOGIN</a>
                        <a href="/pricing" className="bg-neon-blue hover:bg-white text-black px-5 py-2 rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
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
                        <div className="flex flex-col items-center mb-6">
                            <img src="/logo.png" alt="TapOS" className="h-32 md:h-48 w-auto drop-shadow-[0_0_30px_rgba(0,243,255,0.3)]" />
                        </div>
                        <h1 className="font-syncopate">THE NETWORKING GAME<br />HAS CHANGED. <span className="text-neon-blue">FOREVER.</span></h1>
                        <p>Stop wasting money on paper business cards that end up in the trash. Switch to Impulsó. The last card you will ever need.</p>
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
                        <a href="/pricing" className="tg-btn-large">GET IMPULSÓ</a>
                    </div>

                </div>
            </div>

            {/* MARQUEE */}
            <div className="w-full bg-neon-blue text-black py-4 overflow-hidden flex font-syncopate font-bold text-xl tracking-widest whitespace-nowrap">
                <div className="animate-marquee flex gap-12">
                    <span>NFC TECHNOLOGY</span> • <span>NO APP REQUIRED</span> • <span>WORKS ON IPHONE & ANDROID</span> • <span>ECO-FRIENDLY</span> • <span>INSTANT SHARING</span> •
                    <span>NFC TECHNOLOGY</span> • <span>NO APP REQUIRED</span> • <span>WORKS ON IPHONE & ANDROID</span> • <span>ECO-FRIENDLY</span> • <span>INSTANT SHARING</span> •
                </div>
            </div >

            {/* NEW CORE VALUES & FEATURES SECTION */}
            <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
                <div id="benefits" className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* COLUMN 1: CORE VALUE PROPS */}
                    <div className="space-y-12">
                        <h2 className="text-3xl md:text-5xl font-bold font-syncopate">
                            WHY <span className="text-neon-blue">UPGRADE?</span>
                        </h2>

                        <div className="space-y-10">
                            {/* Feature 1 */}
                            <div className="flex gap-6 group">
                                <div className="mt-1 w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                                    <Trees className="text-green-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-3 text-white">Save Money & Trees</h3>
                                    <p className="text-white/50 leading-relaxed">
                                        A traditional professional spends ~$200/year on paper cards. TapOS is a one-time purchase that lasts a lifetime.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex gap-6 group">
                                <div className="mt-1 w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                                    <Zap className="text-purple-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-3 text-white">Instant Impact</h3>
                                    <p className="text-white/50 leading-relaxed">
                                        No more typing numbers. Just tap your card to their phone and your info saves instantly. It’s magic that wins clients.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex gap-6 group">
                                <div className="mt-1 w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                                    <Shield className="text-orange-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-3 text-white">God Mode Control</h3>
                                    <p className="text-white/50 leading-relaxed">
                                        Update your details anytime from your dashboard. Your card is never outdated. Changed jobs? New phone? Update it in seconds.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 2: EXCLUSIVE FEATURES */}
                    <div className="p-8 md:p-10 rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-white/20 transition duration-500">
                        <div className="mb-10">
                            <h3 className="text-2xl font-bold mb-2">More Than a Card.</h3>
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white mb-6">
                                It’s a Conversion Engine.
                            </h3>
                        </div>

                        <div className="space-y-8">

                            <FeatureRow
                                icon={<ScanEye className="text-neon-blue" size={20} />}
                                title="AI Lead Scanner"
                                text="Stop manually entering data. Capture any paper business card with our AI Optical Recognition and export it directly to a CSV spreadsheet."
                            />

                            <FeatureRow
                                icon={<Tv className="text-neon-blue" size={20} />}
                                title="Dynamic Ad Slots"
                                text="Monetize your profile with 5 customizable ad spaces. Showcase your logo, flyers, or text-based promotions to everyone you meet."
                            />

                            <FeatureRow
                                icon={<MessageSquareText className="text-neon-blue" size={20} />}
                                title="Marquee Text Engine"
                                text="Run a scrolling live ticker across your profile to announce your latest launch or a limited-time offer."
                            />

                            <FeatureRow
                                icon={<Video className="text-neon-blue" size={20} />}
                                title="Video Business Card"
                                text="Embed your YouTube videos directly into your profile so prospects can see your work and hear your story instantly."
                            />

                            <FeatureRow
                                icon={<LayoutGrid className="text-neon-blue" size={20} />}
                                title="Social Impulsó Grid"
                                text="Fast-connect buttons for WhatsApp, Instagram, LinkedIn, and custom web links—all in one place."
                            />

                        </div>
                    </div>

                </div>
            </section>

            {/* CORPORATE ADVANTAGE SECTION */}
            <section className="py-24 px-6 max-w-7xl mx-auto bg-[#0A0A15] border-y border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-neon-blue/5 blur-[120px] pointer-events-none"></div>

                <div className="relative z-10 text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold font-syncopate mb-4">
                        The Corporate <span className="text-neon-blue">Advantage</span>
                    </h2>
                    <p className="text-white/50 text-xl tracking-wide uppercase font-bold text-sm">(B2B Strategy)</p>
                    <p className="text-white/60 mt-4 max-w-2xl mx-auto">Infrastructure for High-Performance Teams</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">

                    {/* Feature 1 */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition group text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <Users className="text-blue-400 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Reusable Assets</h3>
                        <p className="text-white/60 text-base leading-relaxed">
                            Manage your entire sales force with unique /ID licenses. If an employee leaves, simply reassign the /1, /2, or /3 ID to the new hire. The hardware stays; the data is yours.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition group text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-teal-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <BarChart3 className="text-teal-400 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">The Master Dashboard</h3>
                        <p className="text-white/60 text-base leading-relaxed">
                            Track every tap. See exactly which team members are generating the most leads and how many prospects are downloading your contact info in real-time.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition group text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition">
                            <Building2 className="text-indigo-400 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Corporate Branding</h3>
                        <p className="text-white/60 text-base leading-relaxed">
                            Every card features your company logo and the Impulso watermark—projecting authority and innovation.
                        </p>
                    </div>

                </div>
            </section>

            {/* AI ASSISTANT */}
            <NetworkingOS />

            {/* FAQ SECTION */}
            <section id="faq" className="py-24 px-6 max-w-4xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black font-syncopate text-center mb-16">
                    FREQUENTLY <br />
                    <span className="text-neon-blue">QUESTIONS</span>
                </h2>

                <div className="space-y-6">
                    <FAQItem
                        question="How does Impulso work?"
                        answer="Impulso uses NFC (Near Field Communication) technology to share your digital profile. Just tap your Impulso card to any modern smartphone, and your contact info, social links, and media will instantly appear — no app required."
                    />
                    <FAQItem
                        question="Does the other person need an app?"
                        answer="No! That's the magic. The receiver doesn't need to download anything. It works natively on most iPhones and Android devices just like Apple Pay or Google Pay."
                    />
                    <FAQItem
                        question="Can I update my information later?"
                        answer="Yes, absolutely. You have 'God Mode' control over your data. Update your phone number, social links, or even your company logo at any time from your private dashboard, and your card stays updated instantly."
                    />
                    <FAQItem
                        question="Is my data secure?"
                        answer="Security is our priority. We use advanced encryption to protect your data, and you have full control over what information you choose to share publicly."
                    />
                    <FAQItem
                        question="What if I lose my card?"
                        answer="If you lose your card, you can instantly 'Freeze' your profile from your dashboard so no one can access it. You can then order a replacement card and link it to your existing account."
                    />
                </div>
            </section>



            {/* INTERACTIVE DEMO CTA */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto rounded-[4rem] bg-gradient-to-br from-gray-900 to-[#050510] border border-neon-blue/20 p-12 md:p-24 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-neon-blue/10 blur-[120px] group-hover:bg-neon-blue/20 transition-all duration-1000"></div>

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-neon-blue/10 border border-neon-blue/20 px-4 py-2 rounded-full text-neon-blue text-xs font-black tracking-widest uppercase mb-8">
                            <Rocket size={14} className="animate-bounce" /> Destination: Success
                        </div>

                        <h2 className="text-5xl md:text-8xl font-black font-syncopate mb-8 tracking-tighter leading-none">
                            READY FOR <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-blue bg-[length:200%_auto] animate-gradient">LIFTOFF?</span>
                        </h2>

                        <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Stop handing out trash. Start building your digital empire with the world's most advanced networking operating system.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <button
                                onClick={() => router.push('/pricing')}
                                className="px-12 py-6 bg-neon-blue text-black font-black text-xl rounded-full hover:scale-110 transition duration-500 shadow-[0_0_30px_rgba(0,243,255,0.5)] group"
                            >
                                <span className="flex items-center gap-3 italic">
                                    INITIATE IMPULSO <ArrowRight className="group-hover:translate-x-2 transition" />
                                </span>
                            </button>
                            <p className="text-white/30 text-xs font-bold uppercase tracking-tighter">
                                Lifetime Access • No Monthly Fees • 2-Day Shipping
                            </p>
                        </div>
                    </div>

                    {/* DECORATIVE ELEMENTS */}
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-neon-blue/10 rounded-full blur-3xl"></div>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-20 border-t border-white/5 bg-[#030308]">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="TapOS" className="h-10 w-auto opacity-50 hover:opacity-100 transition" />
                        </div>
                        <p className="text-white/30 text-sm max-w-xs text-center md:text-left">
                            The world's first AI-powered networking operating system.
                            Beyond business cards. Beyond expectations.
                        </p>

                        <div className="flex flex-wrap justify-center gap-12 text-sm font-bold uppercase tracking-widest text-white/50">
                            <a href="#features" className="hover:text-neon-blue transition">Features</a>
                            <a href="#benefits" className="hover:text-neon-blue transition">Benefits</a>
                            <a href="#faq" className="hover:text-neon-blue transition">FAQ</a>
                            <a href="/login" className="hover:text-neon-blue transition">Dashboard</a>
                        </div>
                    </div>

                    <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/20">
                        <p>© 2026 IMPULSO TECHNOLOGY GROUP. ALL RIGHTS RESERVED.</p>
                        <div className="flex gap-8">
                            <a href="#" className="hover:text-white transition">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition">Terms of Service</a>
                            <a href="mailto:javi@tapygo.com" className="hover:text-white transition">Support</a>
                        </div>
                    </div>
                </div>
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
        </div >
    );
}

function FeatureRow({ icon, title, text }: { icon: any, title: string, text: string }) {
    return (
        <div className="flex gap-4 items-start group">
            <div className="mt-1 w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-neon-blue/10 group-hover:border-neon-blue/30 transition">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-white mb-1 group-hover:text-neon-blue transition">{title}</h4>
                <p className="text-sm text-white/50 leading-relaxed">{text}</p>
            </div>
        </div>
    )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 hover:border-neon-blue/30 transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-6 text-left flex justify-between items-center gap-4"
            >
                <span className="font-bold text-lg md:text-xl text-white group-hover:text-neon-blue transition">{question}</span>
                <div className={`shrink-0 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-neon-blue border-neon-blue text-black' : 'text-white'}`}>
                    <Rocket size={14} className={isOpen ? '' : 'rotate-180'} />
                </div>
            </button>
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6 text-white/50 leading-relaxed border-t border-white/5 pt-4">
                    {answer}
                </div>
            </div>
        </div>
    );
}
