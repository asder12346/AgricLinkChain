
import React, { useState } from 'react';
import { Leaf, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthPageProps {
  onBack: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState('Farmer');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              user_type: userType,
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        alert('Check your email for confirmation!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onBack(); // Redirect to landing (dashboard in context of landing)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1D11] flex flex-col items-center justify-center p-4">
      <button 
        onClick={onBack}
        className="absolute top-8 left-8 text-white/60 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </button>

      <div className="max-w-md w-full space-y-8 bg-[#0D2517] p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-lime-400 p-1.5 rounded-lg">
              <Leaf className="w-6 h-6 text-[#0A1D11]" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">AgriLinkChain</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            {activeTab === 'signup' ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="text-white/60">
            {activeTab === 'signup' ? 'Join 12,000+ farmers and buyers today.' : 'Sign in to manage your marketplace.'}
          </p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
          <button 
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'signup' ? 'bg-lime-400 text-[#0A1D11]' : 'text-white/60 hover:text-white'}`}
          >
            Sign Up
          </button>
          <button 
            onClick={() => setActiveTab('signin')}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${activeTab === 'signin' ? 'bg-lime-400 text-[#0A1D11]' : 'text-white/60 hover:text-white'}`}
          >
            Sign In
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleAuth}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {activeTab === 'signup' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-white/60 uppercase tracking-wider">Full Name</label>
              <input 
                required
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-colors text-white" 
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-white/60 uppercase tracking-wider">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-colors text-white" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-white/60 uppercase tracking-wider">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-colors text-white" 
            />
          </div>

          {activeTab === 'signup' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-white/60 uppercase tracking-wider">User Type</label>
              <select 
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-colors text-white appearance-none"
              >
                <option value="Farmer" className="bg-[#0A1D11]">Farmer</option>
                <option value="Buyer" className="bg-[#0A1D11]">Buyer</option>
              </select>
            </div>
          )}

          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-lime-400 text-[#0A1D11] py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-lime-300 transition-all transform hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (activeTab === 'signup' ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="pt-8 border-t border-white/10 text-center">
          <div className="text-sm text-white/40">
            By joining, you agree to our <a href="#" className="text-lime-400 hover:underline">Terms of Service</a> and <a href="#" className="text-lime-400 hover:underline">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
