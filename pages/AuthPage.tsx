
import React, { useState, useEffect } from 'react';
import { Leaf, ArrowLeft, Loader2, AlertCircle, Hash, CheckCircle2, Ruler, MapPin, Sprout } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthPageProps {
  onBack: () => void;
  initialType?: string;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack, initialType = 'Farmer' }) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState(initialType);
  const [agentReferralCode, setAgentReferralCode] = useState('');
  
  // Agricultural Data States
  const [farmSize, setFarmSize] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [cropsFarming, setCropsFarming] = useState('');

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
        const referralCode = userType === 'Agent' ? generateReferralCode(fullName) : null;
        
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              user_type: userType,
              referral_code: referralCode,
              referred_by: (userType === 'Farmer' || userType === 'Buyer') ? agentReferralCode : null,
              farm_size: farmSize,
              farm_location: farmLocation,
              crops_farming: cropsFarming,
              verified: true // Simulating verification for demo purposes after data completion
            },
          },
        });

        if (authError) throw authError;
        
        setSuccess(true);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A1D11] flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-6 animate-in zoom-in duration-500">
           <div className="w-20 h-20 bg-lime-400 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-lime-400/20">
              <CheckCircle2 className="w-10 h-10 text-[#0A1D11]" />
           </div>
           <div className="space-y-2">
             <h2 className="text-3xl font-bold text-white">Welcome Aboard!</h2>
             <p className="text-white/60">Your agricultural profile is ready. Redirecting...</p>
           </div>
           <Loader2 className="w-6 h-6 text-lime-400 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1D11] flex flex-col items-center justify-center p-4">
      <button onClick={onBack} className="absolute top-8 left-8 text-white/60 hover:text-white flex items-center gap-2 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back Home
      </button>

      <div className={`w-full ${activeTab === 'signup' && (userType === 'Farmer' || userType === 'Buyer') ? 'max-w-4xl' : 'max-w-md'} space-y-8 bg-[#0D2517] p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden transition-all duration-500`}>
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-lime-400/10 blur-[60px] rounded-full"></div>
        
        <div className="text-center space-y-4 relative">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="bg-lime-400 p-1.5 rounded-lg"><Leaf className="w-6 h-6 text-[#0A1D11]" /></div>
            <span className="text-2xl font-extrabold text-white">AgriLink</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {activeTab === 'signup' ? 'Join the Future' : 'Welcome back'}
          </h2>
        </div>

        <form className="space-y-8 relative" onSubmit={handleAuth}>
          {error && <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-sm border border-red-500/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>}

          {activeTab === 'signup' && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Register As</label>
              <div className="grid grid-cols-3 gap-2">
                {['Farmer', 'Buyer', 'Agent'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setUserType(type)}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all ${userType === type ? 'bg-lime-400 border-lime-400 text-[#0A1D11]' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={`grid ${activeTab === 'signup' && (userType === 'Farmer' || userType === 'Buyer') ? 'md:grid-cols-2' : 'grid-cols-1'} gap-8`}>
            <div className="space-y-6">
              {activeTab === 'signup' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Full Name / Business Entity</label>
                  <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Ibrahim Musa" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-lime-400 transition-colors" />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Email Identity</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@domain.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-lime-400 transition-colors" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Password Secure</label>
                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-lime-400 transition-colors" />
              </div>
            </div>

            {activeTab === 'signup' && (userType === 'Farmer' || userType === 'Buyer') && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-lime-400 uppercase tracking-widest flex items-center gap-2"><Ruler className="w-3 h-3" /> Operation Size ({userType === 'Farmer' ? 'Hectares' : 'Sqm'})</label>
                    <input required type="number" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} placeholder="e.g. 100" className="w-full bg-white/5 border border-lime-400/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-lime-400" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-lime-400 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-3 h-3" /> Specific {userType === 'Farmer' ? 'Farm' : 'Warehouse'} Location</label>
                    <input required type="text" value={farmLocation} onChange={(e) => setFarmLocation(e.target.value)} placeholder="State, Region" className="w-full bg-white/5 border border-lime-400/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-lime-400" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-lime-400 uppercase tracking-widest flex items-center gap-2"><Sprout className="w-3 h-3" /> Primary Crops (Current)</label>
                    <input required type="text" value={cropsFarming} onChange={(e) => setCropsFarming(e.target.value)} placeholder="e.g. Cocoa, Cassava" className="w-full bg-white/5 border border-lime-400/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-lime-400" />
                 </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {activeTab === 'signup' && (userType === 'Farmer' || userType === 'Buyer') && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                  <Hash className="w-3 h-3" /> Agent Recruitment Code
                </label>
                <input type="text" value={agentReferralCode} onChange={(e) => setAgentReferralCode(e.target.value.toUpperCase())} placeholder="e.g. AGR-1234" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-lime-400 font-mono font-bold tracking-wider" />
              </div>
            )}

            <button disabled={loading} type="submit" className="w-full bg-lime-400 text-[#0A1D11] py-5 rounded-2xl font-black text-lg hover:bg-lime-300 transition-all flex items-center justify-center gap-3 shadow-xl shadow-lime-400/10">
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (activeTab === 'signup' ? 'Initialize Profile' : 'Authenticate')}
            </button>
          </div>
        </form>

        <div className="flex justify-center pt-4">
          <button onClick={() => setActiveTab(activeTab === 'signup' ? 'signin' : 'signup')} className="text-sm font-bold text-white/40 hover:text-lime-400 transition-colors">
            {activeTab === 'signup' ? 'Already registered? Sign In' : "New here? Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
