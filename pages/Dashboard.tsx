
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, User as UserIcon, Bell, 
  LogOut, Leaf, Plus, TrendingUp, Clock, Menu, X, Settings,
  Trash2, RefreshCw, Users, Loader2, Save, ShoppingBag, Box, Image as ImageIcon,
  PlusCircle, CheckCircle2, Edit2, Calendar, MapPin, ExternalLink, Wallet, CreditCard,
  ChevronRight, ArrowLeft, Truck, Star, ShieldCheck, UserPlus, Share2, Copy, Camera, Upload, 
  Sprout, Ruler, Info, Search, MoreVertical, Landmark
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  user: any;
  onSignOut: () => void;
  onGoHome: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut, onGoHome }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [marketProducts, setMarketProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [onboardedEntities, setOnboardedEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile Form State
  const [editProfile, setEditProfile] = useState({
    full_name: '',
    location: '',
    farm_size: '',
    farm_location: '',
    crops_farming: '',
    crops_planting: '',
    business_registration_number: ''
  });

  useEffect(() => {
    fetchProfileAndData();
  }, [user.id]);

  const fetchProfileAndData = async () => {
    setLoading(true);
    try {
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(prof);
      if (prof) {
        setEditProfile({
          full_name: prof.full_name || '',
          location: prof.location || '',
          farm_size: prof.farm_size || '',
          farm_location: prof.farm_location || '',
          crops_farming: prof.crops_farming || '',
          crops_planting: prof.crops_planting || '',
          business_registration_number: prof.business_registration_number || ''
        });
      }

      const userRole = prof?.user_type || user.user_metadata?.user_type;

      if (userRole === 'Farmer') {
        const { data: list } = await supabase.from('listings').select('*').eq('farmer_id', user.id).order('created_at', { ascending: false });
        if (list) setListings(list);
        const { data: ords } = await supabase.from('orders').select('*').eq('farmer_id', user.id);
        if (ords) setOrders(ords);
      } else if (userRole === 'Agent') {
        const myCode = prof?.referral_code;
        if (myCode) {
          const { data: network } = await supabase.from('profiles').select('*').eq('referred_by', myCode).order('created_at', { ascending: false });
          if (network) setOnboardedEntities(network);
        }
      } else if (userRole === 'Buyer') {
        const { data: marketplace } = await supabase.from('listings').select(`*, profiles:farmer_id (full_name, location)` );
        setMarketProducts(marketplace || []);
        const { data: myOrders } = await supabase.from('orders').select('*').eq('buyer_id', user.id).order('created_at', { ascending: false });
        if (myOrders) setOrders(myOrders);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase.from('profiles').update(editProfile).eq('id', user.id);
      if (error) throw error;
      alert('Records synchronized successfully!');
      fetchProfileAndData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const { error: updateError } = await supabase.from('profiles').update({ avatar_url: base64String }).eq('id', user.id);
        
        if (updateError) {
          alert(updateError.message);
        } else {
          alert('Profile picture updated successfully!');
          fetchProfileAndData();
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error: any) {
      alert(error.message);
      setUploading(false);
    }
  };

  const userRole = profile?.user_type || user.user_metadata?.user_type;
  const isVerified = true; // Simulating verification for dashboard aesthetics

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    ...(userRole === 'Agent' ? [{ name: 'My Network', icon: Users }] : []),
    ...(userRole === 'Farmer' ? [{ name: 'My Listings', icon: Package }, { name: 'Orders', icon: ShoppingCart }] : []),
    ...(userRole === 'Buyer' ? [{ name: 'Marketplace', icon: ShoppingBag }, { name: 'My Orders', icon: ShoppingCart }] : []),
    { name: 'Profile', icon: UserIcon },
  ];

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-[#0A1D11] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-lime-400 animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Authorizing Secure Session...</p>
      </div>
    );
  }

  const agentCode = profile?.referral_code || 'AGR-INIT';

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex font-['Plus_Jakarta_Sans'] text-[#0A1D11]">
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A1D11]/60 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0A1D11] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('Overview')}>
              <div className="bg-lime-400 p-2 rounded-xl shadow-lg shadow-lime-400/20">
                <Leaf className="w-6 h-6 text-[#0A1D11]" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">AgriLink</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white">
              <X className="w-7 h-7" />
            </button>
          </div>

          <div className="flex-1 space-y-2">
            <p className="px-4 mb-4 text-[10px] font-black text-white/20 uppercase tracking-widest">Master Navigation</p>
            {menuItems.map((item) => (
              <button 
                key={item.name} 
                onClick={() => { setActiveTab(item.name); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all ${activeTab === item.name ? 'bg-lime-400 text-[#0A1D11] shadow-xl shadow-lime-400/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon className="w-5 h-5" /> {item.name}
              </button>
            ))}
          </div>

          <button onClick={onSignOut} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-400/10 transition-all border-t border-white/5 mt-8 pt-8">
            <LogOut className="w-5 h-5" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto w-full relative">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 sm:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-neutral-100 rounded-2xl hover:bg-neutral-200 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-xl hidden sm:block">{activeTab}</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
               <div className="flex items-center gap-1.5 justify-end">
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">{userRole} Node</p>
                  {isVerified && <ShieldCheck className="w-3.5 h-3.5 text-lime-600" />}
               </div>
               <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setActiveTab('Profile')}>
                 <p className="text-sm font-bold group-hover:text-lime-600 transition-colors">{profile?.full_name}</p>
                 <div className="flex items-center gap-1 bg-lime-400 px-2 py-0.5 rounded-full shadow-lg shadow-lime-400/10">
                   <span className="text-[8px] font-black uppercase text-[#0A1D11] tracking-widest">Verified</span>
                 </div>
               </div>
             </div>
             <div className="w-12 h-12 rounded-[1.25rem] bg-lime-100 flex items-center justify-center font-black text-lime-700 border-2 border-white shadow-sm overflow-hidden relative group">
               {profile?.avatar_url ? (
                 <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
               ) : (
                 profile?.full_name?.charAt(0)
               )}
             </div>
          </div>
        </header>

        <div className="p-6 sm:p-12 lg:p-16 max-w-7xl mx-auto space-y-12">
          {activeTab === 'Overview' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                 <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h2 className="text-4xl font-black text-[#0A1D11] tracking-tight">Welcome, {profile?.full_name?.split(' ')[0]}!</h2>
                      <div className="bg-[#0A1D11] px-3 py-1 rounded-full flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse"></div>
                         <span className="text-[9px] font-black uppercase text-white tracking-widest">Node Active</span>
                      </div>
                    </div>
                    <p className="text-neutral-500 font-medium">Your account is fully verified and connected to the main exchange.</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <div className="bg-white p-10 rounded-[3rem] border border-neutral-100 shadow-sm relative overflow-hidden group hover:border-lime-400/30 transition-all">
                   <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Security Clearance</p>
                   <div className="flex items-center gap-4 mt-3">
                     <h3 className="text-4xl font-black text-[#0A1D11]">L3 Verified</h3>
                     <ShieldCheck className="w-10 h-10 text-lime-600" />
                   </div>
                 </div>
                 <div className="bg-white p-10 rounded-[3rem] border border-neutral-100 shadow-sm relative overflow-hidden group hover:border-lime-400/30 transition-all">
                   <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">{userRole === 'Agent' ? 'Member Reach' : 'Trade Volume'}</p>
                   <h3 className="text-4xl font-black text-[#0A1D11] mt-3">
                     {userRole === 'Agent' ? onboardedEntities.length : orders.length}
                     <span className="text-lg font-medium text-neutral-300 ml-2">{userRole === 'Agent' ? 'Entities' : 'Trades'}</span>
                   </h3>
                 </div>
                 <div className="bg-[#0A1D11] p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 blur-[50px] -mr-16 -mt-16"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Settlement Balance</p>
                    <h3 className="text-4xl font-black mt-3 text-lime-400">₦{(orders.reduce((a,b) => a + (b.total_price || 0), 0)).toLocaleString()}</h3>
                 </div>
               </div>

               <div className="grid lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm">
                     <h3 className="text-xl font-black mb-8 flex items-center gap-3">
                        <Landmark className="w-6 h-6 text-lime-600" /> Recent Transactions
                     </h3>
                     <div className="space-y-6">
                        {orders.slice(0, 3).map((order) => (
                           <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-neutral-400" />
                                 </div>
                                 <div>
                                    <p className="font-bold text-sm">{order.product_name}</p>
                                    <p className="text-[10px] text-neutral-400 uppercase font-black">{new Date(order.created_at).toLocaleDateString()}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="font-black text-sm">₦{order.total_price.toLocaleString()}</p>
                                 <p className={`text-[9px] font-black uppercase tracking-widest ${order.status === 'Completed' ? 'text-green-500' : 'text-orange-500'}`}>{order.status}</p>
                              </div>
                           </div>
                        ))}
                        {orders.length === 0 && <p className="text-neutral-400 text-sm font-bold text-center py-10">No transaction data yet.</p>}
                     </div>
                  </div>

                  <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm flex flex-col justify-between">
                     <div className="space-y-6">
                        <h3 className="text-xl font-black flex items-center gap-3">
                           <MapPin className="w-6 h-6 text-lime-600" /> Operation Details
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="p-5 rounded-[2rem] bg-neutral-50">
                              <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">Farm Size</p>
                              <p className="font-black">{profile?.farm_size || '0'} Hectares</p>
                           </div>
                           <div className="p-5 rounded-[2rem] bg-neutral-50">
                              <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">Status</p>
                              <p className="font-black text-lime-600">Active Node</p>
                           </div>
                        </div>
                     </div>
                     <button onClick={() => setActiveTab('Profile')} className="mt-8 w-full bg-[#0A1D11] text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-lime-400 hover:text-[#0A1D11] transition-all">
                        <Edit2 className="w-4 h-4" /> Manage Operation Records
                     </button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'My Network' && userRole === 'Agent' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                   <h2 className="text-3xl font-black text-[#0A1D11]">Network Management</h2>
                   <p className="text-neutral-500 text-sm">Onboarded nodes and their transaction history.</p>
                </div>
                <div className="bg-[#0A1D11] text-white px-8 py-5 rounded-[2rem] flex flex-col gap-1 min-w-[240px] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-lime-400/10 blur-[40px] -mr-12 -mt-12 group-hover:scale-150 transition-transform"></div>
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-lime-400/50">Recruitment ID</span>
                   <div className="flex items-center justify-between">
                      <span className="text-2xl font-black font-mono tracking-tighter">{agentCode}</span>
                      <button onClick={() => {navigator.clipboard.writeText(agentCode); alert('Code Copied!')}} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><Copy className="w-4 h-4 text-lime-400" /></button>
                   </div>
                </div>
              </div>

              <div className="bg-white rounded-[3.5rem] border border-neutral-100 shadow-sm overflow-hidden p-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-neutral-50 text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">
                      <tr>
                        <th className="px-10 py-8">Member Identity</th>
                        <th className="px-10 py-8">Node Type</th>
                        <th className="px-10 py-8">Registration</th>
                        <th className="px-10 py-8">Current Activity</th>
                        <th className="px-10 py-8 text-right">Records</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {onboardedEntities.map((entity) => (
                        <tr key={entity.id} className="hover:bg-neutral-50 transition-colors group">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center font-black text-lime-700 text-lg">
                                 {entity.full_name?.charAt(0)}
                               </div>
                               <div>
                                 <div className="flex items-center gap-2">
                                    <p className="font-black text-sm">{entity.full_name}</p>
                                    <ShieldCheck className="w-3.5 h-3.5 text-lime-600" />
                                 </div>
                                 <p className="text-[11px] text-neutral-400 font-medium">{entity.email}</p>
                               </div>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${entity.user_type === 'Farmer' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                               {entity.user_type} Node
                             </span>
                          </td>
                          <td className="px-10 py-8 text-xs text-neutral-500 font-black">
                             {new Date(entity.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-2">
                               <div className="p-1.5 bg-lime-100 rounded-lg"><TrendingUp className="w-3.5 h-3.5 text-lime-600" /></div>
                               <span className="text-sm font-black">₦0.00 Volume</span>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-right">
                             <button className="p-3 text-neutral-300 hover:text-[#0A1D11] hover:bg-neutral-100 rounded-2xl transition-all">
                               <ChevronRight className="w-5 h-5" />
                             </button>
                          </td>
                        </tr>
                      ))}
                      {onboardedEntities.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-10 py-24 text-center">
                            <div className="flex flex-col items-center gap-6 text-neutral-300">
                               <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center border-2 border-dashed border-neutral-100">
                                  <UserPlus className="w-10 h-10 opacity-20" />
                               </div>
                               <div className="space-y-1">
                                  <p className="font-black text-lg text-[#0A1D11]/20">No Network Nodes Found</p>
                                  <p className="text-sm font-bold text-neutral-300">Share your recruitment ID to start onboarding farmers.</p>
                               </div>
                               <button onClick={() => {navigator.clipboard.writeText(agentCode); alert('Copied!')}} className="px-8 py-3 bg-[#0A1D11] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-lime-400 hover:text-[#0A1D11] transition-all">Copy Referral Identity</button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Profile' && (
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <form onSubmit={handleUpdateProfile} className="bg-white rounded-[4rem] p-10 md:p-20 border border-neutral-100 shadow-sm relative overflow-hidden space-y-20">
                 <div className="flex flex-col md:flex-row items-center gap-14 relative z-10">
                    <div className="relative group">
                       <div className="w-52 h-52 rounded-[3.5rem] bg-neutral-100 flex items-center justify-center font-black text-6xl text-neutral-300 border-[8px] border-white shadow-2xl overflow-hidden group-hover:scale-[1.02] transition-transform">
                          {profile?.avatar_url ? (
                            <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                          ) : (
                            profile?.full_name?.charAt(0)
                          )}
                       </div>
                       <label className="absolute -bottom-4 -right-4 p-5 bg-lime-400 text-[#0A1D11] rounded-3xl shadow-2xl hover:scale-110 cursor-pointer border-[8px] border-white transition-all">
                          {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Camera className="w-8 h-8" />}
                          <input type="file" className="hidden" accept="image/*" capture="environment" disabled={uploading} onChange={handleAvatarUpload} />
                       </label>
                    </div>

                    <div className="flex-1 space-y-6 text-center md:text-left">
                       <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                             <h2 className="text-5xl font-black text-[#0A1D11] tracking-tighter leading-none">{profile?.full_name}</h2>
                             <div className="bg-lime-400 text-[#0A1D11] px-5 py-2 rounded-full flex items-center gap-2 shadow-xl shadow-lime-400/20">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-[0.1em]">L3 Verified Stakeholder</span>
                             </div>
                          </div>
                          <p className="text-neutral-400 font-bold uppercase text-[10px] tracking-[0.2em]">Platform ID: {user.id.slice(0, 16)}</p>
                       </div>
                       <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                          <span className="bg-[#0A1D11] text-white px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest">{userRole} Identity</span>
                          <span className="bg-neutral-100 text-neutral-500 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest">{profile?.location || 'Unset Region'}</span>
                       </div>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-16 relative z-10">
                    <div className="space-y-10">
                       <div className="flex items-center gap-4 text-lime-600">
                          <div className="w-10 h-10 rounded-2xl bg-lime-100 flex items-center justify-center"><Info className="w-5 h-5" /></div>
                          <h4 className="text-sm font-black uppercase tracking-[0.2em]">Basic Node Data</h4>
                       </div>
                        <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Legal Entity Full Name</label>
                             <input type="text" value={editProfile.full_name} onChange={(e) => setEditProfile({...editProfile, full_name: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 rounded-[1.75rem] px-8 py-5 text-sm font-bold outline-none focus:ring-4 ring-lime-400/10 focus:bg-white transition-all" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">General Operations Hub</label>
                             <input type="text" value={editProfile.location} onChange={(e) => setEditProfile({...editProfile, location: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 rounded-[1.75rem] px-8 py-5 text-sm font-bold outline-none focus:ring-4 ring-lime-400/10 focus:bg-white transition-all" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Business Registration Number</label>
                             <input type="text" value={editProfile.business_registration_number} onChange={(e) => setEditProfile({...editProfile, business_registration_number: e.target.value})} placeholder="e.g. RC-123456" className="w-full bg-neutral-50 border border-neutral-100 rounded-[1.75rem] px-8 py-5 text-sm font-bold outline-none focus:ring-4 ring-lime-400/10 focus:bg-white transition-all" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-10">
                       <div className="flex items-center gap-4 text-lime-600">
                          <div className="w-10 h-10 rounded-2xl bg-lime-100 flex items-center justify-center"><Sprout className="w-5 h-5" /></div>
                          <h4 className="text-sm font-black uppercase tracking-[0.2em]">Agricultural Asset Log</h4>
                       </div>
                       <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Farm Size (Hectares)</label>
                                <input type="text" value={editProfile.farm_size} onChange={(e) => setEditProfile({...editProfile, farm_size: e.target.value})} placeholder="0" className="w-full bg-neutral-50 border border-neutral-100 rounded-[1.75rem] px-8 py-5 text-sm font-bold outline-none focus:ring-4 ring-lime-400/10 focus:bg-white transition-all" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Asset Location</label>
                                <input type="text" value={editProfile.farm_location} onChange={(e) => setEditProfile({...editProfile, farm_location: e.target.value})} placeholder="State/Region" className="w-full bg-neutral-50 border border-neutral-100 rounded-[1.75rem] px-8 py-5 text-sm font-bold outline-none focus:ring-4 ring-lime-400/10 focus:bg-white transition-all" />
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Active Cycle (Farming)</label>
                             <input type="text" value={editProfile.crops_farming} onChange={(e) => setEditProfile({...editProfile, crops_farming: e.target.value})} placeholder="e.g. Cocoa, Wheat" className="w-full bg-neutral-50 border border-neutral-100 rounded-[1.75rem] px-8 py-5 text-sm font-bold outline-none focus:ring-4 ring-lime-400/10 focus:bg-white transition-all" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Planned Cycle (Planting)</label>
                             <input type="text" value={editProfile.crops_planting} onChange={(e) => setEditProfile({...editProfile, crops_planting: e.target.value})} placeholder="Planned expansion..." className="w-full bg-neutral-50 border border-neutral-100 rounded-[1.75rem] px-8 py-5 text-sm font-bold outline-none focus:ring-4 ring-lime-400/10 focus:bg-white transition-all" />
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-10 flex justify-end">
                    <button type="submit" disabled={saving} className="px-16 py-6 bg-[#0A1D11] text-white rounded-3xl font-black text-[11px] uppercase tracking-widest flex items-center gap-4 hover:bg-lime-400 hover:text-[#0A1D11] transition-all shadow-2xl shadow-neutral-200">
                       {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Save className="w-6 h-6" /> Synchronize All Records</>}
                    </button>
                 </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
