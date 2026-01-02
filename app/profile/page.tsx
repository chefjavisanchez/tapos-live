'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { User, Lock, Key, CheckCircle, ShieldAlert } from 'lucide-react';

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [card, setCard] = useState<any>(null);
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const checkAccess = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            // Get Card Status
            const { data } = await supabase
                .from('cards')
                .select('*')
                .eq('user_id', user.id)
                .single();

            setCard(data);
            setLoading(false);
        };
        checkAccess();
    }, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('Updating...');

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) setMessage('Error: ' + error.message);
        else setMessage('Password updated successfully!');
    };

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;

    // LOCKED VIEW
    if (!card || card.content.subscription !== 'active') {
        return (
            <div className="min-h-screen bg-black bg-cyber-grid p-8 flex items-center justify-center">
                <div className="max-w-md w-full glass-panel border border-yellow-500/30 p-8 rounded-2xl text-center">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/30">
                        <Lock className="text-yellow-500" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">ACCESS RESTRICTED</h2>
                    <p className="text-white/50 mb-6">Profile management features are reserved for Activated Members only.</p>
                    <a href="/" className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-bold transition">
                        Return to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    // ACTIVE VIEW
    return (
        <div className="min-h-screen bg-black bg-cyber-grid p-8 text-white flex justify-center">
            <div className="max-w-2xl w-full">

                <div className="mb-8 flex items-center gap-4">
                    <div className="p-3 bg-neon-blue/20 rounded-xl border border-neon-blue">
                        <User className="text-neon-blue" size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold font-syncopate">USER PROFILE</h1>
                        <p className="text-white/50">Manage your secure access credentials.</p>
                    </div>
                </div>

                <div className="glass-panel border border-white/10 rounded-2xl p-8 space-y-8">

                    <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <CheckCircle className="text-green-400" />
                        <div>
                            <h3 className="font-bold text-green-400">Account Active</h3>
                            <p className="text-xs text-white/50">TapOS Member Since {new Date(card.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-neon-blue uppercase">New Password</label>
                            <div className="relative">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue transition"
                                    placeholder="Enter new secure password"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <button
                            className="w-full bg-neon-blue hover:bg-white text-black font-bold py-4 rounded-lg uppercase tracking-widest transition shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.6)]"
                        >
                            Update Credentials
                        </button>

                        {message && (
                            <p className={`text-center text-sm font-bold ${message.includes('Error') ? 'text-red-500' : 'text-green-400'}`}>
                                {message}
                            </p>
                        )}
                    </form>

                </div>
            </div>
        </div>
    );
}
