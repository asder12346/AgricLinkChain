
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
  History
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

const BUCKET_NAME = 'product-images';

const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut, onGoHome }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [onboardedEntities, setOnboardedEntities] = useState<OnboardedEntity[]>([]);
  const [networkTransactions, setNetworkTransactions] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Profile State
  const [profileForm, setProfileForm] = useState({
    fullName: user.user_metadata?.full_name || 'Agri User',
    phone: user.user_metadata?.phone || '',
    avatarUrl: user.user_metadata?.avatar_url || '',
    bio: user.user_metadata?.bio || (
      user.user_metadata?.user_type === 'Buyer' ? 'Passionate about fresh, organic produce.' : 
      user.user_metadata?.user_type === 'Agent' ? 'Dedicated network agent onboarding farmers and pharmacies.' :
      user.user_metadata?.user_type === 'Pharmacy' ? 'Industrial medical agriculture procurement.' :
      'Passionate farmer contributing to the global food chain.'
    ),
    location: user.user_metadata?.location || 'Lagos, Nigeria'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

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

  const fetchAgentNetwork = async () => {
    // In a real database scenario, you would query the profiles table filtered by referred_by
    const demoEntities: OnboardedEntity[] = [
      { id: '1', full_name: 'City Care Pharmacy', user_type: 'Pharmacy', location: 'Lagos', joined_at: '2023-12-01', total_activity: 250000 },
      { id: '2', full_name: 'Musa Rice Mills', user_type: 'Farmer', location: 'Jigawa', joined_at: '2024-01-15', total_activity: 120000 },
      { id: '3', full_name: 'HealthPlus Pharmacy', user_type: 'Pharmacy', location: 'Abuja', joined_at: '2024-02-10', total_activity: 450000 }
    ];
    setOnboardedEntities(demoEntities);

    // Mock network transactions for agents to see
    const demoTransactions: Order[] = [
      { id: 'tx-1', farmer_id: '1', buyer_id: 'buyer-x', product_name: 'Medicinal Herbs', quantity: 50, unit: 'kg', total_price: 140000, status: 'Shipped', created_at: new Date().toISOString() },
      { id: 'tx-2', farmer_id: '2', buyer_id: 'buyer-y', product_name: 'Industrial Starch (Maize)', quantity: 20, unit: 'bag', total_price: 550000, status: 'Pending', created_at: new Date().toISOString() },
      { id: 'tx-3', farmer_id: '3', buyer_id: 'buyer-z', product_name: 'Aloe Vera Extract', quantity: 100, unit: 'litres', total_price: 320000, status: 'Delivered', created_at: new Date().toISOString() }
    ];
    setNetworkTransactions(demoTransactions);
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
        title: isAgent ? 'New Pharmacy Onboarded' : 'System Update',
        message: isAgent ? 'City Care Pharmacy has successfully registered using your code.' : 'Welcome to the updated AgriLinkChain platform.',
        type: isAgent ? 'referral' : 'market',
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
                  {isAgent ? "Track your network of pharmacies and farmers." : "Manage your agricultural operations."}
                </p>
              </div>

              {isAgent && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Pharmacies', value: onboardedEntities.filter(e => e.user_type === 'Pharmacy').length, icon: Building2, color: 'text-blue-500' },
                    { label: 'Farmers', value: onboardedEntities.filter(e => e.user_type === 'Farmer').length, icon: Users, color: 'text-orange-500' },
                    { label: 'Network Sales', value: `₦${onboardedEntities.reduce((acc, curr) => acc + curr.total_activity, 0).toLocaleString()}`, icon: BarChart4, color: 'text-green-500' },
                    { label: 'Commission', value: `₦${(onboardedEntities.reduce((acc, curr) => acc + curr.total_activity, 0) * 0.05).toLocaleString()}`, icon: Wallet, color: 'text-lime-500' },
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

              {isAgent && (
                <div className="grid lg:grid-cols-3 gap-12">
                   <div className="lg:col-span-2 space-y-8">
                      <div className="flex items-center justify-between">
                         <h3 className="text-xl font-bold text-[#0A1D11]">Onboarded Pharmacies</h3>
                         <button onClick={() => setActiveTab('My Network')} className="text-lime-600 font-bold text-sm hover:underline">View All</button>
                      </div>
                      <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
                        <table className="w-full">
                           <thead className="bg-neutral-50 border-b border-neutral-100 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                             <tr>
                               <th className="px-6 py-4 text-left">Entity</th>
                               <th className="px-6 py-4 text-left">Location</th>
                               <th className="px-6 py-4 text-right">Activity</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-neutral-100">
                             {onboardedEntities.filter(e => e.user_type === 'Pharmacy').map((p) => (
                               <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                                 <td className="px-6 py-5">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600"><Building2 className="w-5 h-5" /></div>
                                      <span className="font-bold text-[#0A1D11]">{p.full_name}</span>
                                   </div>
                                 </td>
                                 <td className="px-6 py-5 text-neutral-400 font-medium">{p.location}</td>
                                 <td className="px-6 py-5 text-right font-black text-[#0A1D11]">₦{p.total_activity.toLocaleString()}</td>
                               </tr>
                             ))}
                           </tbody>
                        </table>
                      </div>
                   </div>
                   <div className="space-y-8">
                      <h3 className="text-xl font-bold text-[#0A1D11]">Recent Activity</h3>
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
                      </div>
                   </div>
                </div>
              )}

              {!isAgent && (
                <div className="bg-white border-2 border-dashed border-neutral-200 rounded-[3rem] py-32 text-center space-y-6">
                   <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-neutral-200"><LayoutDashboard className="w-10 h-10" /></div>
                   <h3 className="text-2xl font-bold text-[#0A1D11]">{userType} Dashboard is Active</h3>
                   <p className="text-neutral-400 max-w-sm mx-auto">Welcome to your dashboard. Use the sidebar to manage your listings and orders.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'My Network' && isAgent && (
            <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
               <div className="bg-[#0A1D11] p-10 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="space-y-3 text-center md:text-left">
                     <h2 className="text-4xl font-black">Your Network Growth</h2>
                     <p className="text-white/40 font-medium max-w-md">Every pharmacy and farmer onboarded adds to your monthly recurring commission. Keep expanding!</p>
                  </div>
                  <div className="bg-white/10 p-8 rounded-[2.5rem] border border-white/20 text-center space-y-2">
                     <p className="text-[10px] font-black text-lime-400 uppercase tracking-widest">Share Your Agent Code</p>
                     <p className="text-4xl font-black font-mono tracking-tighter">{agentCode}</p>
                     <button onClick={() => copyToClipboard(agentCode)} className="w-full bg-lime-400 text-[#0A1D11] py-3 rounded-xl font-bold text-sm mt-4">Copy Code</button>
                  </div>
               </div>

               <div className="bg-white rounded-[3rem] border border-neutral-100 overflow-hidden shadow-sm">
                  <table className="w-full">
                     <thead className="bg-neutral-50 border-b border-neutral-100 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                       <tr>
                         <th className="px-10 py-6 text-left">Entity Name</th>
                         <th className="px-10 py-6 text-left">Type</th>
                         <th className="px-10 py-6 text-left">Location</th>
                         <th className="px-10 py-6 text-left">Onboarded Date</th>
                         <th className="px-10 py-6 text-right">Total Activity</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-neutral-100">
                        {onboardedEntities.map((e) => (
                           <tr key={e.id} className="hover:bg-neutral-50/50 transition-colors group">
                              <td className="px-10 py-8 font-bold text-[#0A1D11]">{e.full_name}</td>
                              <td className="px-10 py-8">
                                 <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${e.user_type === 'Pharmacy' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {e.user_type}
                                 </span>
                              </td>
                              <td className="px-10 py-8 text-neutral-500 font-medium">{e.location}</td>
                              <td className="px-10 py-8 text-neutral-400 font-medium">{e.joined_at}</td>
                              <td className="px-10 py-8 text-right font-black text-xl text-[#0A1D11]">₦{e.total_activity.toLocaleString()}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
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
                </div>
             </div>
          )}

          {/* Profile Section */}
          {activeTab === 'Profile' && (
            <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
               <div className="bg-white p-10 lg:p-16 rounded-[3.5rem] border border-neutral-100 shadow-sm space-y-12">
                  <div className="flex items-center gap-10">
                    <div className="w-44 h-44 rounded-[2.5rem] bg-lime-100 flex items-center justify-center text-lime-700 text-6xl font-black uppercase">
                       {profileForm.fullName.charAt(0)}
                    </div>
                    <div className="space-y-3">
                       <h2 className="text-4xl font-black text-[#0A1D11]">{profileForm.fullName}</h2>
                       <div className="flex items-center gap-3">
                          <span className="bg-lime-400 text-[#0A1D11] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{userType}</span>
                          <span className="text-neutral-400 text-sm font-bold flex items-center gap-1"><MapPin className="w-4 h-4" /> {profileForm.location}</span>
                       </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                     <div className="p-8 bg-neutral-50 rounded-[2rem] border border-neutral-100">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Email Address</p>
                        <p className="font-bold text-[#0A1D11]">{user.email}</p>
                     </div>
                     <div className="p-8 bg-neutral-50 rounded-[2rem] border border-neutral-100">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Phone Number</p>
                        <p className="font-bold text-[#0A1D11]">{profileForm.phone || 'Not Provided'}</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* Fallback for coming soon tabs */}
          {activeTab !== 'Overview' && activeTab !== 'My Network' && activeTab !== 'Network Transactions' && activeTab !== 'Profile' && (
             <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-in zoom-in duration-300">
                <Clock className="w-16 h-16 text-neutral-200" />
                <h3 className="text-2xl font-bold text-[#0A1D11]">{activeTab} section coming soon</h3>
                <button onClick={() => setActiveTab('Overview')} className="bg-[#0A1D11] text-white px-10 py-4 rounded-2xl font-bold">Back to Overview</button>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
