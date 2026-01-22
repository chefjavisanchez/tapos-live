'use client';

import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#050510] text-white font-sans selection:bg-neon-blue selection:text-black">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="fixed inset-0 bg-cyber-grid bg-[length:50px_50px] opacity-10 pointer-events-none"></div>

            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050510]/80 backdrop-blur-md border-b border-white/5">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:text-neon-blue transition">
                        <ArrowLeft size={20} />
                        <span className="font-bold text-sm uppercase tracking-widest">Back to Home</span>
                    </Link>
                    <img src="/logo.png" alt="TapOS" className="h-8 w-auto" />
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-32 pb-24 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
                            <FileText className="text-neon-blue" size={24} />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-syncopate tracking-tight">TERMS OF <br /><span className="text-neon-blue">SERVICE</span></h1>
                    </div>

                    <div className="prose prose-invert max-w-none space-y-12 text-white/70 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">1. AGREEMENT TO TERMS</h2>
                            <p>
                                By accessing or using the TapOS Impulsó services, website, or hardware products, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">2. USER RESPONSIBILITIES</h2>
                            <p>
                                You are responsible for all activity that occurs under your account. You agree to use the services only for lawful purposes and in accordance with these Terms. You must:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Provide accurate and complete information when creating an account.</li>
                                <li>Maintain the security of your account credentials.</li>
                                <li>Not use the service to share harmful, offensive, or illegal content.</li>
                                <li>Not attempt to reverse engineer or disrupt the TapOS platform.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">3. HARDWARE & LIFETIME ACCESS</h2>
                            <p>
                                TapOS Impulsó cards are physical NFC products. "Lifetime Access" refers to the lifetime of the product and the availability of the TapOS digital platform. We reserve the right to modify or discontinue features of the digital platform to improve service quality.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">4. INTELLECTUAL PROPERTY</h2>
                            <p>
                                The TapOS Impulsó name, logo, software, and hardware designs are the exclusive property of Impulso Technology Group. You may not use our branding or technology without our explicit written consent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">5. LIMITATION OF LIABILITY</h2>
                            <p>
                                To the maximum extent permitted by law, TapOS Impulsó shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly through the use of our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">6. CONTACT</h2>
                            <p>
                                For any legal inquiries regarding these terms, please contact:
                            </p>
                            <p className="mt-4 font-bold text-neon-blue">
                                <a href="mailto:javi@tapygo.com">javi@tapygo.com</a>
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-white/5 text-center text-white/20 text-xs">
                <p>Copyright © 2026 TapOS Impulsó. All Rights Reserved.</p>
            </footer>
        </div>
    );
}
