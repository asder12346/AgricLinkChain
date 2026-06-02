import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, ShoppingCart, Package, User as UserIcon, Bell,
  LogOut, Leaf, Plus, TrendingUp, Clock, Menu, X, Settings,
  Trash2, RefreshCw, Users, Loader2, Save, ShoppingBag, Box, Image as ImageIcon,
  PlusCircle, CheckCircle2, Edit2, Calendar, MapPin, ExternalLink, Wallet, CreditCard,
  ChevronRight, ArrowLeft, Truck, Star, ShieldCheck, UserPlus, Share2, Copy, Camera, Upload,
  Sprout, Ruler, Info, Search, MoreVertical, Landmark, Banknote, Heart, MessageSquare,
  Database, FileText
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Marketplace from '../components/Marketplace';

interface DashboardProps {
  user: any;
  onSignOut: () => void;
  onGoHome: () => void;
}

const isFarmerRole = (role?: string) => role === 'Farmer' || role === 'User';
const isBuyerRole = (role?: string) => role === 'Buyer' || role === 'User';
const isTradeRole = (role?: string) => isFarmerRole(role) || isBuyerRole(role);
const AVATAR_BUCKET = 'app-files';

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
  const [savedProductIds, setSavedProductIds] = useState<string[]>(() => {
    const stored = localStorage.getItem('agri_saved_products');
    return stored ? JSON.parse(stored) : [];
  });
  const [cartItems, setCartItems] = useState<any[]>(() => {
    const stored = localStorage.getItem('agri_cart_items');
    return stored ? JSON.parse(stored) : [];
  });
  const [messageDraft, setMessageDraft] = useState('');
  const [settingsState, setSettingsState] = useState({
    emailAlerts: true,
    smsUpdates: false,
    autoReorder: false,
    publicProfile: true,
  });
  const [paymentMethod, setPaymentMethod] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
  });
  const [loanRequest, setLoanRequest] = useState({
    amount: '',
    purpose: '',
    cropType: '',
  });

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

  useEffect(() => {
    localStorage.setItem('agri_saved_products', JSON.stringify(savedProductIds));
  }, [savedProductIds]);

  useEffect(() => {
    localStorage.setItem('agri_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

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

      if (isTradeRole(userRole)) {
        if (isFarmerRole(userRole)) {
          const { data: list } = await supabase.from('listings').select('*').eq('farmer_id', user.id).order('created_at', { ascending: false });
          if (list) setListings(list);
        } else {
          setListings([]);
        }

        const { data: ordsSeller } = isFarmerRole(userRole)
          ? await supabase.from('orders').select('*').eq('farmer_id', user.id)
          : { data: [] as any[] };
        const { data: ordsBuyer } = isBuyerRole(userRole)
          ? await supabase.from('orders').select('*').eq('buyer_id', user.id)
          : { data: [] as any[] };
        const allOrds = [...(ordsSeller || []), ...(ordsBuyer || [])];
        const uniqueOrds = Array.from(new Set(allOrds.map(a => a.id))).map(id => allOrds.find(a => a.id === id));
        setOrders(uniqueOrds.filter(Boolean) as any[]);

        const { data: marketplace } = await supabase.from('listings').select(`*, profiles:farmer_id (full_name, location)`);
        const defaultMarket = [
          { id: 'm1', name: 'Premium Cocoa Beans', price: 5200, unit: 'kg', stock: 5000, category: 'Grains', image_url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=600', profiles: { full_name: 'Ondo Cocoa Estate', location: 'Ondo State' } },
          { id: 'm2', name: 'Bulk White Maize', price: 38000, unit: 'ton', stock: 15, category: 'Grains', image_url: 'https://images.unsplash.com/photo-1551739440-5dd934d3a94a?auto=format&fit=crop&q=80&w=600', profiles: { full_name: 'Zaria Harvesters', location: 'Kaduna State' } },
        ];
        setMarketProducts(marketplace && marketplace.length > 0 ? marketplace : defaultMarket);
      } else if (userRole === 'Agent') {
        const myCode = prof?.referral_code;
        if (myCode) {
          // Fetch members
          const { data: network } = await supabase.from('profiles').select('*').eq('referred_by', myCode).order('created_at', { ascending: false });
          if (network) setOnboardedEntities(network);

          // Fetch volume for these members
          const farmerIds = network?.filter(p => p.user_type === 'Farmer' || p.user_type === 'User').map(p => p.id) || [];
          if (farmerIds.length > 0) {
            const { data: networkOrders } = await supabase.from('orders').select('*').in('farmer_id', farmerIds);
            if (networkOrders) setOrders(networkOrders);
          }
        }
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

      if (file.size > 2 * 1024 * 1024) {
        throw new Error('Avatar image too large. Please upload an image smaller than 2MB.');
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload a valid image file.');
      }

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatars/profile.${fileExt}`;

      console.log(`Uploading avatar to: ${filePath} in bucket: ${AVATAR_BUCKET}`);

      let { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Avatar Storage Upload Error:", uploadError);
        throw new Error(`Avatar upload failed: ${uploadError.message}. Make sure the '${AVATAR_BUCKET}' bucket exists.`);
      }

      const { data } = supabase.storage
        .from(AVATAR_BUCKET)
        .getPublicUrl(filePath);
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

      console.log("Avatar upload successful. URL:", publicUrl);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        throw updateError;
      }

      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (authUpdateError) {
        console.error("Auth metadata update error:", authUpdateError);
      }

      setProfile((current: any) => current ? { ...current, avatar_url: publicUrl } : current);

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
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) {
        console.error("Storage Upload Error:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}. Ensure the 'app-files' bucket exists in Supabase.`);
      }

      const { data } = supabase.storage
        .from('app-files')
        .getPublicUrl(filePath);

      console.log("Upload successful. Public URL:", data.publicUrl);

      setNewListing({ ...newListing, image_url: `${data.publicUrl}?t=${Date.now()}` });
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
      setActiveTab('Purchase History');
      fetchProfileAndData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleSaved = (productId: string) => {
    setSavedProductIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    );
  };

  const handleAddToCart = (product: any) => {
    if (!product?.id) return;
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems((current) =>
      current
        .map((item) => item.id === productId ? { ...item, quantity: item.quantity + delta } : item)
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCheckoutCart = async () => {
    try {
      for (const item of cartItems) {
        await handleCreateOrder({ ...item, price: item.price * item.quantity });
      }
      setCartItems([]);
      setActiveTab('Purchase History');
    } catch (err: any) {
      alert(err.message || 'Unable to complete checkout');
    }
  };

  const handleSendMessage = () => {
    if (!messageDraft.trim()) return;
    alert('Message queued successfully.');
    setMessageDraft('');
  };

  const handleSavePaymentSettings = () => {
    alert('Payment settings updated successfully.');
  };

  const handleSubmitLoanRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('loan_requests').insert([{
        farmer_id: user.id,
        amount: Number(loanRequest.amount),
        purpose: loanRequest.purpose,
        crop_type: loanRequest.cropType,
        farm_size: profile?.farm_size || '',
      }]);
      if (error) throw error;
      alert('Loan request submitted.');
      setLoanRequest({ amount: '', purpose: '', cropType: '' });
    } catch (err: any) {
      alert(err.message || 'Unable to submit loan request');
    }
  };

  const userRole = profile?.user_type || user.user_metadata?.user_type;
  const canManageFarm = isFarmerRole(userRole);
  const canBuyProducts = isBuyerRole(userRole);
  const isFinancier = userRole === 'Financier';
  const isLogistics = userRole === 'Logistics';
  const isResearcher = userRole === 'Researcher';
  const isAdminData = userRole === 'Admin';
  const isVerified = true; // Simulating verification for dashboard aesthetics
  const farmerOrders = orders.filter((o) => o.farmer_id === user.id);
  const buyerOrders = orders.filter((o) => o.buyer_id === user.id);
  const savedProducts = marketProducts.filter((product) => savedProductIds.includes(product.id));
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const conversationCount = canManageFarm ? farmerOrders.length : buyerOrders.length;
  const messagePartners = (canManageFarm ? farmerOrders : buyerOrders).slice(0, 4);
  const roleStats = [
    { label: 'Authenticated Role', value: userRole || 'Farmer', icon: ShieldCheck },
    { label: 'Wallet Balance', value: `₦${orders.reduce((a, b) => a + (b.total_amount || 0), 0).toLocaleString()}`, icon: Wallet },
    { label: 'Active Records', value: `${orders.length || listings.length || onboardedEntities.length}`, icon: Database },
  ];
  const roleActionCards = [
    ...(canManageFarm ? [
      { title: 'Farmer', description: 'Manage products, incoming orders, payments, and financing requests.', tab: 'Farmer Dashboard', icon: Sprout },
      { title: 'Marketplace', description: 'Publish harvest lots and keep your farm inventory visible to buyers.', tab: 'My Farm Products', icon: Package },
    ] : []),
    ...(canBuyProducts ? [
      { title: 'Buyer', description: 'Source verified commodities, save listings, and checkout from your cart.', tab: 'Buyer Dashboard', icon: ShoppingBag },
      { title: 'Marketplace', description: 'Explore current produce supply and create purchase orders.', tab: 'Buyer Dashboard', icon: Search },
    ] : []),
    ...(isFinancier ? [
      { title: 'Financier', description: 'Review loan demand, capital exposure, and farmer readiness signals.', tab: 'Financier', icon: Landmark },
    ] : []),
    ...(isLogistics ? [
      { title: 'Logistics', description: 'Coordinate delivery lanes, dispatch capacity, and shipment status.', tab: 'Logistics', icon: Truck },
    ] : []),
    ...(userRole === 'Agent' ? [
      { title: 'Ext. Agent', description: 'Onboard producers, share referral IDs, and inspect field network activity.', tab: 'My Network', icon: Users },
    ] : []),
    ...(isResearcher ? [
      { title: 'Research', description: 'Track market intelligence, production signals, and commodity insights.', tab: 'Research', icon: Info },
    ] : []),
    ...(isAdminData ? [
      { title: 'Admin Data', description: 'Monitor user data health, compliance status, and platform records.', tab: 'Admin Data', icon: ShieldCheck },
    ] : []),
    { title: 'Wallet', description: 'See settlement balance, recent activity, and connected payout setup.', tab: 'Wallet', icon: Wallet },
  ];

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    ...(userRole === 'Agent' ? [{ name: 'My Network', icon: Users }] : []),
    ...(isFinancier ? [{ name: 'Financier', icon: Landmark }] : []),
    ...(isLogistics ? [{ name: 'Logistics', icon: Truck }] : []),
    ...(isResearcher ? [{ name: 'Research', icon: Info }] : []),
    ...(isAdminData ? [{ name: 'Admin Data', icon: ShieldCheck }] : []),
    ...(canManageFarm ? [
      { name: 'Farmer Dashboard', icon: Sprout },
      { name: 'My Farm Products', icon: Package },
      { name: 'Messages', icon: MessageSquare },
      { name: 'Payments', icon: Wallet },
      { name: 'Loans & Financing', icon: Banknote }
    ] : []),
    ...(canBuyProducts ? [
      { name: 'Buyer Dashboard', icon: ShoppingBag },
      { name: 'Saved Products', icon: Heart },
      { name: 'Cart', icon: ShoppingCart },
      { name: 'Purchase History', icon: Truck },
      { name: 'Messages', icon: MessageSquare },
      { name: 'Payments', icon: CreditCard },
    ] : []),
    { name: 'Wallet', icon: Wallet },
    { name: 'Profile', icon: UserIcon },
    { name: 'Settings', icon: Settings },
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
              <div className="rounded-full shadow-lg shadow-lime-400/20 overflow-hidden w-10 h-10 flex items-center justify-center">
                <img src="/logo.png" className="w-full h-full object-cover rounded-full" alt="Logo" />
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

              <div className="bg-[#0A1D11] rounded-[2rem] p-6 md:p-8 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-grid opacity-10" />
                <div className="relative grid lg:grid-cols-[0.95fr_1.05fr] gap-8">
                  <div className="space-y-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-lime-400 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#0A1D11]">
                      <ShieldCheck className="w-3.5 h-3.5" /> Authenticated {userRole} workspace
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tight">Your role controls this dashboard.</h3>
                      <p className="text-white/50 mt-3 text-sm leading-relaxed">
                        AgricLinkChain uses your signup role to show the tools, data, wallet records, and workflows that match your place in the agricultural value chain.
                      </p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {roleStats.map((stat) => (
                        <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                          <stat.icon className="w-4 h-4 text-lime-400 mb-3" />
                          <p className="text-[9px] font-black uppercase tracking-widest text-white/35">{stat.label}</p>
                          <p className="text-lg font-black mt-1">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {roleActionCards.map((card) => (
                      <button
                        key={`${card.title}-${card.tab}`}
                        onClick={() => setActiveTab(card.tab)}
                        className="text-left rounded-2xl border border-white/10 bg-white/[0.06] p-5 hover:bg-white/[0.1] hover:border-lime-400/30 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-lime-400 text-[#0A1D11] flex items-center justify-center mb-4">
                          <card.icon className="w-5 h-5" />
                        </div>
                        <h4 className="font-black">{card.title}</h4>
                        <p className="text-xs leading-relaxed text-white/45 mt-2">{card.description}</p>
                      </button>
                    ))}
                  </div>
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

              {canManageFarm && listings.length > 0 && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black flex items-center gap-3">
                      <Box className="w-6 h-6 text-lime-600" /> Your Active Inventory
                    </h3>
                    <button onClick={() => setActiveTab('My Farm Products')} className="text-xs font-black uppercase tracking-widest text-lime-600 hover:text-[#0A1D11] transition-colors">
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
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${isFarmerRole(entity.user_type) ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
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

          {activeTab === 'My Farm Products' && canManageFarm && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-[#0A1D11]">My Farm Products</h2>
                  <p className="text-neutral-500 font-medium">Manage your active commodity listings and stock levels.</p>
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

          {activeTab === 'Farmer Dashboard' && canManageFarm && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-[#0A1D11]">Farmer Dashboard</h2>
                  <p className="text-neutral-500 font-medium">Manage incoming orders connecting your farm to buyers.</p>
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
                    {orders.filter(o => o.farmer_id === user.id).map((order) => (
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
                    {orders.filter(o => o.farmer_id === user.id).length === 0 && (
                      <tr><td colSpan={6} className="px-10 py-24 text-center text-neutral-300 font-bold uppercase tracking-widest text-[10px]">No active trade requests found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Buyer Dashboard' && canBuyProducts && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-[3rem] p-8 border border-neutral-100 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Saved Products</p>
                  <p className="text-4xl font-black mt-3">{savedProducts.length}</p>
                </div>
                <div className="bg-white rounded-[3rem] p-8 border border-neutral-100 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Cart Items</p>
                  <p className="text-4xl font-black mt-3">{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
                </div>
                <div className="bg-[#0A1D11] rounded-[3rem] p-8 shadow-2xl text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Cart Value</p>
                  <p className="text-4xl font-black mt-3 text-lime-400">₦{cartTotal.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-[#0A1D11]">Buyer Dashboard</h2>
                    <p className="text-neutral-500 font-medium">Discover products, save promising listings, and queue orders for checkout.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {marketProducts.slice(0, 6).map((product) => (
                    <div key={product.id} className="rounded-[2rem] border border-neutral-100 bg-neutral-50 overflow-hidden">
                      <div className="h-44 bg-neutral-100">
                        <img src={product.image_url} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-lg font-black">{product.name}</h3>
                          <p className="text-xs text-neutral-500">{product.profiles?.location || 'Regional Origin'}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-black text-lime-600">₦{product.price.toLocaleString()}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{product.stock} {product.unit}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <button onClick={() => handleToggleSaved(product.id)} className={`rounded-2xl py-3 text-[10px] font-black uppercase tracking-widest transition-all ${savedProductIds.includes(product.id) ? 'bg-red-50 text-red-500' : 'bg-white text-neutral-500 border border-neutral-100'}`}>Save</button>
                          <button onClick={() => handleAddToCart(product)} className="rounded-2xl py-3 text-[10px] font-black uppercase tracking-widest bg-neutral-900 text-white">Cart</button>
                          <button onClick={() => handleCreateOrder(product)} className="rounded-2xl py-3 text-[10px] font-black uppercase tracking-widest bg-lime-400 text-[#0A1D11]">Order</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Marketplace products={marketProducts} userRole={userRole} onOrder={handleCreateOrder} />
            </div>
          )}

          {activeTab === 'Saved Products' && canBuyProducts && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div>
                <h2 className="text-3xl font-black text-[#0A1D11]">Saved Products</h2>
                <p className="text-neutral-500 font-medium">Keep track of listings you may want to buy next.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {savedProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-[3rem] p-8 border border-neutral-100 shadow-sm space-y-6">
                    <div className="h-48 rounded-[2rem] overflow-hidden bg-neutral-100">
                      <img src={product.image_url} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">{product.name}</h3>
                      <p className="text-sm text-neutral-500">{product.profiles?.full_name || 'Verified Producer'}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-lime-600">₦{product.price.toLocaleString()}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{product.stock} {product.unit}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => handleAddToCart(product)} className="py-4 rounded-2xl bg-[#0A1D11] text-white text-[10px] font-black uppercase tracking-widest">Add to Cart</button>
                      <button onClick={() => handleToggleSaved(product.id)} className="py-4 rounded-2xl bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest">Remove</button>
                    </div>
                  </div>
                ))}
                {savedProducts.length === 0 && (
                  <div className="md:col-span-3 bg-white rounded-[3rem] p-20 border border-neutral-100 shadow-sm text-center">
                    <Heart className="w-12 h-12 text-neutral-200 mx-auto mb-6" />
                    <p className="text-lg font-black text-[#0A1D11]/30 uppercase tracking-widest">No saved products yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Cart' && canBuyProducts && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-[#0A1D11]">Cart</h2>
                  <p className="text-neutral-500 font-medium">Review quantities and convert selections into confirmed orders.</p>
                </div>
                <div className="bg-[#0A1D11] text-white px-8 py-5 rounded-[2rem]">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Total</p>
                  <p className="text-3xl font-black text-lime-400">₦{cartTotal.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-[3rem] p-8 border border-neutral-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-[2rem] overflow-hidden bg-neutral-100">
                        <img src={item.image_url} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black">{item.name}</h3>
                        <p className="text-sm text-neutral-500">{item.profiles?.location || 'Regional Origin'}</p>
                        <p className="text-sm font-black text-lime-600 mt-2">₦{item.price.toLocaleString()} each</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => handleUpdateCartQuantity(item.id, -1)} className="w-12 h-12 rounded-2xl bg-neutral-100 font-black">-</button>
                      <span className="w-10 text-center font-black">{item.quantity}</span>
                      <button onClick={() => handleUpdateCartQuantity(item.id, 1)} className="w-12 h-12 rounded-2xl bg-neutral-100 font-black">+</button>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Line Total</p>
                      <p className="text-2xl font-black">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {cartItems.length === 0 && (
                  <div className="bg-white rounded-[3rem] p-20 border border-neutral-100 shadow-sm text-center">
                    <ShoppingCart className="w-12 h-12 text-neutral-200 mx-auto mb-6" />
                    <p className="text-lg font-black text-[#0A1D11]/30 uppercase tracking-widest">Your cart is empty</p>
                  </div>
                )}
              </div>
              {cartItems.length > 0 && (
                <button onClick={handleCheckoutCart} className="w-full bg-lime-400 text-[#0A1D11] py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest">
                  Checkout Cart
                </button>
              )}
            </div>
          )}

          {activeTab === 'Purchase History' && canBuyProducts && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-[#0A1D11]">Purchase History</h2>
                  <p className="text-neutral-500 font-medium">Tracking your active and completed acquisitions.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {orders.filter(o => o.buyer_id === user.id).map((order) => (
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
                {orders.filter(o => o.buyer_id === user.id).length === 0 && (
                  <div className="md:col-span-3 py-32 text-center space-y-6">
                    <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-neutral-100"><Clock className="w-10 h-10 opacity-10" /></div>
                    <div className="space-y-2">
                      <p className="text-lg font-black uppercase text-[#0A1D11]/20 tracking-widest">No Acquisitions Found</p>
                      <button onClick={() => setActiveTab('Buyer Dashboard')} className="text-lime-600 font-bold hover:underline">Explore Marketplace</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Messages' && (canManageFarm || canBuyProducts) && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
                <div className="bg-white rounded-[3rem] border border-neutral-100 shadow-sm p-6 space-y-4">
                  <h2 className="text-2xl font-black">Messages</h2>
                  <p className="text-sm text-neutral-500">Trade conversations tied to your live transactions.</p>
                  <div className="space-y-3">
                    {messagePartners.map((order) => (
                      <button key={order.id} className="w-full text-left p-4 rounded-2xl bg-neutral-50 hover:bg-lime-50 transition-all">
                        <p className="font-black text-sm">{canManageFarm ? `Buyer ${order.buyer_id?.slice(0, 8)}` : `Farmer ${order.farmer_id?.slice(0, 8)}`}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-1">Order #{order.id.slice(0, 8)}</p>
                      </button>
                    ))}
                    {messagePartners.length === 0 && (
                      <div className="p-6 rounded-2xl bg-neutral-50 text-center text-sm font-bold text-neutral-400">No conversations yet.</div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] border border-neutral-100 shadow-sm p-8 flex flex-col gap-8">
                  <div>
                    <h3 className="text-2xl font-black">Trade Coordination</h3>
                    <p className="text-neutral-500 font-medium">Share logistics, delivery notes, and payment updates.</p>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="max-w-xl bg-neutral-100 rounded-[2rem] p-5">
                      <p className="text-sm font-medium">Hello, I want to confirm packaging, delivery timing, and payment readiness for the next shipment.</p>
                    </div>
                    <div className="max-w-xl ml-auto bg-lime-400 rounded-[2rem] p-5 text-[#0A1D11]">
                      <p className="text-sm font-black">Confirmed. Records are ready and the next update will be shared here.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <input value={messageDraft} onChange={(e) => setMessageDraft(e.target.value)} placeholder="Write a message..." className="flex-1 bg-neutral-50 border border-neutral-100 rounded-[2rem] px-6 py-4 outline-none" />
                    <button onClick={handleSendMessage} className="px-8 py-4 rounded-[2rem] bg-[#0A1D11] text-white font-black text-xs uppercase tracking-widest">Send</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Payments' && (canManageFarm || canBuyProducts) && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white rounded-[3rem] p-8 border border-neutral-100 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Completed Transactions</p>
                  <p className="text-4xl font-black mt-3">{orders.filter((o) => o.status === 'delivered' || o.status === 'Completed').length}</p>
                </div>
                <div className="bg-white rounded-[3rem] p-8 border border-neutral-100 shadow-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Pending Settlements</p>
                  <p className="text-4xl font-black mt-3">{orders.filter((o) => o.status === 'pending').length}</p>
                </div>
                <div className="bg-[#0A1D11] rounded-[3rem] p-8 shadow-2xl text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Recorded Value</p>
                  <p className="text-4xl font-black mt-3 text-lime-400">₦{orders.reduce((sum, order) => sum + (order.total_amount || 0), 0).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm space-y-6">
                  <h3 className="text-2xl font-black">Settlement Details</h3>
                  <div className="space-y-4">
                    <input value={paymentMethod.bankName} onChange={(e) => setPaymentMethod({ ...paymentMethod, bankName: e.target.value })} placeholder="Bank name" className="w-full bg-neutral-50 border border-neutral-100 rounded-[2rem] px-6 py-4 outline-none" />
                    <input value={paymentMethod.accountName} onChange={(e) => setPaymentMethod({ ...paymentMethod, accountName: e.target.value })} placeholder="Account name" className="w-full bg-neutral-50 border border-neutral-100 rounded-[2rem] px-6 py-4 outline-none" />
                    <input value={paymentMethod.accountNumber} onChange={(e) => setPaymentMethod({ ...paymentMethod, accountNumber: e.target.value })} placeholder="Account number" className="w-full bg-neutral-50 border border-neutral-100 rounded-[2rem] px-6 py-4 outline-none" />
                  </div>
                  <button onClick={handleSavePaymentSettings} className="w-full bg-lime-400 text-[#0A1D11] py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest">Save Payment Setup</button>
                </div>
                <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm">
                  <h3 className="text-2xl font-black mb-8">Recent Settlement Activity</h3>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50">
                        <div>
                          <p className="font-black text-sm">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{order.status}</p>
                        </div>
                        <p className="font-black">₦{(order.total_amount || 0).toLocaleString()}</p>
                      </div>
                    ))}
                    {orders.length === 0 && <p className="text-sm font-bold text-neutral-400">No settlement activity yet.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Loans & Financing' && canManageFarm && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-black text-[#0A1D11]">Loans & Financing</h2>
                  <p className="text-neutral-500 font-medium">Apply for agricultural loans and track your financing status.</p>
                </div>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                <form onSubmit={handleSubmitLoanRequest} className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm space-y-6">
                  <h3 className="text-2xl font-black">Request Financing</h3>
                  <input required type="number" value={loanRequest.amount} onChange={(e) => setLoanRequest({ ...loanRequest, amount: e.target.value })} placeholder="Requested amount" className="w-full bg-neutral-50 border border-neutral-100 rounded-[2rem] px-6 py-4 outline-none" />
                  <input required type="text" value={loanRequest.cropType} onChange={(e) => setLoanRequest({ ...loanRequest, cropType: e.target.value })} placeholder="Crop or produce type" className="w-full bg-neutral-50 border border-neutral-100 rounded-[2rem] px-6 py-4 outline-none" />
                  <textarea required value={loanRequest.purpose} onChange={(e) => setLoanRequest({ ...loanRequest, purpose: e.target.value })} placeholder="What will the financing support?" className="w-full bg-neutral-50 border border-neutral-100 rounded-[2rem] px-6 py-4 outline-none min-h-32" />
                  <button type="submit" className="w-full bg-lime-400 text-[#0A1D11] py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest">Submit Loan Request</button>
                </form>
                <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm">
                  <h3 className="text-2xl font-black mb-8">Funding Checklist</h3>
                  <div className="space-y-4">
                    {[
                      'Updated profile and farm records',
                      'Visible commodity listings',
                      'Clear production purpose for funds',
                      'Reachable settlement account details',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-50">
                        <CheckCircle2 className="w-5 h-5 text-lime-600" />
                        <p className="font-bold text-sm">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Financier' && isFinancier && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div>
                <h2 className="text-3xl font-black text-[#0A1D11]">Financier Workspace</h2>
                <p className="text-neutral-500 font-medium">Assess farmer readiness, loan demand, and capital deployment opportunities.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { label: 'Open Applications', value: '24', icon: FileText },
                  { label: 'Capital Pipeline', value: '₦48.5m', icon: Landmark },
                  { label: 'Risk Watchlist', value: '6', icon: ShieldCheck },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm">
                    <item.icon className="w-7 h-7 text-lime-600 mb-5" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{item.label}</p>
                    <p className="text-4xl font-black mt-3">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm">
                <h3 className="text-2xl font-black mb-6">Funding Queue</h3>
                <div className="space-y-4">
                  {['Cocoa harvest bridge loan', 'Cassava processing input support', 'Rice cluster irrigation upgrade'].map((item, index) => (
                    <div key={item} className="flex items-center justify-between rounded-2xl bg-neutral-50 p-5">
                      <div>
                        <p className="font-black">{item}</p>
                        <p className="text-xs text-neutral-500 mt-1">Verification score {92 - index * 7}%</p>
                      </div>
                      <button className="px-5 py-3 rounded-2xl bg-[#0A1D11] text-white text-[10px] font-black uppercase tracking-widest">Review</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Logistics' && isLogistics && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div>
                <h2 className="text-3xl font-black text-[#0A1D11]">Logistics Workspace</h2>
                <p className="text-neutral-500 font-medium">Plan pickup routes, monitor load capacity, and coordinate delivery milestones.</p>
              </div>
              <div className="grid lg:grid-cols-[1fr_0.9fr] gap-8">
                <div className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm">
                  <h3 className="text-2xl font-black mb-6">Active Delivery Lanes</h3>
                  <div className="space-y-4">
                    {[
                      ['Kaduna grain route', '14 trucks assigned', 'In transit'],
                      ['Ondo cocoa corridor', '8 trucks ready', 'Loading'],
                      ['Benue cassava lane', '5 trucks open', 'Awaiting dispatch'],
                    ].map(([lane, capacity, status]) => (
                      <div key={lane} className="grid sm:grid-cols-[1fr_auto] gap-4 rounded-2xl bg-neutral-50 p-5">
                        <div>
                          <p className="font-black">{lane}</p>
                          <p className="text-xs text-neutral-500 mt-1">{capacity}</p>
                        </div>
                        <span className="self-start rounded-full bg-lime-100 px-4 py-2 text-[9px] font-black uppercase tracking-widest text-lime-700">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#0A1D11] rounded-[2rem] p-8 text-white shadow-2xl">
                  <Truck className="w-10 h-10 text-lime-400 mb-6" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/35">Fleet Capacity</p>
                  <p className="text-5xl font-black text-lime-400 mt-3">72%</p>
                  <p className="text-white/45 mt-4 text-sm">Capacity across current verified agricultural delivery requests.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Research' && isResearcher && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div>
                <h2 className="text-3xl font-black text-[#0A1D11]">Research Workspace</h2>
                <p className="text-neutral-500 font-medium">Study production patterns, price movement, and field intelligence from connected nodes.</p>
              </div>
              <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                {['Yield Signals', 'Price Trends', 'Soil Notes', 'Demand Clusters'].map((item, index) => (
                  <div key={item} className="bg-white rounded-[2rem] p-6 border border-neutral-100 shadow-sm">
                    <Search className="w-6 h-6 text-lime-600 mb-5" />
                    <p className="font-black">{item}</p>
                    <p className="text-3xl font-black mt-4">{[128, 42, 17, 9][index]}</p>
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-black mt-1">Records</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm">
                <h3 className="text-2xl font-black mb-6">Current Insight Brief</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Sesame, maize, and cassava clusters are showing stronger buyer activity. Research accounts can use this space to prepare reports, compare field evidence, and export decision notes for platform teams.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Admin Data' && isAdminData && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div>
                <h2 className="text-3xl font-black text-[#0A1D11]">Admin Data Workspace</h2>
                <p className="text-neutral-500 font-medium">Monitor platform records, verification health, and user data quality.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { label: 'Profiles', value: '300k+' },
                  { label: 'Verified Nodes', value: '99.2%' },
                  { label: 'Data Flags', value: '18' },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm">
                    <Database className="w-7 h-7 text-lime-600 mb-5" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{item.label}</p>
                    <p className="text-4xl font-black mt-3">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm">
                <h3 className="text-2xl font-black mb-6">Governance Checks</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {['Duplicate profile review', 'Incomplete onboarding records', 'Payment identity checks', 'Listing compliance audit'].map((item) => (
                    <div key={item} className="flex items-center gap-4 rounded-2xl bg-neutral-50 p-5">
                      <CheckCircle2 className="w-5 h-5 text-lime-600" />
                      <p className="font-bold text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Wallet' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
                <div className="bg-[#0A1D11] rounded-[2rem] p-8 text-white shadow-2xl">
                  <Wallet className="w-10 h-10 text-lime-400 mb-8" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/35">Available Wallet Balance</p>
                  <p className="text-5xl font-black text-lime-400 mt-3">₦{(orders.reduce((a, b) => a + (b.total_amount || 0), 0) + cartTotal).toLocaleString()}</p>
                  <p className="text-white/45 mt-5 text-sm">Your wallet reflects recorded trade value, cart commitments, and role-linked settlement activity.</p>
                </div>
                <div className="bg-white rounded-[2rem] p-8 border border-neutral-100 shadow-sm">
                  <h2 className="text-3xl font-black text-[#0A1D11]">Wallet Activity</h2>
                  <div className="mt-8 space-y-4">
                    {(orders.length > 0 ? orders.slice(0, 4) : [
                      { id: 'wallet-demo-1', status: 'pending', total_amount: 0, created_at: new Date().toISOString() },
                    ]).map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between rounded-2xl bg-neutral-50 p-5">
                        <div>
                          <p className="font-black text-sm">Wallet record #{String(order.id).slice(0, 8)}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{order.status}</p>
                        </div>
                        <p className="font-black">₦{(order.total_amount || 0).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
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

          {activeTab === 'Settings' && (
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
              <div>
                <h2 className="text-3xl font-black text-[#0A1D11]">Settings</h2>
                <p className="text-neutral-500 font-medium">Control alerts, visibility, and operational preferences.</p>
              </div>
              <div className="bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm space-y-6">
                {[
                  { key: 'emailAlerts', label: 'Email alerts' },
                  { key: 'smsUpdates', label: 'SMS updates' },
                  { key: 'autoReorder', label: 'Auto reorder recommendations' },
                  { key: 'publicProfile', label: 'Public profile visibility' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-5 rounded-[2rem] bg-neutral-50">
                    <div>
                      <p className="font-black">{item.label}</p>
                      <p className="text-sm text-neutral-500">Manage how this account behaves across the marketplace.</p>
                    </div>
                    <button
                      onClick={() => setSettingsState({ ...settingsState, [item.key]: !settingsState[item.key as keyof typeof settingsState] })}
                      className={`w-16 h-9 rounded-full transition-all ${settingsState[item.key as keyof typeof settingsState] ? 'bg-lime-400' : 'bg-neutral-200'}`}
                    >
                      <div className={`w-7 h-7 rounded-full bg-white shadow-sm transition-transform ${settingsState[item.key as keyof typeof settingsState] ? 'translate-x-8' : 'translate-x-1'}`}></div>
                    </button>
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
