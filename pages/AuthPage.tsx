
import React, { useState } from 'react';
import {
  ArrowLeft, Loader2, AlertCircle, CheckCircle2, Ruler, MapPin, Sprout,
  ShieldCheck, Eye, EyeOff, Leaf, ShoppingBag, Landmark, Truck, FlaskConical,
  Database, Users
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthPageProps {
  onBack: () => void;
  initialType?: string;
}

const AuthPage: React.FC<AuthPageProps> = ({ onBack, initialType = 'Farmer' }) => {
  const roleOptions = [
    { value: 'Farmer', label: 'Farmer', icon: Sprout, hint: 'List harvests and manage farm trade.' },
    { value: 'Buyer', label: 'Buyer', icon: ShoppingBag, hint: 'Source verified produce and track orders.' },
    { value: 'Financier', label: 'Financier', icon: Landmark, hint: 'Review loans and fund production.' },
    { value: 'Logistics', label: 'Logistics', icon: Truck, hint: 'Coordinate pickup, delivery, and routing.' },
    { value: 'Agent', label: 'Ext. Agent', icon: Users, hint: 'Onboard farmers and monitor field networks.' },
    { value: 'Researcher', label: 'Research', icon: FlaskConical, hint: 'Study market, yield, and supply insights.' },
    { value: 'Admin', label: 'Admin Data', icon: Database, hint: 'Govern records, users, and platform data.' },
  ];
  const startingRole = roleOptions.some((role) => role.value === initialType) ? initialType : 'Farmer';
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState(startingRole);
  const [location, setLocation] = useState('');
  const [operationSize, setOperationSize] = useState('');
  const [operationRegion, setOperationRegion] = useState('');
  const [productFocus, setProductFocus] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'signup') {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        const signupProfile = {
          full_name: fullName,
          user_type: userType,
          location,
          farm_size: operationSize,
          farm_location: operationRegion,
          crops_farming: productFocus,
          verified: false,
          onboarding_complete: false,
        };

        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: signupProfile,
          },
        });
        if (authError) throw authError;

        if (data.user) {
          await supabase
            .from('profiles')
            .update(signupProfile)
            .eq('id', data.user.id);
        }

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
  
  const isSignup = activeTab === 'signup';
  const isFarmerSignup = isSignup && userType === 'Farmer';
  const showProfileFields = isSignup;
  const selectedRole = roleOptions.find((role) => role.value === userType) || roleOptions[0];
  const operationLabels: Record<string, { size: string; region: string; focus: string; sizePlaceholder: string; regionPlaceholder: string; focusPlaceholder: string }> = {
    Farmer: {
      size: 'Farm Size',
      region: 'Farm Region',
      focus: 'Crops / Produce',
      sizePlaceholder: 'e.g. 100 hectares',
      regionPlaceholder: 'State, region',
      focusPlaceholder: 'e.g. Cocoa, cassava',
    },
    Buyer: {
      size: 'Purchase / Warehouse Size',
      region: 'Delivery / Sourcing Region',
      focus: 'Products Needed',
      sizePlaceholder: 'e.g. 50 tons monthly',
      regionPlaceholder: 'Preferred buying region',
      focusPlaceholder: 'e.g. Maize, rice, sesame',
    },
    Financier: {
      size: 'Capital Capacity',
      region: 'Funding Region',
      focus: 'Funding Focus',
      sizePlaceholder: 'e.g. ₦50m portfolio',
      regionPlaceholder: 'States or commodity clusters',
      focusPlaceholder: 'Inputs, working capital, equipment',
    },
    Logistics: {
      size: 'Fleet / Route Capacity',
      region: 'Coverage Region',
      focus: 'Logistics Service',
      sizePlaceholder: 'e.g. 12 trucks / 400 tons monthly',
      regionPlaceholder: 'Pickup and delivery corridors',
      focusPlaceholder: 'Cold chain, bulk haulage, warehousing',
    },
    Agent: {
      size: 'Field Network Size',
      region: 'Extension Zone',
      focus: 'Support Focus',
      sizePlaceholder: 'e.g. 80 farmers',
      regionPlaceholder: 'LGA, state, or cluster',
      focusPlaceholder: 'Training, verification, onboarding',
    },
    Researcher: {
      size: 'Research Coverage',
      region: 'Study Region',
      focus: 'Research Focus',
      sizePlaceholder: 'e.g. 5 crop clusters',
      regionPlaceholder: 'Field or market study area',
      focusPlaceholder: 'Yield, prices, climate, soil',
    },
    Admin: {
      size: 'Data Scope',
      region: 'Governance Region',
      focus: 'Admin Focus',
      sizePlaceholder: 'e.g. Platform operations',
      regionPlaceholder: 'National, state, or program scope',
      focusPlaceholder: 'User data, verification, compliance',
    },
  };
  const currentLabels = operationLabels[userType] || operationLabels.Farmer;

  if (success) {
    return (
      <div className="min-h-screen bg-[#071210] flex items-center justify-center p-4">
        <div className="text-center space-y-6 animate-reveal">
          <div className="w-24 h-24 bg-lime-400 rounded-full flex items-center justify-center mx-auto glow-lime shadow-2xl">
            <CheckCircle2 className="w-12 h-12 text-[#071210]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white">Welcome Aboard!</h2>
            <p className="text-white/50">Your {selectedRole.label.toLowerCase()} profile is ready. Redirecting you now...</p>
          </div>
          <Loader2 className="w-6 h-6 text-lime-400 animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071210] flex">
      {/* Left Visual Panel */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 relative overflow-hidden flex-col">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200"
          alt="Agriculture"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#071210] via-[#071210]/60 to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-0 right-0 w-full h-1/3 bg-gradient-to-b from-[#071210] to-transparent" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          {/* Logo */}
          <button onClick={onBack} className="flex items-center gap-2.5 group w-fit">
            <div className="w-9 h-9 bg-lime-400 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-[#071210]" />
            </div>
            <span className="text-lg font-extrabold text-white">Agric<span className="text-lime-400">Link</span>Chain</span>
          </button>

          {/* Copy */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="badge-live">Trusted Platform</div>
              <h2 className="text-4xl xl:text-5xl font-black leading-tight text-white">
                Join 300,000+
                <br />
                <span className="text-gradient-lime">Farmers thriving</span>
                <br />
                with AgricLink
              </h2>
            </div>
            <div className="space-y-4">
              {['Role-based dashboards for every stakeholder', 'Direct market and service coordination', 'Secure records from signup to settlement', 'Wallet, financing, and logistics visibility'].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-white/60 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div className="glass rounded-2xl p-5 flex items-center gap-4">
            <div className="flex -space-x-2">
              {[20, 21, 22, 23].map(i => (
                <img key={i} src={`https://picsum.photos/seed/${i}/60/60`} className="w-9 h-9 rounded-full border-2 border-[#071210] object-cover" alt="" />
              ))}
            </div>
            <div>
              <div className="text-white font-bold text-sm">12,000+ active members</div>
              <div className="text-lime-400 text-xs">₦1.2B+ transacted this month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 relative overflow-y-auto">
        {/* Mobile back button */}
        <button onClick={onBack} className="absolute top-6 left-6 text-white/50 hover:text-white flex items-center gap-1.5 text-sm font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className={`w-full ${showProfileFields ? 'max-w-3xl' : 'max-w-md'} space-y-7 transition-all duration-500`}>
          {/* Header */}
          <div className="text-center space-y-1">
            <h2 className="text-3xl font-black text-white">
              {activeTab === 'signup' ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-white/40 text-sm">
              {activeTab === 'signup' ? 'Set up your agricultural profile in minutes.' : 'Sign in to access your dashboard.'}
            </p>
          </div>

          {/* Tab Toggle */}
          <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-2xl p-1">
            {(['signup', 'signin'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                  activeTab === tab
                    ? 'bg-lime-400 text-[#071210] shadow-lg'
                    : 'text-white/40 hover:text-white'
                }`}
              >
                {tab === 'signup' ? 'Create Account' : 'Sign In'}
              </button>
            ))}
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 text-red-400 p-4 rounded-2xl text-sm border border-red-500/20 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <div className={`grid ${showProfileFields ? 'md:grid-cols-2' : 'grid-cols-1'} gap-5`}>
              {/* Primary fields */}
              <div className="space-y-4">
                {activeTab === 'signup' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Register As</label>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {roleOptions.map((role) => (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => setUserType(role.value)}
                            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                              userType === role.value
                                ? 'border-lime-400 bg-lime-400 text-[#071210] shadow-lg shadow-lime-400/15'
                                : 'border-white/[0.1] bg-white/[0.04] text-white/70 hover:text-white'
                            }`}
                          >
                            <role.icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>
                              <span className="block text-sm font-black">{role.label}</span>
                              <span className={`block text-[10px] leading-snug mt-1 ${userType === role.value ? 'text-[#071210]/65' : 'text-white/35'}`}>{role.hint}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">
                        {userType === 'Farmer' ? 'Farmer / Business Name' : `${selectedRole.label} / Organization Name`}
                      </label>
                      <input
                        required
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={userType === 'Farmer' ? 'Ibrahim Musa Farms' : 'AgricLink Partner Ltd'}
                        className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white placeholder-white/25 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Primary Location</label>
                      <input
                        required
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="State, City"
                        className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white placeholder-white/25 text-sm"
                      />
                    </div>
                  </>
                )}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Email</label>
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white placeholder-white/25 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Password</label>
                  <div className="relative">
                    <input required type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white placeholder-white/25 text-sm pr-12"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {activeTab === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block">Confirm Password</label>
                    <div className="relative">
                      <input
                        required
                        type={showConfirmPass ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/[0.05] border border-white/[0.1] rounded-2xl px-5 py-3.5 text-white placeholder-white/25 text-sm pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                      >
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {showProfileFields && (
                <div className="space-y-4 animate-reveal">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-lime-400 uppercase tracking-widest flex items-center gap-1.5 block">
                      <Ruler className="w-3 h-3" /> {currentLabels.size}
                    </label>
                    <input
                      required
                      type="text"
                      value={operationSize}
                      onChange={(e) => setOperationSize(e.target.value)}
                      placeholder={currentLabels.sizePlaceholder}
                      className="w-full bg-white/[0.05] border border-lime-400/20 rounded-2xl px-5 py-3.5 text-white placeholder-white/25 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-lime-400 uppercase tracking-widest flex items-center gap-1.5 block">
                      <MapPin className="w-3 h-3" /> {currentLabels.region}
                    </label>
                    <input
                      required
                      type="text"
                      value={operationRegion}
                      onChange={(e) => setOperationRegion(e.target.value)}
                      placeholder={currentLabels.regionPlaceholder}
                      className="w-full bg-white/[0.05] border border-lime-400/20 rounded-2xl px-5 py-3.5 text-white placeholder-white/25 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-lime-400 uppercase tracking-widest flex items-center gap-1.5 block">
                      <Sprout className="w-3 h-3" /> {currentLabels.focus}
                    </label>
                    <input
                      required
                      type="text"
                      value={productFocus}
                      onChange={(e) => setProductFocus(e.target.value)}
                      placeholder={currentLabels.focusPlaceholder}
                      className="w-full bg-white/[0.05] border border-lime-400/20 rounded-2xl px-5 py-3.5 text-white placeholder-white/25 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="space-y-4">

              <button
                disabled={loading}
                type="submit"
                className="w-full bg-lime-400 text-[#071210] py-4 rounded-2xl font-black text-sm hover:bg-lime-300 transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-lime-400/20 disabled:opacity-60 disabled:cursor-not-allowed btn-press"
              >
                {loading
                  ? <Loader2 className="w-5 h-5 animate-spin" />
                  : activeTab === 'signup' ? 'Create My Account' : 'Sign In to Dashboard'
                }
              </button>
            </div>
          </form>

          {/* Footer links */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <button onClick={() => setActiveTab(activeTab === 'signup' ? 'signin' : 'signup')}
              className="text-sm text-white/35 hover:text-lime-400 transition-colors"
            >
              {activeTab === 'signup' ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
            <button
              onClick={() => { setActiveTab('signin'); setUserType('Admin'); }}
              className="text-[10px] font-black uppercase tracking-widest text-white/10 hover:text-lime-400/40 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3 h-3" /> Master Control Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
