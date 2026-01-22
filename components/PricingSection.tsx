'use client';

import { useState } from 'react';
import { Check, Info, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PricingSection() {
    const router = useRouter();
    const [isAnnual, setIsAnnual] = useState(true); // Default to "Lifetime" view if we had a toggle, keeping structure

    // We can use this toggle for "Individual" vs "Corporate" if desired, 
    // or just 'Monthly' vs 'Lifetime' like the screenshot. 
    // Given the request "$99 lifetime", let's make the toggle "Annual/Lifetime" vs "Monthly" visual 
    // OR just "Individuals" vs "Corporations".
    // User asked for "area for corporations". Let's try a "Corporate" toggle or distinct cards.

    // DECISION: Side-by-side cards 'Individual' vs 'Corporate' is clearer without a toggle for now, 
    // matches the Luma 'Free' vs 'Plus' side-by-side layout perfectly.

    return (
        <section id="pricing" className="py-32 px-6 max-w-7xl mx-auto relative bg-[#050510]">

            {/* Header */}
            <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black font-syncopate mb-6 tracking-tighter text-white">
                    PRICING
                </h2>
                <p className="text-xl text-white/50 max-w-2xl mx-auto font-light">
                    Start for free with a powerful digital profile. Upgrade for physical NFC cards, <span className="text-neon-blue font-bold">corporate controls</span>, and 0% transaction fees.
                </p>

                {/* Optional Toggle (Visual Only for now to match Luma vibe if needed, but maybe not necessary if cards are distinct) */}
                <div className="mt-8 inline-flex bg-white/5 p-1 rounded-full border border-white/10 relative">
                    <div className="w-full absolute inset-0 pointer-events-none" />
                    <button className="px-6 py-2 rounded-full text-sm font-bold bg-white/10 text-white shadow-sm border border-white/10">
                        Lifetime Access
                    </button>
                    <button className="px-6 py-2 rounded-full text-sm font-bold text-white/40 hover:text-white transition">
                        Monthly (Coming Soon)
                    </button>

                    {/* Badge */}
                    <div className="absolute -top-6 right-0 bg-neon-blue text-black text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
                        LIMITED OFFER
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

                {/* CARD 1: INDIVIDUAL / STARTUP */}
                <div className="p-8 md:p-10 rounded-[2.5rem] bg-[#0A0A15] border border-white/5 flex flex-col hover:border-white/10 transition duration-500 group relative overflow-hidden">
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-white mb-2">TapOS Personal</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-bold text-white tracking-tighter">Free</span>
                            <span className="text-white/40 font-medium">/ forever</span>
                        </div>
                        <p className="text-white/40 mt-4 text-sm leading-relaxed">
                            Perfect for freelancers and solo entrepreneurs starting their networking journey.
                        </p>
                    </div>

                    <a href="/login?view=sign_up&plan=free" className="w-full py-4 rounded-xl bg-white text-black font-bold text-center uppercase tracking-wider text-sm hover:scale-[1.02] transition shadow-lg mb-10">
                        Get Started
                    </a>

                    <div className="space-y-4 mb-8 flex-1">
                        <p className="text-xs font-bold uppercase text-white/30 tracking-widest mb-4">INCLUDED FEATURES</p>

                        <FeatureItem text="1 Digital Profile" />
                        <FeatureItem text="Unlimited Contacts" />
                        <FeatureItem text="Basic QR Code" />
                        <FeatureItem text="Mobile App Access" />
                        <FeatureItem text="Standard Analytics" />
                    </div>
                </div>


                {/* CARD 2: CORPORATE / LIFETIME */}
                <div className="p-8 md:p-10 rounded-[2.5rem] bg-[#0A0A15] border border-neon-blue/30 flex flex-col relative overflow-hidden group shadow-[0_0_50px_rgba(0,243,255,0.05)]">

                    {/* Pink/Blue Glow Top Right */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-neon-blue/20 blur-[80px] pointer-events-none"></div>

                    <div className="mb-8 relative z-10">
                        <h3 className="text-xl font-bold text-neon-blue mb-2">TapOS Corporate</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-5xl font-bold text-white tracking-tighter">$99</span>
                            <span className="text-white/40 font-medium">/ lifetime</span>
                        </div>
                        <p className="text-white/40 mt-4 text-sm leading-relaxed">
                            Full control for teams. Physical NFC card included. API access & custom branding.
                        </p>
                    </div>

                    <a href="/login?view=sign_up&plan=corporate" className="w-full py-4 rounded-xl bg-neon-blue text-black font-bold text-center uppercase tracking-wider text-sm hover:bg-white transition shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)] mb-10 relative z-10">
                        Get Corporate Access
                    </a>

                    <div className="space-y-4 mb-8 flex-1 relative z-10">
                        <p className="text-xs font-bold uppercase text-neon-blue/50 tracking-widest mb-4">EVERYTHING IN FREE, PLUS:</p>

                        <FeatureItem text="Physical NFC Card Included" active />
                        <FeatureItem text="Corporate Dashboard Control" active />
                        <FeatureItem text="API Access & Webhooks" active />
                        <FeatureItem text="Remove TapOS Branding" active />
                        <FeatureItem text="Priority Support 24/7" active />
                        <FeatureItem text="Custom Fonts & CSS" active />
                        <FeatureItem text="Multiple Profiles Management" active />
                    </div>
                </div>

            </div>

            {/* Enterprise Text */}
            <div className="text-center mt-20">
                <p className="text-white/40 text-sm">
                    Need more than 50 cards? <a href="mailto:sales@tapos.io" className="text-white underline underline-offset-4 hover:text-neon-blue transition">Contact Sales</a> for volume discounts.
                </p>
            </div>

        </section>
    );
}

function FeatureItem({ text, active = false }: { text: string, active?: boolean }) {
    return (
        <div className="flex items-start gap-3">
            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-neon-blue text-black' : 'bg-white/10 text-white/50'}`}>
                <Check size={12} strokeWidth={3} />
            </div>
            <span className={`text-sm ${active ? 'text-white' : 'text-white/60'}`}>{text}</span>
        </div>
    )
}
