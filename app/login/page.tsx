'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Terminal, Lock, Mail, ArrowRight, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false); // NEW STATE
    const router = useRouter();

    // Clear errors when switching modes
    useEffect(() => {
        setError(null);
    }, [mode]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'SIGNUP') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                alert('Account created! Logging you in...');
                // Auto login after signup usually works if confirm is off, otherwise just redirect
                router.push('/');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push('/');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center p-4 relative bg-black">
            {/* Background Image Layer */}
            <div className="absolute inset-0 z-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('/login-bg.jpg')" }}></div>
            <div className="absolute inset-0 z-0 bg-black/60"></div> {/* Overlay for readability */}

            <div className="z-10 w-full max-w-md">
                <div className="glass-panel w-full rounded-2xl border border-white/10 relative overflow-hidden flex flex-col">

                    {/* Decorative Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-neon-blue shadow-[0_0_20px_rgba(0,243,255,0.8)]"></div>

                    {/* TABS */}
                    <div className="flex border-b border-white/10">
                        <button
                            onClick={() => setMode('LOGIN')}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${mode === 'LOGIN' ? 'bg-white/5 text-neon-blue' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <LogIn size={16} /> Member Login
                            </div>
                        </button>
                        <button
                            onClick={() => setMode('SIGNUP')}
                            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-colors ${mode === 'SIGNUP' ? 'bg-white/5 text-neon-blue' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <UserPlus size={16} /> Create Account
                            </div>
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-neon-blue/20 neon-glow flex items-center justify-center mb-4 border border-neon-blue">
                                <Terminal className="text-neon-blue w-8 h-8" />
                            </div>
                            <h1 className="font-syncopate text-2xl font-bold tracking-tight">TAP<span className="text-neon-blue">OS</span> IMPULSO</h1>
                            <p className="text-white/50 text-sm mt-2">
                                {mode === 'LOGIN' ? 'ACCESSING COMMAND CENTER' : 'CREATING DIGITAL PROFILE'}
                            </p>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-4">

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neon-blue uppercase tracking-wider">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue focus:bg-white/10 transition"
                                        placeholder="you@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-neon-blue uppercase tracking-wider">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-12 text-white focus:outline-none focus:border-neon-blue focus:bg-white/10 transition"
                                        placeholder="••••••••"
                                        required
                                    />
                                    {/* Toggle Password Visibility Button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded text-red-200 text-sm animate-pulse">
                                    ⚠ {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-neon-blue text-black font-bold py-3 rounded-lg uppercase tracking-widest hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition duration-300 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Processing...' : (mode === 'SIGNUP' ? 'Join Now' : 'Sign In')}
                                {!loading && <ArrowRight size={18} />}
                            </button>

                        </form>
                    </div>

                </div>
            </div>
        </div >
    );
}
