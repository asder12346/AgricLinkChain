
import React, { useState } from 'react';
import { ShieldCheck, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';

interface AdminLoginProps {
    onLoginSuccess: () => void;
    onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate network delay for premium feel
        setTimeout(() => {
            if (username === 'admin' && password === 'adminpass') {
                localStorage.setItem('agri_admin_auth', 'true');
                onLoginSuccess();
            } else {
                setError('Invalid administrative credentials. Access denied.');
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0A1D11] flex flex-col items-center justify-center p-6 font-['Plus_Jakarta_Sans']">
            <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-4">
                    <div className="inline-flex p-4 rounded-3xl bg-lime-400 text-[#0A1D11] shadow-2xl shadow-lime-400/20 mb-4">
                        <ShieldCheck className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Security Terminal</h1>
                    <p className="text-white/40 text-sm font-medium">Administrative authorization required to proceed.</p>
                </div>

                <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Admin Username</label>
                            <div className="relative group">
                                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-lime-400 transition-colors" />
                                <input
                                    required
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white outline-none focus:ring-2 ring-lime-400/50 focus:bg-white/10 transition-all font-bold"
                                    placeholder="Username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">Security Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-lime-400 transition-colors" />
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white outline-none focus:ring-2 ring-lime-400/50 focus:bg-white/10 transition-all font-bold"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-lime-400 text-[#0A1D11] py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-lime-300 transition-all shadow-xl shadow-lime-400/10 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Authorize Access
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <button
                    onClick={onBack}
                    className="w-full py-4 text-white/20 hover:text-white/60 text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                    Return to Hub
                </button>
            </div>

            <div className="fixed bottom-10 left-10 hidden lg:block">
                <p className="text-[10px] font-mono text-white/10 uppercase tracking-[0.5em] vertical-text">Encrypted Section</p>
            </div>
        </div>
    );
};

export default AdminLogin;
