
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, User as UserIcon, Bell, 
  LogOut, Leaf, Plus, TrendingUp, Clock, Menu, X, Settings,
  Trash2, RefreshCw, Users, Loader2, Save, ShoppingBag, Box, Image as ImageIcon,
  PlusCircle, CheckCircle2, Edit2, Calendar, MapPin, ExternalLink, Wallet, CreditCard,
  ChevronRight, ArrowLeft, Truck
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
        if (marketplace) setMarketProducts(marketplace);
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
      const { error } = await supabase.from('orders').insert([{
        buyer_id: user.id,
        farmer_id: checkoutProduct.farmer_id,
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
    { id: 1, title: 'Agri-Export Webinar', date: 'Jun 20', type: 'Digital', icon: <Calendar className="w-5 h-5 text-lime-500" /> },
    { id: 2, title: 'Seed Funding Round', date: 'Jun 28', type: 'Admin', icon: <ExternalLink className="w-5 h-5 text-blue-500" /> },
  ];

  if (loading && !profile) {
    return <div className="min-h-screen bg-[#0A1D11] flex items-center justify-center"><Loader2 className="w-10 h-10 text-lime-400 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex font-['Plus_Jakarta_Sans'] text-[#0A1D11]">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0A1D11] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
              <div className="bg-lime-400 p-1.5 rounded-lg"><Leaf className="w-6 h-6 text-[#0A1D11]" /></div>
              <span className="text-xl font-extrabold text-white">AgriLink</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/60"><X className="w-6 h-6" /></button>
          </div>
          <div className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <button key={item.name} onClick={() => { setActiveTab(item.name); setCheckoutProduct(null); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === item.name ? 'bg-lime-400 text-[#0A1D11]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                <item.icon className="w-5 h-5" /> {item.name}
              </button>
            ))}
          </div>
          <button onClick={onSignOut} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-red-400 hover:bg-red-400/10 transition-all border-t border-white/5 pt-6">
            <LogOut className="w-5 h-5" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto w-full relative">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-neutral-100 rounded-xl"><Menu className="w-6 h-6" /></button>
            <h1 className="font-bold text-lg">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center font-bold text-lime-700 border border-lime-200">{profile?.full_name?.charAt(0)}</div>
          </div>
        </header>

        <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto space-y-8">
          {activeTab === 'Overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                 <div>
                   <h2 className="text-3xl font-black text-[#0A1D11]">Welcome, {profile?.full_name?.split(' ')[0]}!</h2>
                   <p className="text-neutral-500 font-medium">Platform status: Active & Secured.</p>
                 </div>
                 {userRole === 'Farmer' && <button onClick={() => setIsAddingListing(true)} className="bg-[#0A1D11] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl"><PlusCircle className="w-5 h-5 text-lime-400" /> New Harvest</button>}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-200 shadow-sm">
                   <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Platform Role</p>
                   <h3 className="text-4xl font-black text-[#0A1D11] mt-2">{userRole}</h3>
                 </div>
                 <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-200 shadow-sm">
                   <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Total Orders</p>
                   <h3 className="text-4xl font-black text-[#0A1D11] mt-2">{orders.length}</h3>
                 </div>
                 <div className="bg-lime-400 p-8 rounded-[2.5rem] shadow-xl text-[#0A1D11]">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Verified Balance</p>
                    <h3 className="text-4xl font-black mt-2">₦{(orders.reduce((a,b) => a + (b.total_price || 0), 0)).toLocaleString()}</h3>
                 </div>
               </div>

               <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-neutral-200">
                    <h3 className="text-xl font-bold mb-6">Latest Interactions</h3>
                    {orders.length === 0 ? <p className="text-neutral-400 font-medium">No recent trade activity found.</p> : (
                      <div className="space-y-4">
                        {orders.slice(0, 3).map(order => (
                          <div key={order.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                            <div><p className="font-bold">{order.product_name}</p><p className="text-[10px] uppercase font-black text-neutral-400">{new Date(order.created_at).toLocaleDateString()}</p></div>
                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{order.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="bg-[#0A1D11] p-8 rounded-[2.5rem] text-white">
                    <h3 className="text-xl font-bold mb-6">News & Events</h3>
                    <div className="space-y-4">
                      {upcomingEvents.map(ev => (
                        <div key={ev.id} className="flex gap-4 items-center p-4 bg-white/5 rounded-2xl">
                          <div className="text-lime-400">{ev.icon}</div>
                          <div><p className="font-bold text-sm">{ev.title}</p><p className="text-[10px] text-white/40 uppercase font-black">{ev.date} • {ev.type}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'Marketplace' && userRole === 'Buyer' && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-black">Trade Center</h2>
                <div className="bg-lime-100 text-lime-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">{marketProducts.length} Items Live</div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {marketProducts.map(p => (
                  <div key={p.id} className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                    <div className="h-48 relative"><img src={p.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /></div>
                    <div className="p-8 space-y-4">
                       <h4 className="text-xl font-bold">{p.name}</h4>
                       <div className="flex items-center justify-between">
                          <p className="font-black text-2xl text-[#0A1D11]">₦{p.price.toLocaleString()}</p>
                          <p className="text-xs text-neutral-400 font-bold">per {p.unit || 'kg'}</p>
                       </div>
                       <button onClick={() => {setCheckoutProduct(p); setOrderQty(1);}} className="w-full py-4 bg-[#0A1D11] text-white rounded-2xl font-black text-xs uppercase hover:bg-lime-400 hover:text-[#0A1D11] transition-all">Buy Now</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {checkoutProduct && (
            <div className="fixed inset-0 z-50 bg-[#0A1D11]/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
                 <div className="grid lg:grid-cols-2">
                    <div className="bg-neutral-100 p-8 flex flex-col justify-between">
                       <div>
                         <button onClick={() => setCheckoutProduct(null)} className="flex items-center gap-2 text-neutral-400 hover:text-[#0A1D11] mb-8 font-bold text-xs uppercase"><ArrowLeft className="w-4 h-4" /> Cancel</button>
                         <h3 className="text-3xl font-black mb-2">{checkoutProduct.name}</h3>
                         <p className="text-neutral-500 font-medium mb-6">Source: {checkoutProduct.profiles?.full_name}</p>
                         <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-neutral-200 mb-4">
                            <Truck className="w-8 h-8 text-lime-500" />
                            <div><p className="font-bold text-sm">Insured Delivery</p><p className="text-[10px] text-neutral-400 font-bold uppercase">Escrow Release Policy</p></div>
                         </div>
                       </div>
                       <img src={checkoutProduct.image_url} className="w-full h-48 object-cover rounded-3xl" />
                    </div>
                    <div className="p-8 lg:p-12 space-y-8">
                       <div className="space-y-2">
                          <h4 className="text-xs font-black uppercase text-neutral-400 tracking-widest">Order Details</h4>
                          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                             <span className="font-bold">Unit Price</span>
                             <span className="font-black">₦{checkoutProduct.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between py-4">
                             <span className="font-bold">Quantity ({checkoutProduct.unit || 'kg'})</span>
                             <div className="flex items-center gap-4 bg-neutral-50 rounded-xl p-2">
                                <button onClick={() => setOrderQty(Math.max(1, orderQty - 1))} className="w-8 h-8 bg-white border rounded-lg font-bold hover:bg-neutral-100">-</button>
                                <span className="font-black px-2">{orderQty}</span>
                                <button onClick={() => setOrderQty(orderQty + 1)} className="w-8 h-8 bg-white border rounded-lg font-bold hover:bg-neutral-100">+</button>
                             </div>
                          </div>
                       </div>
                       <div className="bg-lime-50 p-6 rounded-3xl border border-lime-100 space-y-4">
                          <div className="flex justify-between items-center"><span className="text-sm font-bold text-lime-700">Total Sum</span><span className="text-2xl font-black text-[#0A1D11]">₦{(checkoutProduct.price * orderQty).toLocaleString()}</span></div>
                          <button onClick={handleCreateOrder} disabled={isOrdering} className="w-full py-5 bg-[#0A1D11] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all">
                             {isOrdering ? <Loader2 className="animate-spin" /> : <><CreditCard /> Confirm & Pay</>}
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'My Orders' && (
            <div className="bg-white rounded-[2.5rem] border border-neutral-200 overflow-hidden shadow-sm animate-in fade-in">
               <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
                 <h3 className="text-xl font-bold">Your Trade History</h3>
                 <button onClick={fetchProfileAndData} className="p-2 hover:bg-neutral-50 rounded-xl transition-colors"><RefreshCw className="w-4 h-4" /></button>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-neutral-50 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                       <tr><th className="px-8 py-4">Trade Item</th><th className="px-8 py-4">Volume</th><th className="px-8 py-4">Total Amount</th><th className="px-8 py-4">Date</th><th className="px-8 py-4">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                       {orders.map(o => (
                         <tr key={o.id} className="hover:bg-neutral-50/50">
                           <td className="px-8 py-6 font-bold">{o.product_name}</td>
                           <td className="px-8 py-6 text-sm font-medium">{o.quantity} {o.unit}</td>
                           <td className="px-8 py-6 font-black">₦{o.total_price.toLocaleString()}</td>
                           <td className="px-8 py-6 text-xs text-neutral-400">{new Date(o.created_at).toLocaleDateString()}</td>
                           <td className="px-8 py-6">
                             <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${o.status === 'Pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{o.status}</span>
                           </td>
                         </tr>
                       ))}
                       {orders.length === 0 && <tr><td colSpan={5} className="p-20 text-center text-neutral-400 font-bold">No orders placed yet.</td></tr>}
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

const MoreVertical = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
);
const PackageSearch = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="M16.5 9.4 7.55 4.24"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/><circle cx="18.5" cy="15.5" r="2.5"/><path d="M20.27 17.27 22 19"/></svg>
);

export default Dashboard;
