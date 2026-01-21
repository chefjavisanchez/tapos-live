
import React, { useState } from 'react';

interface ExchangeModalProps {
    visible: boolean;
    onClose: () => void;
    onExchange: (data: { name: string; email: string; phone: string }) => void;
    onSkip: () => void;
    cardData: any;
}

export default function ExchangeModal({ visible, onClose, onExchange, onSkip, cardData }: ExchangeModalProps) {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-[#111] border border-white/20 rounded-3xl w-full max-w-sm p-8 relative shadow-[0_0_50px_rgba(0,243,255,0.2)]">
                <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white">
                    <i className="ph-bold ph-x text-2xl"></i>
                </button>

                <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full border-2 border-[#00f3ff] p-1 mx-auto mb-4 relative">
                        <img src={cardData.profileImage || "https://placehold.co/100x100"} className="w-full h-full rounded-full object-cover" />
                        <div className="absolute -bottom-2 -right-2 bg-black rounded-full p-1 border border-white/20">
                            <i className="ph-fill ph-arrows-left-right text-[#00f3ff] text-xl"></i>
                        </div>
                    </div>
                    <h2 className="font-syncopate text-xl text-white font-bold uppercase leading-none mb-2">Connect & Exchange</h2>
                    <p className="text-white/60 text-xs">Share your info to instantly get {cardData.fullName}'s Digital Card.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] text-[#00f3ff] uppercase font-bold tracking-wider mb-1 block">Your Name</label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00f3ff] outline-none transition"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-[#00f3ff] uppercase font-bold tracking-wider mb-1 block">Your Email</label>
                        <input
                            type="email"
                            placeholder="john@example.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00f3ff] outline-none transition"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-[#00f3ff] uppercase font-bold tracking-wider mb-1 block">Your Phone</label>
                        <input
                            type="tel"
                            placeholder="+1 555 000 0000"
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#00f3ff] outline-none transition"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    <button
                        onClick={() => onExchange(formData)}
                        disabled={!formData.name}
                        className="w-full py-4 mt-4 bg-[#00f3ff] hover:bg-white text-black font-rajdhani font-bold text-lg uppercase tracking-wider rounded-xl transition shadow-[0_0_20px_rgba(0,243,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <i className="ph-bold ph-swap"></i> Exchange Now
                    </button>

                    <button onClick={onSkip} className="w-full text-center text-[10px] text-white/30 hover:text-white uppercase tracking-widest mt-4">
                        Skip & Just Download Card
                    </button>
                </div>

            </div>
        </div>
    );
}
