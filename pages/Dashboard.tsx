
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, User as UserIcon, Bell, 
  LogOut, Leaf, Plus, TrendingUp, Clock, Menu, X, Settings,
  Trash2, RefreshCw, Users, Loader2, Save, ShoppingBag, Box, Image as ImageIcon,
  PlusCircle, CheckCircle2, Edit2, Calendar, MapPin, ExternalLink, Wallet, CreditCard,
  ChevronRight, ArrowLeft, Truck, Star, ShieldCheck, UserPlus, Share2, Copy, Camera, Upload, 
  Sprout, Ruler, Info
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
  const [isAddingListing, setIsAddingListing] = useState(false);
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
    crops_planting: ''
  });

  // Checkout State
  const [checkoutProduct, setCheckoutProduct] = useState<any>(null);
  const [orderQty, setOrderQty] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);

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
          crops_planting: prof.crops_planting || ''
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
        const defaultMarket = [
          { id: 'm1', name: 'Premium Cocoa Beans', price: 5200, unit: 'kg', stock: 5000, category: 'Grains', image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=600', profiles: { full_name: 'Ondo Cocoa Estate', location: 'Ondo State' } },
          { id: 'm2', name: 'Bulk White Maize', price: 38000, unit: 'ton', stock: 15, category: 'Grains', image_url: 'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?auto=format&fit=crop&q=80&w=600', profiles: { full_name: 'Zaria Harvesters', location: 'Kaduna State' } },
          { id: 'm3', name: 'Fresh Cassava Roots', price: 800, unit: 'ton', stock: 100, category: 'Tubers', image_url: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&q=80&w=600', profiles: { full_name: 'Owerri Roots Ltd', location: 'Imo State' } },
          { id: 'm4', name: 'Sweet Potatoes', price: 12000, unit: 'bag', stock: 240, category: 'Tubers', image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=600', profiles: { full_name: 'Benue Highland Farms', location: 'Benue State' } },
        ];
        setMarketProducts(marketplace && marketplace.length > 0 ? [...marketplace, ...defaultMarket] : defaultMarket);
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
      const { error } = await supabase
        .from('profiles')
        .update(editProfile)
        .eq('id', user.id);
      
      if (error) throw error;
      alert('Profile updated successfully!');
      fetchProfileAndData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;
      
      await fetchProfileAndData();
      alert('Profile picture updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Error uploading avatar.');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(true);
    try {
      const farmerId = checkoutProduct.farmer_id || '00000000-0000-0000-0000-000000000000';
      const { error } = await supabase.from('orders').insert([{
        buyer_id: user.id,
        farmer_id: farmerId,
        product_name: checkoutProduct.name,
        quantity: orderQty,
        unit: checkoutProduct.unit,
        total_price: checkoutProduct.price * orderQty,
        status: 'Pending'
      }]);
      if (error) throw error;
      alert('Order placed successfully!');
      setCheckoutProduct(null);
      setActiveTab('My Orders');
      fetchProfileAndData();
    } catch (err: any) {
      alert(err.message || "Order failed");
    } finally {
      setIsOrdering(false);
    }
  };

  const userRole = profile?.user_type || user.user_metadata?.user_type;
  const isVerified = profile?.verified || false;

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    ...(userRole === 'Agent' ? [{ name: 'My Network', icon: Users }] : []),
    ...(userRole === 'Farmer' ? [{ name: 'My Listings', icon: Package }, { name: 'Orders', icon: ShoppingCart }] : []),
    ...(userRole === 'Buyer' ? [{ name: 'Marketplace', icon: ShoppingBag }, { name: 'My Orders', icon: ShoppingCart }] : []),
    { name: 'Profile', icon: UserIcon },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Regional Harvest Summit', date: 'Jul 04', type: 'Physical', icon: <MapPin className="w-5 h-5 text-lime-500" /> },
    { id: 2, title: 'Smart Farmer Webinar', date: 'Jul 12', type: 'Digital', icon: <ExternalLink className="w-5 h-5 text-blue-500" /> },
  ];

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-[#0A1D11] flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-lime-400 animate-spin" />
        <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Authorizing Secure Session...</p>
      </div>
    );
  }

  const agentCode = profile?.referral_code || 'AGR-PENDING';

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex font-['Plus_Jakarta_Sans'] text-[#0A1D11]">
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A1D11]/60 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0A1D11] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
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
            <p className="px-4 mb-4 text-[10px] font-black text-white/20 uppercase tracking-widest">Navigation</p>
            {menuItems.map((item) => (
              <button 
                key={item.name} 
                onClick={() => { setActiveTab(item.name); setCheckoutProduct(null); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} 
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
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">{userRole}</p>
                  {isVerified && (
                    <div className="bg-lime-400 p-0.5 rounded-full" title="Verified Member">
                      <CheckCircle2 className="w-2.5 h-2.5 text-[#0A1D11]" />
                    </div>
                  )}
               </div>
               <p className="text-sm font-bold">{profile?.full_name}</p>
             </div>
             <div className="w-12 h-12 rounded-[1.25rem] bg-lime-100 flex items-center justify-center font-black text-lime-700 border-2 border-white shadow-sm overflow-hidden relative group">
               {profile?.avatar_url ? (
                 <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
               ) : (
                 profile?.full_name?.charAt(0)
               )}
               {uploading && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                 </div>
               )}
             </div>
          </div>
        </header>

        <div className="p-6 sm:p-12 lg:p-16 max-w-7xl mx-auto space-y-12">
          {activeTab === 'Overview' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                 <div>
                   <div className="flex items-center gap-3">
                    <h2 className="text-4xl font-black text-[#0A1D11] tracking-tight">Welcome, {profile?.full_name?.split(' ')[0]}!</h2>
                    {isVerified && (
                      <div className="bg-lime-400 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg shadow-lime-400/20">
                         <ShieldCheck className="w-3.5 h-3.5 text-[#0A1D11]" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-[#0A1D11]">Verified Member</span>
                      </div>
                    )}
                   </div>
                   <p className="text-neutral-500 font-medium mt-1">Platform status is live. 1.2k active nodes secured.</p>
                 </div>
                 {userRole === 'Farmer' && (
                   <button onClick={() => setIsAddingListing(true)} className="bg-[#0A1D11] text-white px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all">
                     <PlusCircle className="w-5 h-5 text-lime-400" /> New Inventory
                   </button>
                 )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <div className="bg-white p-10 rounded-[3rem] border border-neutral-100 shadow-sm relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-lime-400/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-lime-400/10 transition-all"></div>
                   <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Platform Status</p>
                   <h3 className="text-4xl font-black text-[#0A1D11] mt-3 flex items-center gap-2">
                     Verified <CheckCircle2 className="w-6 h-6 text-green-500" />
                   </h3>
                 </div>
                 <div className="bg-white p-10 rounded-[3rem] border border-neutral-100 shadow-sm relative overflow-hidden group">
                   <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Trade Volume</p>
                   <h3 className="text-4xl font-black text-[#0A1D11] mt-3">{orders.length} <span className="text-lg font-medium text-neutral-300">Closed</span></h3>
                 </div>
                 <div className="bg-[#0A1D11] p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 blur-[60px] rounded-full -mr-16 -mt-16 group-hover:bg-lime-400/20 transition-all"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Wallet Balance</p>
                    <h3 className="text-4xl font-black mt-3 text-lime-400">₦{(orders.reduce((a,b) => a + (b.total_price || 0), 0)).toLocaleString()}</h3>
                 </div>
               </div>

               {/* New Detail Card for Agricultural Data */}
               <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm relative overflow-hidden">
                 <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                       <h3 className="text-2xl font-black text-[#0A1D11]">Agricultural Footprint</h3>
                       <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest">Registered Farming Metrics</p>
                    </div>
                    <button onClick={() => setActiveTab('Profile')} className="p-3 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors text-lime-600">
                       <Edit2 className="w-5 h-5" />
                    </button>
                 </div>
                 <div className="grid md:grid-cols-4 gap-8">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-neutral-400 font-black text-[10px] uppercase tracking-widest"><Ruler className="w-3.5 h-3.5 text-lime-600" /> Farm Size</div>
                       <p className="text-lg font-black text-[#0A1D11]">{profile?.farm_size || 'N/A'} Hectares</p>
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-neutral-400 font-black text-[10px] uppercase tracking-widest"><MapPin className="w-3.5 h-3.5 text-lime-600" /> Operation Base</div>
                       <p className="text-lg font-black text-[#0A1D11]">{profile?.farm_location || 'Not Set'}</p>
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-neutral-400 font-black text-[10px] uppercase tracking-widest"><Sprout className="w-3.5 h-3.5 text-lime-600" /> Active Crops</div>
                       <p className="text-lg font-black text-[#0A1D11]">{profile?.crops_farming || 'No active crops'}</p>
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-neutral-400 font-black text-[10px] uppercase tracking-widest"><Calendar className="w-3.5 h-3.5 text-lime-600" /> Upcoming Cycle</div>
                       <p className="text-lg font-black text-[#0A1D11]">{profile?.crops_planting || 'TBD'}</p>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'Profile' && (
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <form onSubmit={handleUpdateProfile} className="bg-white rounded-[3.5rem] p-10 md:p-20 border border-neutral-100 shadow-sm relative overflow-hidden space-y-16">
                 <div className="absolute top-0 right-0 w-80 h-80 bg-lime-400/5 blur-[120px] -mr-32 -mt-32"></div>
                 
                 <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="relative group">
                       <div className="w-48 h-48 rounded-[3.5rem] bg-neutral-100 flex items-center justify-center font-black text-6xl text-neutral-300 border-[6px] border-white shadow-2xl overflow-hidden">
                          {profile?.avatar_url ? (
                            <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                          ) : (
                            profile?.full_name?.charAt(0)
                          )}
                          {uploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                               <Loader2 className="w-10 h-10 text-white animate-spin" />
                            </div>
                          )}
                       </div>
                       <label className="absolute -bottom-4 -right-4 p-5 bg-lime-400 text-[#0A1D11] rounded-[1.75rem] shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer border-[6px] border-white">
                          <Camera className="w-8 h-8" />
                          <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                       </label>
                    </div>

                    <div className="flex-1 space-y-6 text-center md:text-left">
                       <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                          <h2 className="text-5xl font-black text-[#0A1D11] tracking-tight">{profile?.full_name}</h2>
                          {isVerified && (
                             <div className="bg-lime-400 text-[#0A1D11] px-4 py-1.5 rounded-full flex items-center gap-2 shadow-xl shadow-lime-400/20">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Verified Stakeholder</span>
                             </div>
                          )}
                       </div>
                       <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                          <span className="bg-[#0A1D11] text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">{userRole} Identity</span>
                          <span className="bg-neutral-100 text-neutral-400 px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest">Member ID: #{profile?.id?.slice(0,8)}</span>
                       </div>
                    </div>
                 </div>

                 <div className="grid md:grid-cols-2 gap-12 relative z-10">
                    <div className="space-y-10">
                       <div className="space-y-4">
                          <h4 className="text-[11px] font-black text-lime-600 uppercase tracking-[0.2em] flex items-center gap-2"><Info className="w-3.5 h-3.5" /> Identity & Logistics</h4>
                          <div className="space-y-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Legal Name / Entity</label>
                                <input type="text" value={editProfile.full_name} onChange={(e) => setEditProfile({...editProfile, full_name: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 rounded-[1.5rem] px-8 py-5 text-sm font-bold focus:border-lime-400 outline-none transition-all" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">General Location</label>
                                <input type="text" value={editProfile.location} onChange={(e) => setEditProfile({...editProfile, location: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 rounded-[1.5rem] px-8 py-5 text-sm font-bold focus:border-lime-400 outline-none transition-all" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Registered Farm/Warehouse Location</label>
                                <input type="text" value={editProfile.farm_location} onChange={(e) => setEditProfile({...editProfile, farm_location: e.target.value})} className="w-full bg-neutral-50 border border-neutral-100 rounded-[1.5rem] px-8 py-5 text-sm font-bold focus:border-lime-400 outline-none transition-all" />
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-10">
                       <div className="space-y-4">
                          <h4 className="text-[11px] font-black text-lime-600 uppercase tracking-[0.2em] flex items-center gap-2"><Sprout className="w-3.5 h-3.5" /> Agricultural Metrics</h4>
                          <div className="space-y-6">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Operational Size (Hectares / Sqm)</label>
                                <input type="text" value={editProfile.farm_size} onChange={(e) => setEditProfile({...editProfile, farm_size: e.target.value})} placeholder="e.g. 50" className="w-full bg-neutral-50 border border-neutral-100 rounded-[1.5rem] px-8 py-5 text-sm font-bold focus:border-lime-400 outline-none transition-all" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Crops Currently Farming / Handling</label>
                                <input type="text" value={editProfile.crops_farming} onChange={(e) => setEditProfile({...editProfile, crops_farming: e.target.value})} placeholder="e.g. Maize, Cassava" className="w-full bg-neutral-50 border border-neutral-100 rounded-[1.5rem] px-8 py-5 text-sm font-bold focus:border-lime-400 outline-none transition-all" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">Upcoming Cycle / Planting Plans</label>
                                <input type="text" value={editProfile.crops_planting} onChange={(e) => setEditProfile({...editProfile, crops_planting: e.target.value})} placeholder="e.g. Cocoa Expansion" className="w-full bg-neutral-50 border border-neutral-100 rounded-[1.5rem] px-8 py-5 text-sm font-bold focus:border-lime-400 outline-none transition-all" />
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-10 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <p className="text-neutral-400 text-xs font-medium max-w-sm text-center md:text-left italic">By keeping your footprint updated, you ensure the highest accuracy for trade matchmaking on the AgriLink network.</p>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                       <button type="button" onClick={onSignOut} className="flex-1 md:flex-none px-10 py-5 bg-red-50 text-red-500 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-all">Sign Out</button>
                       <button type="submit" disabled={saving} className="flex-1 md:flex-none px-12 py-5 bg-[#0A1D11] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-lime-400 hover:text-[#0A1D11] transition-all shadow-2xl">
                          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Synchronize Profile</>}
                       </button>
                    </div>
                 </div>
              </form>
            </div>
          )}

          {activeTab === 'My Network' && userRole === 'Agent' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-10 rounded-[3rem] border border-neutral-100 shadow-sm relative overflow-hidden group">
                       <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                          <div className="space-y-2">
                             <h2 className="text-3xl font-black tracking-tight text-[#0A1D11]">Network Expansion</h2>
                             <p className="text-neutral-500 font-medium">Manage and track your successfully onboarded agricultural stakeholders.</p>
                          </div>
                          <div className="bg-[#0A1D11] p-6 rounded-[2rem] text-white w-full md:w-auto min-w-[240px]">
                             <p className="text-[10px] font-black uppercase tracking-widest text-lime-400/60 mb-2">My Referral Code</p>
                             <div className="flex items-center justify-between gap-4">
                                <span className="text-2xl font-black font-mono">{agentCode}</span>
                                <button onClick={() => {navigator.clipboard.writeText(agentCode); alert('Referral ID copied to clipboard!');}} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
                                   <Copy className="w-4 h-4" />
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="bg-white rounded-[3rem] border border-neutral-100 shadow-sm overflow-hidden">
                       <div className="p-8 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
                          <h3 className="font-black text-xl">Onboarded Members</h3>
                          <div className="text-[10px] font-black text-lime-600 bg-lime-100 px-3 py-1 rounded-full uppercase">{onboardedEntities.length} Total</div>
                       </div>
                       <div className="overflow-x-auto">
                          <table className="w-full text-left">
                             <thead className="bg-neutral-50/50 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                                <tr>
                                   <th className="px-8 py-5">Full Name / Entity</th>
                                   <th className="px-8 py-5">Role</th>
                                   <th className="px-8 py-5">Onboarding Date</th>
                                   <th className="px-8 py-5 text-right">Performance</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-neutral-50">
                                {onboardedEntities.map(entity => (
                                   <tr key={entity.id} className="hover:bg-neutral-50/50 transition-colors">
                                      <td className="px-8 py-6">
                                         <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center font-black text-[#0A1D11]">
                                              {entity.avatar_url ? <img src={entity.avatar_url} className="w-full h-full object-cover rounded-xl" /> : entity.full_name?.charAt(0)}
                                            </div>
                                            <div>
                                               <p className="font-bold text-sm">{entity.full_name}</p>
                                               <p className="text-[10px] text-neutral-400 font-mono">{entity.id.slice(0,8)}</p>
                                            </div>
                                         </div>
                                      </td>
                                      <td className="px-8 py-6">
                                         <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${entity.user_type === 'Farmer' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                            {entity.user_type}
                                         </span>
                                      </td>
                                      <td className="px-8 py-6 text-xs text-neutral-400 font-bold">
                                         {new Date(entity.created_at).toLocaleDateString()}
                                      </td>
                                      <td className="px-8 py-6 text-right text-xs font-black text-lime-600">Verified</td>
                                   </tr>
                                ))}
                             </tbody>
                          </table>
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Marketplace' && userRole === 'Buyer' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black tracking-tight text-[#0A1D11]">Trade Hub</h2>
                  <p className="text-neutral-500 font-medium">Verified agricultural commodities from direct sources.</p>
                </div>
                <div className="bg-lime-100 text-lime-700 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">
                   {marketProducts.length} Listings Live
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {marketProducts.map(p => (
                  <div key={p.id} className="bg-white rounded-[3rem] border border-neutral-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all group hover:-translate-y-1">
                    <div className="h-56 relative bg-neutral-100 overflow-hidden">
                       <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                       <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[#0A1D11] text-[10px] font-black uppercase tracking-widest shadow-lg">
                         {p.category}
                       </div>
                    </div>
                    <div className="p-10 space-y-6">
                       <div className="space-y-1">
                          <h4 className="text-2xl font-black text-[#0A1D11]">{p.name}</h4>
                          <div className="flex items-center gap-2 text-neutral-400">
                             <MapPin className="w-3.5 h-3.5 text-lime-600" />
                             <span className="text-[10px] font-black uppercase tracking-widest">{p.profiles?.location}</span>
                          </div>
                       </div>
                       
                       <div className="flex items-center justify-between border-y border-neutral-50 py-5">
                          <div className="space-y-0.5">
                            <p className="font-black text-2xl text-[#0A1D11]">₦{p.price.toLocaleString()}</p>
                            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">per {p.unit}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] text-lime-600 font-black uppercase tracking-widest">In Stock</p>
                             <p className="font-black text-[#0A1D11]">{p.stock.toLocaleString()}</p>
                          </div>
                       </div>
                       
                       <button onClick={() => {setCheckoutProduct(p); setOrderQty(1);}} className="w-full py-5 bg-[#0A1D11] text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-lime-400 hover:text-[#0A1D11] transition-all shadow-xl shadow-neutral-100 flex items-center justify-center gap-3">
                          <ShoppingCart className="w-5 h-5" /> Buy Produce
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
