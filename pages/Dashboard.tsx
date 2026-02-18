
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart,
  Package, 
  Wallet, 
  Star, 
  User as UserIcon, 
  Bell, 
  LogOut, 
  Leaf, 
  Plus, 
  ChevronRight,
  TrendingUp,
  Clock,
  Home,
  Menu,
  X,
  PlusCircle,
  Settings,
  Shield,
  MapPin,
  Camera,
  Check,
  AlertCircle,
  Phone,
  Mail,
  Trash2,
  RefreshCw,
  MessageSquare,
  Info,
  CheckCheck,
  Upload,
  Image as ImageIcon,
  CreditCard,
  Search,
  CheckCircle2,
  Heart,
  Truck,
  Box,
  Timer,
  Users,
  Copy,
  BarChart4,
  Building2,
  History,
  Loader2,
  Edit2,
  Save
} from 'lucide-react';
import Marketplace from '../components/Marketplace';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  user: any;
  onSignOut: () => void;
  onGoHome: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'message' | 'market' | 'referral';
  is_read: boolean;
  created_at: string;
}

interface Order {
  id: string;
  farmer_id: string;
  buyer_id: string;
  product_name: string;
  quantity: number;
  unit: string;
  total_price: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  created_at: string;
}

interface OnboardedEntity {
  id: string;
  full_name: string;
  user_type: 'Farmer' | 'Pharmacy';
  location: string;
  joined_at: string;
  total_activity: number;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut, onGoHome }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [onboardedEntities, setOnboardedEntities] = useState<OnboardedEntity[]>([]);
  const [networkTransactions, setNetworkTransactions] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  
  // Add Listing State
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newListing, setNewListing] = useState({
    name: '',
    price: '',
    unit: 'kg',
    stock: '',
    description: '',
    category: 'Vegetables'
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Profile State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user.user_metadata?.full_name || 'Agri User',
    phone: user.user_metadata?.phone || '',
    avatarUrl: user.user_metadata?.avatar_url || '',
    bio: user.user_metadata?.bio || '',
    location: user.user_metadata?.location || 'Lagos, Nigeria'
  });
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(user.user_metadata?.avatar_url || null);

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const userType = user.user_metadata?.user_type || 'Farmer';
  const isFarmer = userType === 'Farmer';
  const isBuyer = userType === 'Buyer';
  const isAgent = userType === 'Agent';
  const isPharmacy = userType === 'Pharmacy';
  const agentCode = user.user_metadata?.referral_code || 'AGR-PENDING';

  useEffect(() => {
    if (isFarmer || isPharmacy) {
      fetchListings();
    }
    if (isAgent) {
      fetchAgentNetwork();
    }
    fetchOrders();
    fetchNotifications();

    const ordersSubscription = supabase
      .channel('realtime-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newOrder = payload.new as Order;
            if (newOrder.farmer_id === user.id || newOrder.buyer_id === user.id) {
              setOrders(prev => [newOrder, ...prev]);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedOrder = payload.new as Order;
            setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
    };
  }, [isFarmer, isAgent, isPharmacy]);

  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.is_read).length);
  }, [notifications]);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('farmer_id', user.id)
      .order('created_at', { ascending: false });
    
    if (!error && data) setListings(data);
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedAvatarFile(file);
      setAvatarPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    setUpdatingProfile(true);
    try {
      let finalAvatarUrl = profileForm.avatarUrl;

      // 1. Upload Avatar if changed
      if (selectedAvatarFile) {
        const fileExt = selectedAvatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images') // Reusing the same bucket for simplicity, usually 'avatars'
          .upload(filePath, selectedAvatarFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
        
        finalAvatarUrl = publicUrl;
      }

      // 2. Update profiles table
      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          full_name: profileForm.fullName,
          location: profileForm.location,
          // metadata/bio fields can be added here if the schema permits
        })
        .eq('id', user.id);

      if (dbError) throw dbError;

      // 3. Update Auth Metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          full_name: profileForm.fullName,
          phone: profileForm.phone,
          location: profileForm.location,
          bio: profileForm.bio,
          avatar_url: finalAvatarUrl
        }
      });

      if (authError) throw authError;

      setProfileForm(prev => ({ ...prev, avatarUrl: finalAvatarUrl }));
      setIsEditingProfile(false);
      alert('Profile updated successfully!');
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return alert('Please upload a product image.');
    
    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
      const filePath = `listings/${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('listings')
        .insert([{
          name: newListing.name,
          price: parseFloat(newListing.price),
          unit: newListing.unit,
          stock: newListing.stock,
          description: newListing.description,
          category: newListing.category,
          image_url: publicUrl,
          farmer_id: user.id
        }]);

      if (insertError) throw insertError;

      alert('Listing published successfully!');
      setShowAddModal(false);
      setNewListing({ name: '', price: '', unit: 'kg', stock: '', description: '', category: 'Vegetables' });
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchListings();
    } catch (err: any) {
      alert(`Error adding listing: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const fetchAgentNetwork = async () => {
    setLoading(true);
    const myCode = user.user_metadata?.referral_code;
    
    if (!myCode) {
      setLoading(false);
      return;
    }

    try {
      const { data: referredProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('referred_by', myCode);

      if (profileError) throw profileError;

      const { data: allOrders, error: orderError } = await supabase
        .from('orders')
        .select('*');

      if (orderError) throw orderError;

      const detailedEntities: OnboardedEntity[] = (referredProfiles || []).map(profile => {
        const totalActivity = (allOrders || [])
          .filter(order => order.farmer_id === profile.id)
          .reduce((sum, order) => sum + (order.total_price || 0), 0);

        return {
          id: profile.id,
          full_name: profile.full_name || 'Unnamed User',
          user_type: profile.user_type,
          location: profile.location || 'Not Set',
          joined_at: profile.created_at,
          total_activity: totalActivity
        };
      });

      setOnboardedEntities(detailedEntities);

      const networkIds = detailedEntities.map(e => e.id);
      const recentNetworkTx = (allOrders || [])
        .filter(order => networkIds.includes(order.farmer_id))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

      setNetworkTransactions(recentNetworkTx);

    } catch (err) {
      console.error('Error fetching agent network:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    const query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (isFarmer || isPharmacy) {
      query.eq('farmer_id', user.id);
    } else if (isBuyer) {
      query.eq('buyer_id', user.id);
    }

    const { data, error } = await query;
    if (!error && data) setOrders(data);
    setOrdersLoading(false);
  };

  const fetchNotifications = async () => {
    const demo: Notification[] = [
      {
        id: '1',
        title: 'System Active',
        message: 'Welcome to the AgriLinkChain dashboard.',
        type: 'market',
        is_read: false,
        created_at: new Date().toISOString()
      }
    ];
    setNotifications(demo);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Agent Referral Code copied!');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-600';
      case 'Shipped': return 'bg-blue-100 text-blue-600';
      case 'Delivered': return 'bg-green-100 text-green-600';
      default: return 'bg-red-100 text-red-600';
    }
  };

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    ...(isAgent ? [
      { name: 'My Network', icon: Users },
      { name: 'Network Transactions', icon: History },
      { name: 'Commissions', icon: Wallet }
    ] : []),
    ...(isFarmer || isPharmacy ? [
      { name: 'My Listings', icon: Package },
      { name: 'Manage Orders', icon: Clock }
    ] : []),
    ...(isBuyer ? [
      { name: 'Marketplace', icon: ShoppingBag },
      { name: 'My Orders', icon: Clock }
    ] : []),
    { name: 'Profile', icon: UserIcon },
    { name: 'Notifications', icon: Bell, badge: unreadCount },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex font-['Plus_Jakarta_Sans']">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0A1D11] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="bg-lime-400 p-1.5 rounded-lg">
              <Leaf className="w-6 h-6 text-[#0A1D11]" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">AgriLinkChain</span>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-2 flex-1">
            <div className="px-4 mb-4">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{userType} Portal</span>
            </div>
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all relative ${activeTab === item.name ? 'bg-lime-400 text-[#0A1D11]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
                {item.badge && item.badge > 0 && (
                  <span className="absolute right-4 bg-lime-400 text-[#0A1D11] text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0A1D11]">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10">
            <button onClick={onSignOut} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-red-400 hover:bg-red-400/10 transition-all">
              <LogOut className="w-5 h-5" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-neutral-100 rounded-xl text-[#0A1D11]">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-[#0A1D11]">{activeTab}</h1>
          </div>
          {isAgent && (
            <div className="flex items-center gap-3 bg-lime-50 border border-lime-200 px-4 py-2 rounded-xl">
              <span className="text-[10px] font-black text-lime-700 uppercase tracking-widest">Your Code:</span>
              <span className="text-sm font-black text-[#0A1D11] font-mono">{agentCode}</span>
              <button onClick={() => copyToClipboard(agentCode)} className="text-lime-600 hover:text-lime-700 transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center text-lime-700 font-bold border border-lime-200 overflow-hidden">
               {profileForm.avatarUrl ? <img src={profileForm.avatarUrl} className="w-full h-full object-cover" /> : profileForm.fullName.charAt(0)}
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-10">
          {activeTab === 'Overview' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="relative">
                <h2 className="text-3xl font-extrabold text-[#0A1D11] mb-2">Welcome back, {profileForm.fullName.split(' ')[0]}!</h2>
                <p className="text-neutral-500 font-medium leading-relaxed">
                  {isAgent ? "Track your network of farmers and partners real-time." : "Manage your agricultural operations."}
                </p>
              </div>

              {isAgent && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Network Size', value: onboardedEntities.length.toLocaleString(), icon: Users, color: 'text-blue-500' },
                    { label: 'Pharmacies', value: onboardedEntities.filter(e => e.user_type === 'Pharmacy').length, icon: Building2, color: 'text-purple-500' },
                    { label: 'Network Activity', value: `₦${onboardedEntities.reduce((acc, curr) => acc + curr.total_activity, 0).toLocaleString()}`, icon: BarChart4, color: 'text-green-500' },
                    { label: 'Estimated Commission', value: `₦${(onboardedEntities.reduce((acc, curr) => acc + curr.total_activity, 0) * 0.05).toLocaleString()}`, icon: Wallet, color: 'text-lime-500' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm">
                      <div className={`p-3 w-fit rounded-2xl bg-neutral-50 mb-4 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <h4 className="text-2xl font-black text-[#0A1D11] mb-1">{stat.value}</h4>
                      <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Farmer Overview Stats */}
              {(isFarmer || isPharmacy) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { label: 'Live Listings', value: listings.length.toLocaleString(), icon: Package, color: 'text-lime-500' },
                    { label: 'Total Orders', value: orders.length.toLocaleString(), icon: ShoppingCart, color: 'text-blue-500' },
                    { label: 'Total Revenue', value: `₦${orders.reduce((acc, curr) => acc + curr.total_price, 0).toLocaleString()}`, icon: Wallet, color: 'text-green-500' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
                      <div className={`p-3 w-fit rounded-2xl bg-neutral-50 mb-4 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <h4 className="text-3xl font-black text-[#0A1D11] mb-1">{stat.value}</h4>
                      <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {isAgent && (
                <div className="grid lg:grid-cols-3 gap-12">
                   <div className="lg:col-span-2 space-y-8">
                      <div className="flex items-center justify-between">
                         <h3 className="text-xl font-bold text-[#0A1D11]">Recent Network Onboards</h3>
                         <button onClick={() => setActiveTab('My Network')} className="text-lime-600 font-bold text-sm hover:underline">View All</button>
                      </div>
                      <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
                        <table className="w-full">
                           <thead className="bg-neutral-50 border-b border-neutral-100 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                             <tr>
                               <th className="px-6 py-4 text-left">Entity</th>
                               <th className="px-6 py-4 text-left">Role</th>
                               <th className="px-6 py-4 text-right">Activity</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-neutral-100">
                             {onboardedEntities.slice(0, 5).map((e) => (
                               <tr key={e.id} className="hover:bg-neutral-50/50 transition-colors">
                                 <td className="px-6 py-5">
                                   <div className="flex items-center gap-3">
                                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${e.user_type === 'Pharmacy' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {e.user_type === 'Pharmacy' ? <Building2 className="w-5 h-5" /> : <Leaf className="w-5 h-5" />}
                                      </div>
                                      <span className="font-bold text-[#0A1D11]">{e.full_name}</span>
                                   </div>
                                 </td>
                                 <td className="px-6 py-5 text-neutral-400 font-medium uppercase text-[10px] tracking-widest">{e.user_type}</td>
                                 <td className="px-6 py-5 text-right font-black text-[#0A1D11]">₦{e.total_activity.toLocaleString()}</td>
                               </tr>
                             ))}
                             {onboardedEntities.length === 0 && (
                               <tr><td colSpan={3} className="p-10 text-center text-neutral-400 font-bold italic">Your network is currently empty</td></tr>
                             )}
                           </tbody>
                        </table>
                      </div>
                   </div>
                   <div className="space-y-8">
                      <h3 className="text-xl font-bold text-[#0A1D11]">Network Activity Feed</h3>
                      <div className="space-y-4">
                        {networkTransactions.map((tx) => (
                           <div key={tx.id} className="bg-white p-6 rounded-[2rem] border border-neutral-100 flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${getStatusColor(tx.status)}`}><History className="w-5 h-5" /></div>
                              <div className="flex-1 min-w-0">
                                 <div className="text-sm font-bold text-[#0A1D11] truncate">{tx.product_name}</div>
                                 <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{tx.status}</div>
                              </div>
                              <div className="text-right font-black text-sm text-lime-600">₦{tx.total_price.toLocaleString()}</div>
                           </div>
                        ))}
                        {networkTransactions.length === 0 && (
                          <div className="text-center py-10 bg-white rounded-[2rem] border border-dashed border-neutral-200 text-neutral-400 text-sm font-bold">No recent network transactions</div>
                        )}
                      </div>
                   </div>
                </div>
              )}

              {!isAgent && activeTab === 'Overview' && (
                <div className="bg-white border border-neutral-100 rounded-[3rem] p-10 space-y-8 shadow-sm">
                   <div className="flex items-center justify-between">
                     <h3 className="text-2xl font-black text-[#0A1D11]">Quick Actions</h3>
                   </div>
                   <div className="grid md:grid-cols-3 gap-6">
                      <button 
                        onClick={() => { setActiveTab('My Listings'); setShowAddModal(true); }}
                        className="bg-lime-400 p-8 rounded-[2rem] text-[#0A1D11] text-left group hover:scale-[1.02] transition-all cursor-pointer"
                      >
                         <PlusCircle className="w-10 h-10 mb-6 group-hover:rotate-90 transition-transform" />
                         <h4 className="text-xl font-black">Add Listing</h4>
                         <p className="text-[#0A1D11]/60 font-medium text-sm mt-1">Market your produce globally.</p>
                      </button>
                      <button 
                        onClick={() => setActiveTab('Manage Orders')}
                        className="bg-[#0A1D11] p-8 rounded-[2rem] text-white text-left group hover:scale-[1.02] transition-all cursor-pointer"
                      >
                         <History className="w-10 h-10 mb-6 text-lime-400" />
                         <h4 className="text-xl font-black">Track Orders</h4>
                         <p className="text-white/40 font-medium text-sm mt-1">Manage sales and shipments.</p>
                      </button>
                      <button 
                        onClick={() => setActiveTab('Profile')}
                        className="bg-neutral-100 p-8 rounded-[2rem] text-[#0A1D11] text-left group hover:scale-[1.02] transition-all cursor-pointer border border-neutral-200"
                      >
                         <Settings className="w-10 h-10 mb-6 text-neutral-400" />
                         <h4 className="text-xl font-black">Settings</h4>
                         <p className="text-neutral-400 font-medium text-sm mt-1">Update business info.</p>
                      </button>
                   </div>
                </div>
              )}
            </div>
          )}

          {/* Profile Section */}
          {activeTab === 'Profile' && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
               <div className="bg-white p-10 lg:p-16 rounded-[3.5rem] border border-neutral-100 shadow-sm space-y-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-10">
                      <div className="relative group">
                        <div className="w-44 h-44 rounded-[2.5rem] bg-lime-100 flex items-center justify-center text-lime-700 text-6xl font-black uppercase overflow-hidden border-4 border-white shadow-xl">
                          {avatarPreviewUrl ? (
                            <img src={avatarPreviewUrl} className="w-full h-full object-cover" />
                          ) : (
                            profileForm.fullName.charAt(0)
                          )}
                        </div>
                        {isEditingProfile && (
                          <label className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            <Camera className="w-10 h-10 text-white" />
                          </label>
                        )}
                      </div>
                      <div className="space-y-3">
                        {isEditingProfile ? (
                          <input 
                            type="text" 
                            value={profileForm.fullName}
                            onChange={(e) => setProfileForm({...profileForm, fullName: e.target.value})}
                            className="text-4xl font-black text-[#0A1D11] bg-neutral-50 border border-neutral-100 rounded-2xl px-4 py-2 w-full focus:border-lime-400 outline-none" 
                          />
                        ) : (
                          <h2 className="text-4xl font-black text-[#0A1D11]">{profileForm.fullName}</h2>
                        )}
                        <div className="flex items-center gap-3">
                          <span className="bg-lime-400 text-[#0A1D11] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{userType}</span>
                          {isEditingProfile ? (
                            <input 
                              type="text" 
                              value={profileForm.location}
                              onChange={(e) => setProfileForm({...profileForm, location: e.target.value})}
                              className="text-sm font-bold text-[#0A1D11] bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-1 focus:border-lime-400 outline-none" 
                            />
                          ) : (
                            <span className="text-neutral-400 text-sm font-bold flex items-center gap-1"><MapPin className="w-4 h-4" /> {profileForm.location}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => isEditingProfile ? handleSaveProfile() : setIsEditingProfile(true)}
                      disabled={updatingProfile}
                      className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-sm transition-all ${
                        isEditingProfile 
                        ? 'bg-[#0A1D11] text-white hover:bg-neutral-800' 
                        : 'bg-neutral-100 text-[#0A1D11] hover:bg-neutral-200'
                      }`}
                    >
                      {updatingProfile ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isEditingProfile ? (
                        <Save className="w-4 h-4" />
                      ) : (
                        <Edit2 className="w-4 h-4" />
                      )}
                      {updatingProfile ? 'Saving...' : isEditingProfile ? 'Save Profile' : 'Edit Profile'}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="p-8 bg-neutral-50 rounded-[2rem] border border-neutral-100 space-y-2">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                          <Mail className="w-3 h-3" /> Email Address (Private)
                        </label>
                        <p className="font-bold text-[#0A1D11] opacity-60 cursor-not-allowed">{user.email}</p>
                     </div>
                     <div className="p-8 bg-neutral-50 rounded-[2rem] border border-neutral-100 space-y-2">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2">
                          <Phone className="w-3 h-3" /> Contact Phone
                        </label>
                        {isEditingProfile ? (
                          <input 
                            type="tel" 
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                            placeholder="+234 ..."
                            className="w-full bg-white border border-neutral-100 rounded-xl px-4 py-2 focus:border-lime-400 outline-none font-bold" 
                          />
                        ) : (
                          <p className="font-bold text-[#0A1D11]">{profileForm.phone || 'Not Provided'}</p>
                        )}
                     </div>
                  </div>

                  <div className="p-8 bg-neutral-50 rounded-[2.5rem] border border-neutral-100 space-y-4">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">About Me / Business Bio</label>
                    {isEditingProfile ? (
                      <textarea 
                        rows={4}
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                        placeholder="Tell the community about your farm, logistics network, or procurement needs..."
                        className="w-full bg-white border border-neutral-100 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none font-medium resize-none" 
                      />
                    ) : (
                      <p className="text-neutral-500 font-medium leading-relaxed">
                        {profileForm.bio || "No biography provided yet. Click 'Edit Profile' to introduce yourself to the AgriLinkChain community."}
                      </p>
                    )}
                  </div>

                  {isEditingProfile && (
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setIsEditingProfile(false)}
                        className="flex-1 py-4 rounded-2xl border border-neutral-200 font-bold text-neutral-400 hover:bg-neutral-50 transition-all"
                      >
                        Cancel Changes
                      </button>
                      <button 
                        onClick={handleSaveProfile}
                        disabled={updatingProfile}
                        className="flex-[2] bg-lime-400 text-[#0A1D11] py-4 rounded-2xl font-black shadow-xl shadow-lime-400/10 flex items-center justify-center gap-3 hover:bg-lime-300 transition-all"
                      >
                        {updatingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCheck className="w-5 h-5" />}
                        Apply All Updates
                      </button>
                    </div>
                  )}
               </div>
            </div>
          )}

          {/* ... existing My Network, Network Transactions, My Listings, Manage Orders tabs ... */}
          
          {activeTab === 'My Network' && isAgent && (
            <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
               <div className="bg-[#0A1D11] p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/10 blur-[100px] rounded-full"></div>
                  <div className="space-y-3 text-center md:text-left relative">
                     <h2 className="text-4xl font-black">Your Network Growth</h2>
                     <p className="text-white/40 font-medium max-w-md">Real data gathered directly from Supabase. Every partner onboarded adds to your legacy.</p>
                  </div>
                  <div className="bg-white/10 p-8 rounded-[2.5rem] border border-white/20 text-center space-y-2 relative">
                     <p className="text-[10px] font-black text-lime-400 uppercase tracking-widest">Share Your Agent Code</p>
                     <p className="text-4xl font-black font-mono tracking-tighter">{agentCode}</p>
                     <button onClick={() => copyToClipboard(agentCode)} className="w-full bg-lime-400 text-[#0A1D11] py-3 rounded-xl font-bold text-sm mt-4">Copy Code</button>
                  </div>
               </div>

               <div className="bg-white rounded-[3rem] border border-neutral-100 overflow-hidden shadow-sm">
                  {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                      <Loader2 className="w-10 h-10 text-lime-500 animate-spin" />
                      <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Querying Supabase Network...</p>
                    </div>
                  ) : (
                    <table className="w-full">
                       <thead className="bg-neutral-50 border-b border-neutral-100 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                         <tr>
                           <th className="px-10 py-6 text-left">Entity Name</th>
                           <th className="px-10 py-6 text-left">Type</th>
                           <th className="px-10 py-6 text-left">Location</th>
                           <th className="px-10 py-6 text-left">Join Date</th>
                           <th className="px-10 py-6 text-right">Total Activity</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-neutral-100">
                          {onboardedEntities.map((e) => (
                             <tr key={e.id} className="hover:bg-neutral-50/50 transition-colors group">
                                <td className="px-10 py-8 font-bold text-[#0A1D11]">{e.full_name}</td>
                                <td className="px-10 py-8">
                                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${e.user_type === 'Pharmacy' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                                      {e.user_type}
                                   </span>
                                </td>
                                <td className="px-10 py-8 text-neutral-500 font-medium">{e.location}</td>
                                <td className="px-10 py-8 text-neutral-400 font-medium">{new Date(e.joined_at).toLocaleDateString()}</td>
                                <td className="px-10 py-8 text-right font-black text-xl text-[#0A1D11]">₦{e.total_activity.toLocaleString()}</td>
                             </tr>
                          ))}
                          {onboardedEntities.length === 0 && (
                            <tr><td colSpan={5} className="p-20 text-center text-neutral-400 font-bold uppercase tracking-[0.2em]">No partners onboarded yet</td></tr>
                          )}
                       </tbody>
                    </table>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'My Listings' && (isFarmer || isPharmacy) && (
            <div className="space-y-10 animate-in slide-in-from-bottom duration-500">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-3xl font-black">Market Inventory</h2>
                    <p className="text-neutral-500 font-medium">Verified products currently active on AgriLinkChain.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-lime-400 text-[#0A1D11] px-10 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-lime-300 transition-all shadow-xl shadow-lime-400/10"
                  >
                    <Plus className="w-6 h-6" /> Add New Listing
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {listings.map((p) => (
                    <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all group">
                       <div className="relative h-56 overflow-hidden">
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0A1D11] border border-white/50">
                            {p.category}
                          </div>
                       </div>
                       <div className="p-8 space-y-4">
                          <div className="flex justify-between items-start">
                             <div>
                                <h3 className="text-xl font-black text-[#0A1D11]">{p.name}</h3>
                                <p className="text-sm text-neutral-400 font-medium">{p.stock} {p.unit} available</p>
                             </div>
                             <div className="text-right">
                                <div className="text-2xl font-black text-[#0A1D11]">₦{p.price.toLocaleString()}</div>
                                <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">per {p.unit}</div>
                             </div>
                          </div>
                          <div className="flex items-center gap-4 pt-4 border-t border-neutral-50">
                             <button className="flex-1 bg-neutral-100 text-[#0A1D11] py-3 rounded-xl font-bold text-sm hover:bg-neutral-200 transition-colors">Edit</button>
                             <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                          </div>
                       </div>
                    </div>
                  ))}
                  {listings.length === 0 && !loading && (
                    <div className="col-span-full py-32 text-center bg-white border border-dashed border-neutral-200 rounded-[3rem]">
                       <Package className="w-16 h-16 text-neutral-200 mx-auto mb-6" />
                       <h3 className="text-2xl font-bold text-[#0A1D11]">No listings found</h3>
                       <p className="text-neutral-400 max-w-sm mx-auto mt-2">Start by adding your first product to the marketplace.</p>
                       <button 
                        onClick={() => setShowAddModal(true)}
                        className="mt-8 bg-[#0A1D11] text-white px-10 py-4 rounded-2xl font-bold"
                       >
                        Create Listing
                       </button>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'Manage Orders' && (isFarmer || isPharmacy) && (
            <div className="space-y-10 animate-in slide-in-from-bottom duration-500">
               <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-black">Sales Management</h2>
               </div>
               <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm flex items-center justify-between gap-8 group">
                       <div className="flex items-center gap-6 flex-1">
                          <div className={`p-4 rounded-2xl ${getStatusColor(order.status)}`}><Box className="w-8 h-8" /></div>
                          <div>
                             <h4 className="text-xl font-bold text-[#0A1D11]">{order.product_name}</h4>
                             <p className="text-neutral-400 font-bold text-xs uppercase tracking-widest mt-1">Order Ref: {order.id.slice(0,8).toUpperCase()}</p>
                          </div>
                       </div>
                       <div className="text-center px-8 border-x border-neutral-100">
                          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Quantity</p>
                          <p className="text-lg font-bold">{order.quantity} {order.unit}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-black text-[#0A1D11]">₦{order.total_price.toLocaleString()}</p>
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mt-2 inline-block ${getStatusColor(order.status)}`}>
                             {order.status}
                          </span>
                       </div>
                       <div className="flex gap-2">
                          <button className="p-4 bg-lime-400 text-[#0A1D11] rounded-2xl hover:scale-105 transition-all"><ChevronRight className="w-5 h-5" /></button>
                       </div>
                    </div>
                  ))}
                  {orders.length === 0 && !ordersLoading && (
                    <div className="py-32 text-center bg-white border border-neutral-100 rounded-[3rem]">
                       <Timer className="w-16 h-16 text-neutral-200 mx-auto mb-6" />
                       <h3 className="text-2xl font-bold text-[#0A1D11]">No orders yet</h3>
                       <p className="text-neutral-400 max-w-sm mx-auto mt-2">Active buyer requests will appear here once they place an order.</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'Network Transactions' && isAgent && (
             <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
                <div className="grid gap-6">
                   {networkTransactions.map((tx) => (
                      <div key={tx.id} className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 flex items-center gap-8 shadow-sm">
                         <div className={`w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 ${getStatusColor(tx.status)}`}>
                            <ShoppingCart className="w-10 h-10" />
                         </div>
                         <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                               <div>
                                  <h4 className="text-2xl font-black text-[#0A1D11]">{tx.product_name}</h4>
                                  <p className="text-neutral-400 font-bold text-sm uppercase tracking-widest">#{tx.id}</p>
                               </div>
                               <div className="text-right">
                                  <div className="text-3xl font-black text-[#0A1D11]">₦{tx.total_price.toLocaleString()}</div>
                                  <div className="text-[10px] font-black text-lime-600 uppercase tracking-widest">Earned: ₦{(tx.total_price * 0.05).toLocaleString()}</div>
                               </div>
                            </div>
                            <div className="flex items-center gap-6 pt-4 border-t border-neutral-50">
                               <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(tx.status)}`}>{tx.status}</div>
                               <div className="text-xs font-bold text-neutral-400">{tx.quantity}{tx.unit} ordered at {new Date(tx.created_at).toLocaleDateString()}</div>
                            </div>
                         </div>
                      </div>
                   ))}
                   {networkTransactions.length === 0 && (
                     <div className="p-20 text-center bg-white rounded-[3rem] border border-dashed border-neutral-200 text-neutral-400 font-bold uppercase tracking-widest">No transactions in your network</div>
                   )}
                </div>
             </div>
          )}

          {/* Fallback for coming soon tabs */}
          {activeTab !== 'Overview' && activeTab !== 'My Network' && activeTab !== 'Network Transactions' && activeTab !== 'Profile' && activeTab !== 'My Listings' && activeTab !== 'Manage Orders' && (
             <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-in zoom-in duration-300">
                <Clock className="w-16 h-16 text-neutral-200" />
                <h3 className="text-2xl font-bold text-[#0A1D11]">{activeTab} section active</h3>
                <button onClick={() => setActiveTab('Overview')} className="bg-[#0A1D11] text-white px-10 py-4 rounded-2xl font-bold">Back to Overview</button>
             </div>
          )}
        </div>
      </main>

      {/* Add Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-[#0A1D11]/80 backdrop-blur-sm" onClick={() => !uploading && setShowAddModal(false)}></div>
           <div className="relative bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              <header className="px-10 py-8 border-b border-neutral-100 flex items-center justify-between bg-[#F8FAF9]">
                 <div>
                    <h2 className="text-2xl font-black text-[#0A1D11]">Publish Listing</h2>
                    <p className="text-sm text-neutral-400 font-medium">Add a new product to the global marketplace.</p>
                 </div>
                 <button onClick={() => !uploading && setShowAddModal(false)} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
                    <X className="w-6 h-6 text-neutral-400" />
                 </button>
              </header>
              
              <form className="p-10 space-y-8" onSubmit={handleAddListing}>
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Product Name</label>
                          <input 
                            required
                            type="text" 
                            value={newListing.name}
                            onChange={(e) => setNewListing({...newListing, name: e.target.value})}
                            placeholder="e.g. Organic Tomatoes" 
                            className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-all font-bold" 
                          />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Price (₦)</label>
                             <input 
                               required
                               type="number" 
                               value={newListing.price}
                               onChange={(e) => setNewListing({...newListing, price: e.target.value})}
                               placeholder="500" 
                               className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-all font-bold" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Unit</label>
                             <select 
                               value={newListing.unit}
                               onChange={(e) => setNewListing({...newListing, unit: e.target.value})}
                               className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-all font-bold appearance-none"
                             >
                                <option value="kg">Per KG</option>
                                <option value="bag">Per Bag</option>
                                <option value="pc">Per Piece</option>
                                <option value="crate">Per Crate</option>
                             </select>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Stock Quantity</label>
                          <input 
                            required
                            type="text" 
                            value={newListing.stock}
                            onChange={(e) => setNewListing({...newListing, stock: e.target.value})}
                            placeholder="e.g. 500" 
                            className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-all font-bold" 
                          />
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Product Image</label>
                          <div className="relative group">
                             <input 
                               type="file" 
                               accept="image/*"
                               onChange={handleFileChange}
                               className="hidden" 
                               id="listing-image"
                             />
                             <label 
                               htmlFor="listing-image"
                               className={`aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                                 previewUrl ? 'border-lime-400 border-solid bg-white' : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100'
                               }`}
                             >
                                {previewUrl ? (
                                  <div className="relative w-full h-full">
                                     <img src={previewUrl} className="w-full h-full object-cover" />
                                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                        <RefreshCw className="w-8 h-8 text-white" />
                                     </div>
                                  </div>
                                ) : (
                                  <>
                                     <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center text-neutral-400 mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-8 h-8" />
                                     </div>
                                     <span className="text-sm font-bold text-neutral-400">Click to upload image</span>
                                     <span className="text-[10px] font-black text-neutral-300 uppercase mt-2">JPG, PNG up to 5MB</span>
                                  </>
                                )}
                             </label>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">Description (Optional)</label>
                    <textarea 
                      value={newListing.description}
                      onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                      rows={3}
                      placeholder="Tell buyers about your harvest quality, soil types, or certifications..." 
                      className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl px-6 py-4 focus:border-lime-400 outline-none transition-all font-medium resize-none" 
                    />
                 </div>

                 <button 
                    disabled={uploading}
                    type="submit"
                    className="w-full bg-[#0A1D11] text-white py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all disabled:opacity-50 shadow-2xl shadow-[#0A1D11]/10"
                 >
                    {uploading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Broadcasting Listing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-lime-400" />
                        <span>Publish to Marketplace</span>
                      </>
                    )}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
