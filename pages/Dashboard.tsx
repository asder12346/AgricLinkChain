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
import Marketplace from '../components/Marketplace';

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

  // New Listing Form State
  const [showNewListing, setShowNewListing] = useState(false);
  const [uploadingProductImage, setUploadingProductImage] = useState(false);
  const [newListing, setNewListing] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'kg',
    stock: '',
    category: 'Grains',
    image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=600'
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

        // Also fetch marketplace data for farmer to see their products
        const { data: marketplace } = await supabase.from('listings').select(`*, profiles:farmer_id (full_name, location)`);
        if (marketplace) setMarketProducts(marketplace);
      } else if (userRole === 'Agent') {
        const myCode = prof?.referral_code;
        if (myCode) {
          // Fetch members
          const { data: network } = await supabase.from('profiles').select('*').eq('referred_by', myCode).order('created_at', { ascending: false });
          if (network) setOnboardedEntities(network);

          // Fetch volume for these members
          const farmerIds = network?.filter(p => p.user_type === 'Farmer').map(p => p.id) || [];
          if (farmerIds.length > 0) {
            const { data: networkOrders } = await supabase.from('orders').select('*').in('farmer_id', farmerIds);
            if (networkOrders) setOrders(networkOrders);
          }
        }
      } else if (userRole === 'Buyer') {
        const { data: marketplace } = await supabase.from('listings').select(`*, profiles:farmer_id (full_name, location)`);
        const defaultMarket = [
          { id: 'm1', name: 'Premium Cocoa Beans', price: 5200, unit: 'kg', stock: 5000, category: 'Grains', image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=600', profiles: { full_name: 'Ondo Cocoa Estate', location: 'Ondo State' } },
          { id: 'm2', name: 'Bulk White Maize', price: 38000, unit: 'ton', stock: 15, category: 'Grains', image_url: 'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?auto=format&fit=crop&q=80&w=600', profiles: { full_name: 'Zaria Harvesters', location: 'Kaduna State' } },
        ];
        setMarketProducts(marketplace && marketplace.length > 0 ? marketplace : defaultMarket);
        const { data: myOrders } = await supabase.from('orders').select('*').eq('buyer_id', user.id).order('created_at', { ascending: false });
        if (myOrders) setOrders(myOrders);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event: any) => {
    try {
      setUploading(true);
      console.log("Starting avatar upload...");

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];

      // Basic size check (e.g., 2MB for avatars)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Avatar image too large. Please upload an image smaller than 2MB.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `avatar_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log(`Uploading avatar to: ${filePath} in bucket: app-files`);

      let { error: uploadError } = await supabase.storage
        .from('app-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Avatar Storage Upload Error:", uploadError);
        throw new Error(`Avatar upload failed: ${uploadError.message}. Make sure the 'app-files' bucket exists.`);
      }

      const { data } = supabase.storage
        .from('app-files')
        .getPublicUrl(filePath);

      console.log("Avatar upload successful. URL:", data.publicUrl);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
      }

      alert('Profile photo updated successfully!');
      fetchProfileAndData();
    } catch (err: any) {
      console.error("Handle Avatar Upload Catch:", err);
      alert(`Error updating profile photo: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleProductImageUpload = async (event: any) => {
    try {
      setUploadingProductImage(true);
      console.log("Starting product image upload...");

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];

      // Basic size check (e.g., 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size too large. Please upload an image smaller than 5MB.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      console.log(`Uploading to path: ${filePath} in bucket: app-files`);

      let { error: uploadError } = await supabase.storage
        .from('app-files')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Storage Upload Error:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}. Ensure the 'app-files' bucket exists in Supabase.`);
      }

      const { data } = supabase.storage
        .from('app-files')
        .getPublicUrl(filePath);

      console.log("Upload successful. Public URL:", data.publicUrl);

      setNewListing({ ...newListing, image_url: data.publicUrl });
      alert('Product image uploaded successfully!');
    } catch (err: any) {
      console.error("Handle Product Image Upload Catch:", err);
      alert(`Error detail: ${err.message}`);
    } finally {
      setUploadingProductImage(false);
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

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    console.log("Attempting to create listing:", newListing);
    try {
      const { error } = await supabase.from('listings').insert([{
        ...newListing,
        farmer_id: user.id,
        price: parseFloat(newListing.price),
        stock: parseInt(newListing.stock)
      }]);

      if (error) {
        console.error("Supabase Insertion Error:", error);
        throw error;
      }

      alert('Listing published successfully!');
      setShowNewListing(false);
      setNewListing({
        name: '', description: '', price: '', unit: 'kg', stock: '', category: 'Grains',
        image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=600'
      });
      fetchProfileAndData();
    } catch (err: any) {
      console.error("Handle Create Listing Catch:", err);
      alert(`Failed to save listing: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      const { error } = await supabase.from('listings').delete().eq('id', id);
      if (error) throw error;
      fetchProfileAndData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateOrder = async (product: any) => {
    if (!product.id) return;
    try {
      const { error } = await supabase.from('orders').insert([{
        buyer_id: user.id,
        farmer_id: product.farmer_id,
        product_id: product.id,
        quantity: 1, // Defaulting to 1 for demo
        total_amount: product.price,
        status: 'pending'
      }]);
      if (error) throw error;
      alert('Order initiated successfully!');
      setActiveTab('My Orders');
      fetchProfileAndData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const userRole = profile?.user_type || user.user_metadata?.user_type;
  const isVerified = true; // Simulating verification for dashboard aesthetics

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    ...(userRole === 'Agent' ? [{ name: 'My Network', icon: Users }] : []),
    ...(userRole === 'Farmer' ? [
      { name: 'My Listings', icon: Package },
      { name: 'Orders', icon: ShoppingCart },
      { name: 'Marketplace', icon: ShoppingBag }
    ] : []),
    ...(userRole === 'Buyer' ? [
      { name: 'Marketplace', icon: ShoppingBag },
      { name: 'My Orders', icon: ShoppingCart }
    ] : []),
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
              <div className="bg-lime-400 p-1 rounded-xl shadow-lg shadow-lime-400/20 overflow-hidden">
                <img src="/logo.png" className="w-8 h-8 object-contain" alt="Logo" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">AgricLinkChain</span>
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
                onClick={() => { setActiveTab(item.name); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
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
                  <h3 className="text-4xl font-black mt-3 text-lime-400">₦{(orders.reduce((a, b) => a + (b.total_amount || 0), 0)).toLocaleString()}</h3>
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
                            <p className="font-bold text-sm">Transfer Reference</p>
                            <p className="text-[10px] text-neutral-400 uppercase font-black">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-sm">₦{order.total_amount.toLocaleString()}</p>
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

              {userRole === 'Farmer' && listings.length > 0 && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black flex items-center gap-3">
                      <Box className="w-6 h-6 text-lime-600" /> Your Active Inventory
                    </h3>
                    <button onClick={() => setActiveTab('My Listings')} className="text-xs font-black uppercase tracking-widest text-lime-600 hover:text-[#0A1D11] transition-colors">
                      View All Listings
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.slice(0, 3).map(item => (
                      <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-neutral-100 shadow-sm group hover:border-lime-400 transition-all">
                        <div className="h-40 relative bg-neutral-100">
                          <img src={item.image_url} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6">
                          <h4 className="font-bold text-sm mb-2">{item.name}</h4>
                          <div className="flex items-center justify-between">
                            <p className="font-black text-lime-600 text-sm">₦{item.price.toLocaleString()}</p>
                            <p className="text-[10px] font-black text-neutral-400 uppercase">{item.stock} {item.unit}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                    <button onClick={() => { navigator.clipboard.writeText(agentCode); alert('Code Copied!') }} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><Copy className="w-4 h-4 text-lime-400" /></button>
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
                              <span className="text-sm font-black">
                                ₦{orders.filter(o => o.farmer_id === entity.id).reduce((acc, curr) => acc + (curr.total_amount || 0), 0).toLocaleString()} Volume
                              </span>
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
                              <button onClick={() => { navigator.clipboard.writeText(agentCode); alert('Copied!') }} className="px-8 py-3 bg-[#0A1D11] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-lime-400 hover:text-[#0A1D11] transition-all">Copy Referral Identity</button>
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

          {activeTab === 'My Listings' && userRole === 'Farmer' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-[#0A1D11]">Inventory Management</h2>
                  <p className="text-neutral-500 font-medium">Manage your active listings and stock levels.</p>
                </div>
                <button
                  onClick={() => setShowNewListing(true)}
                  className="bg-lime-400 text-[#0A1D11] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-lime-400/20 hover:scale-105 transition-all"
                >
                  <PlusCircle className="w-5 h-5" /> New Trade Listing
                </button>
              </div>

              {showNewListing && (
                <form onSubmit={handleCreateListing} className="bg-white rounded-[3rem] p-10 border-2 border-lime-400/20 shadow-2xl space-y-8 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black">Publish New Commodity</h3>
                    <button type="button" onClick={() => setShowNewListing(false)}><X className="w-6 h-6 text-neutral-300 hover:text-red-500 transition-colors" /></button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Commodity Name</label>
                        <input required type="text" value={newListing.name} onChange={(e) => setNewListing({ ...newListing, name: e.target.value })} placeholder="e.g. Export Grade Cocoa" className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 ring-lime-400/50" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Price (₦)</label>
                          <input required type="number" value={newListing.price} onChange={(e) => setNewListing({ ...newListing, price: e.target.value })} placeholder="5000" className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-4 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Unit</label>
                          <select value={newListing.unit} onChange={(e) => setNewListing({ ...newListing, unit: e.target.value })} className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-4 outline-none">
                            <option value="kg">per kg</option>
                            <option value="ton">per ton</option>
                            <option value="bag">per bag</option>
                            <option value="basket">per basket</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Available Stock</label>
                        <input required type="number" value={newListing.stock} onChange={(e) => setNewListing({ ...newListing, stock: e.target.value })} placeholder="1000" className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-4 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Commodity Image</label>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center justify-center overflow-hidden">
                            <img src={newListing.image_url} className="w-full h-full object-cover" />
                          </div>
                          <label className="flex-1 cursor-pointer">
                            <div className={`w-full py-4 px-6 border-2 border-dashed rounded-2xl flex items-center justify-center gap-2 transition-all ${uploadingProductImage ? 'bg-neutral-50 border-neutral-200' : 'hover:bg-lime-50 hover:border-lime-400 border-neutral-100'}`}>
                              {uploadingProductImage ? <Loader2 className="w-5 h-5 animate-spin text-lime-600" /> : <><ImageIcon className="w-4 h-4 text-lime-600" /><span className="text-[10px] font-black uppercase tracking-widest">Upload Grade Photo</span></>}
                              <input type="file" className="hidden" accept="image/*" onChange={handleProductImageUpload} disabled={uploadingProductImage} />
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button disabled={saving} type="submit" className="w-full bg-[#0A1D11] text-white py-5 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-lime-400 hover:text-[#0A1D11] transition-all flex items-center justify-center gap-3">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Launch Listing</>}
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {listings.map((item) => (
                  <div key={item.id} className="bg-white rounded-[3rem] border border-neutral-100 shadow-sm overflow-hidden group hover:border-lime-400 transition-all">
                    <div className="h-56 relative overflow-hidden bg-neutral-100">
                      <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-lg">
                        <span className="text-[9px] font-black uppercase text-[#0A1D11] tracking-widest">{item.category}</span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-lg font-bold mb-4">{item.name}</h3>
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Current Price</p>
                          <p className="text-xl font-black text-lime-600">₦{item.price.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">In Stock</p>
                          <p className="font-bold">{item.stock} {item.unit}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 pt-4 border-t border-neutral-50">
                        <button className="flex-1 py-4 bg-neutral-50 text-neutral-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-lime-100 hover:text-lime-700 transition-all flex items-center justify-center gap-2"><Edit2 className="w-4 h-4" /> Edit</button>
                        <button onClick={() => handleDeleteListing(item.id)} className="flex-1 py-4 bg-red-50 text-red-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-400 hover:text-white transition-all flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Orders' && userRole === 'Farmer' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-[#0A1D11]">Trade Requests</h2>
                  <p className="text-neutral-500 font-medium">Manage incoming orders from verified buyers.</p>
                </div>
              </div>

              <div className="bg-white rounded-[3.5rem] border border-neutral-100 shadow-sm overflow-hidden p-2">
                <table className="w-full text-left">
                  <thead className="bg-neutral-50 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-10 py-8">Trade ID</th>
                      <th className="px-10 py-8">Commodity</th>
                      <th className="px-10 py-8">Buyer</th>
                      <th className="px-10 py-8">Value</th>
                      <th className="px-10 py-8">Status</th>
                      <th className="px-10 py-8 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-10 py-8 font-mono text-xs text-neutral-300">#{order.id.slice(0, 8).toUpperCase()}</td>
                        <td className="px-10 py-8 font-black text-sm">{order.product_name || 'Agri Commodity'}</td>
                        <td className="px-10 py-8 text-xs font-bold">{order.buyer_id.slice(0, 8)}...</td>
                        <td className="px-10 py-8 font-black text-sm">₦{order.total_amount.toLocaleString()}</td>
                        <td className="px-10 py-8">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{order.status}</span>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <button className="p-3 text-neutral-300 hover:text-lime-600 hover:bg-lime-50 rounded-2xl transition-all"><ChevronRight className="w-5 h-5" /></button>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr><td colSpan={6} className="px-10 py-24 text-center text-neutral-300 font-bold uppercase tracking-widest text-[10px]">No active trade requests found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Marketplace' && (userRole === 'Farmer' || userRole === 'Buyer') && (
            <div className="animate-in fade-in duration-500">
              <Marketplace products={marketProducts} userRole={userRole} onOrder={handleCreateOrder} />
            </div>
          )}

          {activeTab === 'My Orders' && userRole === 'Buyer' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-[#0A1D11]">Purchasing History</h2>
                  <p className="text-neutral-500 font-medium">Tracking your active and completed acquisitions.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{order.status}</span>
                    </div>
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-[1.5rem] bg-neutral-50 flex items-center justify-center border border-neutral-100 group-hover:bg-lime-50 group-hover:border-lime-100 transition-all">
                        <Truck className="w-8 h-8 text-neutral-300 group-hover:text-lime-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black">{order.product_name || 'Supply Order'}</h3>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-8 border-t border-neutral-50">
                      <div>
                        <p className="text-[9px] font-black text-neutral-300 uppercase tracking-widest">Settlement Value</p>
                        <p className="text-2xl font-black text-[#0A1D11]">₦{order.total_amount.toLocaleString()}</p>
                      </div>
                      <button className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center text-neutral-300 hover:text-[#0A1D11] hover:bg-neutral-100 transition-all"><ExternalLink className="w-5 h-5" /></button>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="md:col-span-3 py-32 text-center space-y-6">
                    <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-neutral-100"><Clock className="w-10 h-10 opacity-10" /></div>
                    <div className="space-y-2">
                      <p className="text-lg font-black uppercase text-[#0A1D11]/20 tracking-widest">No Acquisitions Found</p>
                      <button onClick={() => setActiveTab('Marketplace')} className="text-lime-600 font-bold hover:underline">Explore Marketplace</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Profile' && (
            <div className="max-w-4xl mx-auto space-y-12 animate-in slide-in-from-bottom-6 duration-700">
              <div className="bg-[#0A1D11] rounded-[4rem] p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/10 blur-[100px] -mr-48 -mt-48"></div>
                <div className="flex flex-col md:flex-row items-center gap-10 relative">
                  <div className="relative group">
                    <div className="w-44 h-44 rounded-[2.5rem] bg-lime-400 p-1 shadow-2xl overflow-hidden shadow-lime-400/20 group-hover:scale-105 transition-transform duration-500">
                      <div className="w-full h-full rounded-[2.25rem] bg-[#0A1D11] flex items-center justify-center font-black text-5xl text-lime-400 overflow-hidden">
                        {profile?.avatar_url ? (
                          <img src={profile.avatar_url} className="w-full h-full object-cover" />
                        ) : (
                          profile?.full_name?.charAt(0)
                        )}
                      </div>
                    </div>
                    <label className="absolute -bottom-4 -right-4 w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center cursor-pointer hover:bg-lime-400 hover:text-[#0A1D11] transition-all group-hover:scale-110">
                      {uploading ? <Loader2 className="w-6 h-6 animate-spin text-[#0A1D11]" /> : <Camera className="w-6 h-6 text-[#0A1D11]" />}
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                    </label>
                  </div>
                  <div className="text-center md:text-left space-y-3">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <h2 className="text-4xl font-black tracking-tight">{profile?.full_name}</h2>
                      <div className="bg-lime-400 px-4 py-1 rounded-full flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#0A1D11]" />
                        <span className="text-[10px] font-black uppercase text-[#0A1D11] tracking-widest">Verified {userRole}</span>
                      </div>
                    </div>
                    <p className="text-white/40 font-mono text-sm tracking-wider uppercase">{user?.email}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4 text-[10px] font-black uppercase tracking-[0.2em]">
                      <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-lime-400" /> {profile?.location || 'Unmapped Node'}</span>
                      <span className="flex items-center gap-2 text-lime-400/60"><Calendar className="w-3.5 h-3.5" /> Established {new Date(profile?.created_at).getFullYear()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="bg-white rounded-[4rem] p-12 border border-neutral-100 shadow-sm space-y-12">
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] pl-2 mb-8">Personal Information</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#0A1D11]/40 uppercase tracking-widest ml-4">Authorized Name</label>
                        <input type="text" value={editProfile.full_name} onChange={(e) => setEditProfile({ ...editProfile, full_name: e.target.value })} className="w-full bg-neutral-50 border border-neutral-100 rounded-[2rem] px-8 py-5 outline-none focus:ring-4 ring-lime-400/10 focus:border-lime-400 transition-all font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#0A1D11]/40 uppercase tracking-widest ml-4">Primary Location</label>
                        <input type="text" value={editProfile.location} onChange={(e) => setEditProfile({ ...editProfile, location: e.target.value })} className="w-full bg-neutral-50 border border-neutral-100 rounded-[2rem] px-8 py-5 outline-none focus:ring-4 ring-lime-400/10 focus:border-lime-400 transition-all font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#0A1D11]/40 uppercase tracking-widest ml-4">Business / RC Number</label>
                        <input type="text" value={editProfile.business_registration_number} onChange={(e) => setEditProfile({ ...editProfile, business_registration_number: e.target.value })} className="w-full bg-neutral-50 border border-neutral-100 rounded-[2rem] px-8 py-5 outline-none focus:ring-4 ring-lime-400/10 focus:border-lime-400 transition-all font-bold" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.3em] pl-2 mb-8">Operation Parameters</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#0A1D11]/40 uppercase tracking-widest ml-4">Operation Size</label>
                          <input type="text" value={editProfile.farm_size} onChange={(e) => setEditProfile({ ...editProfile, farm_size: e.target.value })} placeholder="Hectares" className="w-full bg-neutral-50 border border-neutral-100 rounded-[2rem] px-8 py-5 outline-none focus:ring-4 ring-lime-400/10 focus:border-lime-400 transition-all font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-[#0A1D11]/40 uppercase tracking-widest ml-4">Region Category</label>
                          <input type="text" value={editProfile.farm_location} onChange={(e) => setEditProfile({ ...editProfile, farm_location: e.target.value })} placeholder="SW-Nigeria" className="w-full bg-neutral-50 border border-neutral-100 rounded-[2rem] px-8 py-5 outline-none focus:ring-4 ring-lime-400/10 focus:border-lime-400 transition-all font-bold" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#0A1D11]/40 uppercase tracking-widest ml-4">Main Focus Commodities</label>
                        <input type="text" value={editProfile.crops_farming} onChange={(e) => setEditProfile({ ...editProfile, crops_farming: e.target.value })} className="w-full bg-neutral-50 border border-neutral-100 rounded-[2rem] px-8 py-5 outline-none focus:ring-4 ring-lime-400/10 focus:border-lime-400 transition-all font-bold" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-[#0A1D11]/40 uppercase tracking-widest ml-4">Projected Cycle Commodities</label>
                        <input type="text" value={editProfile.crops_planting} onChange={(e) => setEditProfile({ ...editProfile, crops_planting: e.target.value })} className="w-full bg-neutral-50 border border-neutral-100 rounded-[2rem] px-8 py-5 outline-none focus:ring-4 ring-lime-400/10 focus:border-lime-400 transition-all font-bold" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button disabled={saving} type="submit" className="w-full bg-[#0A1D11] text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-lime-400 hover:text-[#0A1D11] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-lime-400/20">
                    {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <><RefreshCw className="w-6 h-6" /> Synchronize All Records</>}
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
