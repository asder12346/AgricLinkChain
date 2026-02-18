
import React, { useState, useEffect } from 'react';
import { Leaf, ArrowLeft, Loader2, AlertCircle, Hash, Building2, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthPageProps {
  onBack: () => void;
  initialType?: string;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack, initialType = 'Farmer' }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState(initialType);
  const [agentReferralCode, setAgentReferralCode] = useState('');

  useEffect(() => {
    // Check if we should default to Agent sign up
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    if (role === 'Agent') {
      setUserType('Agent');
      setActiveTab('signup');
    }
  }, []);

  const generateReferralCode = (name: string) => {
    const prefix = name.substring(0, 3).toUpperCase();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${random}`;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'signup') {
        // Generate unique code only for agents
        const referralCode = userType === 'Agent' ? generateReferralCode(fullName) : null;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              user_type: userType,
              referral_code: referralCode, // Code they give out (Agents only)
              referred_by: (userType === 'Farmer' || userType === 'Pharmacy') ? agentReferralCode : null, // Code they entered
            },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        alert('Registration successful! Please sign in to access your dashboard.');
        setActiveTab('signin');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onBack();
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
        className="absolute top-8 left-8 text-white/60 hover:text-white flex items-center gap-2 transition-colors z-10"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </button>

      <div className="max-w-md w-full space-y-8 bg-[#0D2517] p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-lime-400/10 blur-[80px] rounded-full"></div>
        
        <div className="text-center space-y-4 relative">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-lime-400 p-1.5 rounded-lg">
              <Leaf className="w-6 h-6 text-[#0A1D11]" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">AgriLinkChain</span>
          </div>
          <h2 className="text-3xl font-bold text-white">
            {activeTab === 'signup' ? (userType === 'Agent' ? 'Agent Onboarding' : userType === 'Admin' ? 'Staff Portal' : 'Create an account') : 'Welcome back'}
          </h2>
          <p className="text-white/60">
            {activeTab === 'signup' ? 'Empowering local and industrial agriculture.' : 'Sign in to manage your activities.'}
          </p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 relative">
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

        <form className="space-y-6 relative" onSubmit={handleAuth}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {activeTab === 'signup' && (
            <div className="space-y-2">
              <label className="text-xs font-black text-white/40 uppercase tracking-widest">Full Name / Organization</label>
              <input 
                required
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe or Green Pharmacy" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-colors text-white font-medium" 
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-white/40 uppercase tracking-widest">Email Address</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-colors text-white font-medium" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-white/40 uppercase tracking-widest">Password</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-colors text-white font-medium" 
            />
          </div>

          {activeTab === 'signup' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest">Register As</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Farmer', 'Buyer', 'Agent', 'Pharmacy', 'Admin'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setUserType(type)}
                      className={`py-3 rounded-xl text-sm font-bold border transition-all ${userType === type ? 'bg-lime-400 border-lime-400 text-[#0A1D11]' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {(userType === 'Farmer' || userType === 'Pharmacy') && (
                <div className="space-y-2 animate-in slide-in-from-top duration-300">
                  <label className="text-xs font-black text-lime-400 uppercase tracking-widest flex items-center gap-2">
                    <Hash className="w-4 h-4" /> Agent ID (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={agentReferralCode}
                    onChange={(e) => setAgentReferralCode(e.target.value.toUpperCase())}
                    placeholder="e.g. AGR-1234" 
                    className="w-full bg-white/5 border border-lime-400/20 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-colors text-white font-mono font-bold tracking-wider" 
                  />
                </div>
              )}
            </>
          )}

          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-lime-400 text-[#0A1D11] py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-lime-300 transition-all transform hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-lime-400/10"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (activeTab === 'signup' ? (userType === 'Admin' ? 'Access Staff Portal' : 'Create Account') : 'Sign In')}
          </button>
        </form>

        <div className="pt-8 border-t border-white/10 text-center relative">
          <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
            AgriLinkChain Ecosystem
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
