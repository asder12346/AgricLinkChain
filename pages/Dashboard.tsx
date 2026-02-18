
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, User as UserIcon, Bell, 
  LogOut, Leaf, Plus, TrendingUp, Clock, Menu, X, Settings,
  Trash2, RefreshCw, Users, Loader2, Save, ShoppingBag, Box, Image as ImageIcon,
  PlusCircle, CheckCircle2, Edit2, Calendar, MapPin, ExternalLink, Wallet, CreditCard,
  ChevronRight, ArrowLeft, Truck, Star, ShieldCheck
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

      const userRole = prof?.user_type || user.user_metadata?.user_type;

      if (userRole === 'Farmer') {
        const { data: list } = await supabase.from('listings').select('*').eq('farmer_id', user.id).order('created_at', { ascending: false });
        if (list) setListings(list);
        const { data: ords } = await supabase.from('orders').select('*').eq('farmer_id', user.id);
        if (ords) setOrders(ords);
      } else if (userRole === 'Agent') {
        const myCode = prof?.referral_code;
        if (myCode) {
          const { data: network } = await supabase.from('profiles').select('*').eq('referred_by', myCode);
          if (network) setOnboardedEntities(network);
        }
      } else if (userRole === 'Buyer') {
        // Fetch marketplace for buyer
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

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsOrdering(true);
    try {
      // In a real app we'd need a real farmer_id. If using defaults, use a dummy one.
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
      
      alert('Order placed successfully! The farmer will contact you for delivery details.');
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

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex font-['Plus_Jakarta_Sans'] text-[#0A1D11]">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A1D11]/60 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
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
               <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">{userRole}</p>
               <p className="text-sm font-bold">{profile?.full_name}</p>
             </div>
             <div className="w-12 h-12 rounded-[1.25rem] bg-lime-100 flex items-center justify-center font-black text-lime-700 border-2 border-white shadow-sm overflow-hidden">
               {profile?.full_name?.charAt(0)}
             </div>
          </div>
        </header>

        <div className="p-6 sm:p-12 lg:p-16 max-w-7xl mx-auto space-y-12">
          {activeTab === 'Overview' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                 <div>
                   <h2 className="text-4xl font-black text-[#0A1D11] tracking-tight">Welcome, {profile?.full_name?.split(' ')[0]}!</h2>
                   <p className="text-neutral-500 font-medium mt-1">Platform status is live. 1.2k active nodes secured.</p>
                 </div>
                 {userRole === 'Farmer' && (
                   <button onClick={() => setIsAddingListing(true)} className="bg-[#0A1D11] text-white px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all">
                     <PlusCircle className="w-5 h-5 text-lime-400" /> New Inventory
                   </button>
                 )}
                 {userRole === 'Buyer' && (
                    <button onClick={() => setActiveTab('Marketplace')} className="bg-lime-400 text-[#0A1D11] px-10 py-5 rounded-[2rem] font-black flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all">
                      <ShoppingBag className="w-5 h-5" /> Start Trading
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

               <div className="grid lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black">Trade Records</h3>
                      <button onClick={fetchProfileAndData} className="p-3 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors">
                        <RefreshCw className="w-5 h-5 text-neutral-300" />
                      </button>
                    </div>
                    {orders.length === 0 ? (
                      <div className="py-20 text-center space-y-4 bg-neutral-50 rounded-[2rem] border border-dashed border-neutral-200">
                         <Box className="w-12 h-12 text-neutral-200 mx-auto" />
                         <p className="text-neutral-400 font-bold uppercase tracking-widest text-[10px]">No historical data found</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.slice(0, 4).map(order => (
                          <div key={order.id} className="flex items-center justify-between p-6 bg-neutral-50 rounded-[2rem] border border-neutral-100 hover:border-lime-400/30 transition-all cursor-pointer">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-lime-600 shadow-sm"><Package className="w-6 h-6" /></div>
                               <div>
                                 <p className="font-black text-sm">{order.product_name}</p>
                                 <p className="text-[10px] uppercase font-black text-neutral-400 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="font-black text-sm text-[#0A1D11]">₦{order.total_price.toLocaleString()}</p>
                               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase mt-1 inline-block ${order.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{order.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-[#0D2517] p-10 rounded-[3rem] text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-lime-400/5 blur-[80px] -mr-24 -mt-24"></div>
                    <h3 className="text-2xl font-black mb-8 relative z-10">Ag-Hub News</h3>
                    <div className="space-y-6 relative z-10">
                      {upcomingEvents.map(ev => (
                        <div key={ev.id} className="flex gap-5 items-start p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                          <div className="p-3 bg-lime-400/10 text-lime-400 rounded-2xl group-hover:scale-110 transition-transform">{ev.icon}</div>
                          <div className="space-y-1">
                             <p className="font-bold text-sm group-hover:text-lime-400 transition-colors">{ev.title}</p>
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] text-white/30 uppercase font-black">{ev.date}</span>
                                <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                <span className="text-[10px] text-white/30 uppercase font-black">{ev.type}</span>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-10 py-5 bg-white/5 text-white/60 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all border border-white/5">
                      Open Newsroom
                    </button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Marketplace' && userRole === 'Buyer' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black tracking-tight">Trade Hub</h2>
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

          {checkoutProduct && (
            <div className="fixed inset-0 z-50 bg-[#0A1D11]/95 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-5xl rounded-[4rem] overflow-hidden shadow-2xl animate-in zoom-in duration-500 border border-white/20">
                 <div className="grid lg:grid-cols-5 h-full max-h-[90vh]">
                    <div className="lg:col-span-2 bg-[#F8FAF9] p-10 lg:p-14 flex flex-col justify-between border-r border-neutral-100 overflow-y-auto">
                       <div className="space-y-10">
                         <button onClick={() => setCheckoutProduct(null)} className="flex items-center gap-2 text-neutral-400 hover:text-[#0A1D11] font-black text-[10px] uppercase tracking-widest transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Go Back to Marketplace
                         </button>
                         <div className="space-y-6">
                            <div className="w-20 h-20 rounded-[1.5rem] bg-lime-400 flex items-center justify-center shadow-xl shadow-lime-400/20">
                               <Package className="w-10 h-10 text-[#0A1D11]" />
                            </div>
                            <div className="space-y-2">
                               <h3 className="text-4xl font-black text-[#0A1D11] leading-tight">{checkoutProduct.name}</h3>
                               <p className="text-neutral-500 font-bold flex items-center gap-2 uppercase tracking-widest text-xs">
                                 <ShieldCheck className="w-4 h-4 text-lime-600" /> Verified Batch ID: #{checkoutProduct.id.slice(0,8)}
                               </p>
                            </div>
                         </div>
                         <div className="space-y-6">
                            <div className="p-6 bg-white rounded-3xl border border-neutral-200 flex items-center gap-5">
                               <div className="w-12 h-12 bg-lime-50 rounded-2xl flex items-center justify-center text-lime-600"><Truck className="w-6 h-6" /></div>
                               <div><p className="font-bold text-sm">Insured Delivery</p><p className="text-[10px] text-neutral-400 font-bold uppercase">Lagos Agri-Hub Partner</p></div>
                            </div>
                            <div className="p-6 bg-white rounded-3xl border border-neutral-200 flex items-center gap-5">
                               <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600"><CreditCard className="w-6 h-6" /></div>
                               <div><p className="font-bold text-sm">Escrow Secure</p><p className="text-[10px] text-neutral-400 font-bold uppercase">7-Day Quality Guarantee</p></div>
                            </div>
                         </div>
                       </div>
                       <div className="mt-12">
                          <img src={checkoutProduct.image_url} className="w-full h-56 object-cover rounded-[2.5rem] shadow-lg grayscale hover:grayscale-0 transition-all duration-700" />
                       </div>
                    </div>
                    <div className="lg:col-span-3 p-10 lg:p-20 space-y-12 overflow-y-auto">
                       <div className="space-y-8">
                          <h4 className="text-xs font-black uppercase text-neutral-400 tracking-widest border-b border-neutral-100 pb-4">Checkout Configuration</h4>
                          
                          <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Select Quantity ({checkoutProduct.unit})</label>
                               <div className="flex items-center justify-between bg-neutral-100 rounded-[1.5rem] p-3 border border-neutral-200">
                                  <button onClick={() => setOrderQty(Math.max(1, orderQty - 1))} className="w-12 h-12 bg-white rounded-xl font-black text-xl flex items-center justify-center hover:bg-neutral-50 transition-colors shadow-sm">-</button>
                                  <span className="font-black text-2xl px-6">{orderQty}</span>
                                  <button onClick={() => setOrderQty(orderQty + 1)} className="w-12 h-12 bg-white rounded-xl font-black text-xl flex items-center justify-center hover:bg-neutral-50 transition-colors shadow-sm">+</button>
                               </div>
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Base Rate</label>
                               <div className="bg-neutral-50 rounded-[1.5rem] p-6 border border-neutral-100 text-center">
                                  <p className="font-black text-2xl text-[#0A1D11]">₦{checkoutProduct.price.toLocaleString()}</p>
                                  <p className="text-[10px] font-bold text-neutral-300 uppercase">per unit</p>
                               </div>
                            </div>
                          </div>
                       </div>

                       <div className="space-y-6">
                          <div className="bg-[#0A1D11] p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden group">
                             <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/10 blur-[100px] -mr-32 -mt-32"></div>
                             <div className="space-y-4 relative z-10">
                                <div className="flex justify-between items-center text-white/50 text-sm font-bold uppercase tracking-widest">
                                   <span>Subtotal</span>
                                   <span>₦{(checkoutProduct.price * orderQty).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-white/50 text-sm font-bold uppercase tracking-widest">
                                   <span>Processing Fee (0.5%)</span>
                                   <span>₦{(checkoutProduct.price * orderQty * 0.005).toLocaleString()}</span>
                                </div>
                                <div className="h-px bg-white/10 my-6"></div>
                                <div className="flex justify-between items-end">
                                   <div className="space-y-1">
                                      <span className="text-xs font-black text-lime-400 uppercase tracking-widest">Total Payable Sum</span>
                                      <p className="text-4xl font-black">₦{(checkoutProduct.price * orderQty * 1.005).toLocaleString()}</p>
                                   </div>
                                   <div className="text-right">
                                      <div className="flex items-center gap-1.5 justify-end text-green-400 text-[10px] font-black uppercase tracking-widest">
                                         <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> Secure Node
                                      </div>
                                   </div>
                                </div>
                             </div>
                             
                             <button onClick={handleCreateOrder} disabled={isOrdering} className="w-full py-6 bg-lime-400 text-[#0A1D11] rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 hover:bg-lime-300 active:scale-95 transition-all relative z-10 shadow-2xl shadow-lime-400/20 group">
                                {isOrdering ? <Loader2 className="animate-spin" /> : <><CreditCard className="w-6 h-6" /> Complete Purchase</>}
                             </button>
                             <p className="text-center text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] relative z-10">AgriLink Encrypted Transaction</p>
                          </div>
                          <div className="flex items-center justify-center gap-8 text-neutral-300">
                             <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /><span className="text-[10px] font-bold uppercase tracking-widest">SSL Secured</span></div>
                             <div className="flex items-center gap-2"><CreditCard className="w-4 h-4" /><span className="text-[10px] font-bold uppercase tracking-widest">Multiple Gateways</span></div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'My Orders' && (
            <div className="bg-white rounded-[3rem] border border-neutral-100 overflow-hidden shadow-sm animate-in fade-in duration-500">
               <div className="p-10 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
                 <h3 className="text-2xl font-black">Order Fulfillment</h3>
                 <button onClick={fetchProfileAndData} className="p-3 bg-white rounded-2xl border border-neutral-100 hover:bg-neutral-50 transition-colors shadow-sm">
                   <RefreshCw className="w-5 h-5 text-neutral-300" />
                 </button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-neutral-50/50 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                       <tr>
                         <th className="px-10 py-5">Inventory Item</th>
                         <th className="px-10 py-5">Order Quantity</th>
                         <th className="px-10 py-5">Total Value</th>
                         <th className="px-10 py-5">Trade Date</th>
                         <th className="px-10 py-5">Platform Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                       {orders.map(o => (
                         <tr key={o.id} className="hover:bg-neutral-50/50 transition-colors cursor-pointer group">
                           <td className="px-10 py-8">
                             <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-lime-100 rounded-xl flex items-center justify-center text-lime-700 font-black text-xs">{o.product_name.charAt(0)}</div>
                               <p className="font-black text-sm">{o.product_name}</p>
                             </div>
                           </td>
                           <td className="px-10 py-8 text-sm font-bold text-neutral-500">{o.quantity.toLocaleString()} {o.unit}</td>
                           <td className="px-10 py-8 font-black text-[#0A1D11]">₦{o.total_price.toLocaleString()}</td>
                           <td className="px-10 py-8 text-[10px] text-neutral-400 font-black uppercase">{new Date(o.created_at).toLocaleDateString()}</td>
                           <td className="px-10 py-8">
                             <span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${o.status === 'Pending' ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-green-100 text-green-600 border border-green-200'}`}>{o.status}</span>
                           </td>
                         </tr>
                       ))}
                       {orders.length === 0 && (
                         <tr>
                            <td colSpan={5} className="p-32 text-center text-neutral-400">
                               <Box className="w-16 h-16 mx-auto mb-6 opacity-10" />
                               <p className="font-black uppercase tracking-[0.2em] text-[10px]">No historical orders matched</p>
                            </td>
                         </tr>
                       )}
                    </tbody>
                 </table>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
