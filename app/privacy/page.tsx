'use client';

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
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
                            <Shield className="text-neon-blue" size={24} />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black font-syncopate tracking-tight">PRIVACY <br /><span className="text-neon-blue">POLICY</span></h1>
                    </div>

                    <div className="prose prose-invert max-w-none space-y-12 text-white/70 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">1. INTRODUCTION</h2>
                            <p>
                                At TapOS Impulsó, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website, use our app, or use our NFC networking tools.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">2. THE DATA WE COLLECT</h2>
                            <p>
                                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier.</li>
                                <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                                <li><strong>Profile Data:</strong> includes your username and password, purchases or orders made by you, your interests, preferences, and feedback.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">3. HOW WE USE YOUR DATA</h2>
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>To provide you with the TapOS services and manage your profile.</li>
                                <li>To facilitate the sharing of your professional information with others via NFC taps.</li>
                                <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
                                <li>To improve our website, products/services, marketing, customer relationships and experiences.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">4. DATA SECURITY</h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
                                In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">5. CONTACT US</h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at:
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
