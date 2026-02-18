
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, User as UserIcon, Bell, 
  LogOut, Leaf, Plus, TrendingUp, Clock, Menu, X, Settings,
  Trash2, RefreshCw, Users, Loader2, Save, ShoppingBag, Box, Image as ImageIcon,
  PlusCircle, CheckCircle2, Edit2, Calendar, MapPin, ExternalLink, Wallet
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
  const [orders, setOrders] = useState<any[]>([]);
  const [onboardedEntities, setOnboardedEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingListing, setIsAddingListing] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const upcomingEvents = [
    { id: 1, title: 'Organic Harvest Webinar', date: 'June 15, 2024', type: 'Workshop', icon: <Calendar className="w-5 h-5 text-lime-500" /> },
    { id: 2, title: 'Global Export Summit', date: 'July 02, 2024', type: 'Conference', icon: <ExternalLink className="w-5 h-5 text-blue-500" /> },
    { id: 3, title: 'Soil Health Workshop', date: 'July 18, 2024', type: 'Practical', icon: <Leaf className="w-5 h-5 text-green-500" /> },
  ];

  // Listing Form State
  const [newListing, setNewListing] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Vegetables',
    unit: 'kg',
    image_url: ''
  });

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
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from('listings').insert([{
        farmer_id: user.id,
        name: newListing.name,
        description: newListing.description,
        price: parseFloat(newListing.price),
        stock: parseFloat(newListing.stock),
        category: newListing.category,
        unit: newListing.unit,
        image_url: newListing.image_url || `https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=400`
      }]);

      if (error) throw error;
      
      setNewListing({ name: '', description: '', price: '', stock: '', category: 'Vegetables', unit: 'kg', image_url: '' });
      setIsAddingListing(false);
      fetchProfileAndData();
    } catch (err: any) {
      alert(err.message || "Failed to add listing");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const { error } = await supabase.from('listings').delete().eq('id', id);
    if (!error) fetchProfileAndData();
  };

  const userRole = profile?.user_type || user.user_metadata?.user_type;
  const agentCode = profile?.referral_code || 'AGR-PENDING';

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    ...(userRole === 'Agent' ? [{ name: 'My Network', icon: Users }] : []),
    ...(userRole === 'Farmer' ? [{ name: 'My Listings', icon: Package }, { name: 'Orders', icon: ShoppingCart }] : []),
    { name: 'Profile', icon: UserIcon },
  ];

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-[#0A1D11] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-lime-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5] flex font-['Plus_Jakarta_Sans'] text-[#0A1D11]">
      {/* Sidebar - Mobile Responsive */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0A1D11] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3 cursor-pointer" onClick={onGoHome}>
              <div className="bg-lime-400 p-1.5 rounded-lg">
                <Leaf className="w-6 h-6 text-[#0A1D11]" />
              </div>
              <span className="text-xl font-extrabold text-white">AgriLink</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/60">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <button 
                key={item.name} 
                onClick={() => { setActiveTab(item.name); setIsAddingListing(false); if(window.innerWidth < 1024) setIsSidebarOpen(false); }} 
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === item.name ? 'bg-lime-400 text-[#0A1D11]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon className="w-5 h-5" /> {item.name}
              </button>
            ))}
          </div>

          <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
            <button onClick={onSignOut} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-red-400 hover:bg-red-400/10 transition-all">
              <LogOut className="w-5 h-5" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 hover:bg-neutral-100 rounded-xl transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-bold text-lg hidden sm:block">{activeTab}</h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <p className="text-[10px] font-black uppercase text-neutral-400">{userRole}</p>
               <p className="text-sm font-bold">{profile?.full_name}</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center font-bold text-lime-700 border border-lime-200">
               {profile?.full_name?.charAt(0)}
             </div>
          </div>
        </header>

        {/* Dynamic Body */}
        <div className="p-4 sm:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 lg:space-y-12">
          {activeTab === 'Overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                 <div>
                   <h2 className="text-3xl sm:text-4xl font-black text-[#0A1D11]">Welcome, {profile?.full_name?.split(' ')[0]}!</h2>
                   <p className="text-neutral-500 font-medium">Your agricultural command center is active.</p>
                 </div>
                 {userRole === 'Farmer' && (
                   <button onClick={() => setIsAddingListing(true)} className="w-full sm:w-auto bg-[#0A1D11] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-[#0A1D11]/20 hover:scale-[1.02] transition-transform">
                     <PlusCircle className="w-5 h-5 text-lime-400" /> New Market Item
                   </button>
                 )}
               </div>

               {isAddingListing && (
                 <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border-2 border-lime-400/20 shadow-xl animate-in slide-in-from-top-4 duration-300">
                   <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-bold flex items-center gap-2">Publish New Listing</h3>
                     <button onClick={() => setIsAddingListing(false)} className="p-2 hover:bg-neutral-50 rounded-full transition-colors"><X /></button>
                   </div>
                   <form onSubmit={handleAddListing} className="grid md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-neutral-400 uppercase">Product Name</label>
                       <input required type="text" value={newListing.name} onChange={e => setNewListing({...newListing, name: e.target.value})} placeholder="e.g. Premium Cocoa Beans" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-lime-400" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-neutral-400 uppercase">Category</label>
                       <select value={newListing.category} onChange={e => setNewListing({...newListing, category: e.target.value})} className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-lime-400">
                          <option>Vegetables</option><option>Fruits</option><option>Grains</option><option>Tubers</option><option>Legumes</option>
                       </select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-neutral-400 uppercase">Price (₦)</label>
                       <input required type="number" value={newListing.price} onChange={e => setNewListing({...newListing, price: e.target.value})} placeholder="Price per unit" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-lime-400" />
                     </div>
                     <div className="space-y-2">
                       <label className="text-xs font-bold text-neutral-400 uppercase">Current Stock</label>
                       <input required type="number" value={newListing.stock} onChange={e => setNewListing({...newListing, stock: e.target.value})} placeholder="Available quantity" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-lime-400" />
                     </div>
                     <div className="md:col-span-2 space-y-2">
                       <label className="text-xs font-bold text-neutral-400 uppercase">Description</label>
                       <textarea className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 outline-none focus:border-lime-400 resize-none" rows={3} placeholder="Tell buyers about your produce..." value={newListing.description} onChange={e => setNewListing({...newListing, description: e.target.value})} />
                     </div>
                     <button type="submit" className="md:col-span-2 bg-lime-400 text-[#0A1D11] py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-lime-300 shadow-xl shadow-lime-400/10">
                       {loading ? <Loader2 className="animate-spin" /> : <Save />} Post to Marketplace
                     </button>
                   </form>
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {userRole === 'Agent' ? (
                   <div className="bg-[#0A1D11] p-8 rounded-[2.5rem] text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/10 blur-3xl -mr-10 -mt-10 group-hover:bg-lime-400/20 transition-all"></div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-lime-400">Your Agent Referral ID</p>
                     <h3 className="text-4xl font-black font-mono mt-4">{agentCode}</h3>
                     <button onClick={() => {navigator.clipboard.writeText(agentCode); alert('Code Copied!');}} className="mt-8 bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">Copy Referral ID</button>
                   </div>
                 ) : (
                   <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow">
                     <div className="flex justify-between items-start mb-4">
                       <div className="p-3 bg-lime-100 text-lime-600 rounded-2xl"><Box className="w-6 h-6" /></div>
                       <TrendingUp className="text-green-500 w-5 h-5" />
                     </div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Live Inventory</p>
                     <h3 className="text-4xl font-black text-[#0A1D11] mt-2">{listings.length} <span className="text-lg font-medium text-neutral-400">Items</span></h3>
                   </div>
                 )}
                 <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow">
                   <div className="flex justify-between items-start mb-4">
                     <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><Wallet className="w-6 h-6" /></div>
                     <span className="text-xs font-bold text-blue-600">+12% vs last mo</span>
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Net Platform Revenue</p>
                   <h3 className="text-4xl font-black text-[#0A1D11] mt-2">₦{(orders.reduce((a,b) => a + (b.total_price || 0), 0)).toLocaleString()}</h3>
                 </div>
                 <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-200 shadow-sm hover:shadow-lg transition-shadow">
                   <div className="flex justify-between items-start mb-4">
                     <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl"><ShoppingBag className="w-6 h-6" /></div>
                     <div className="flex gap-1">
                       <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                     </div>
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Active Trade Requests</p>
                   <h3 className="text-4xl font-black text-[#0A1D11] mt-2">{orders.filter(o => o.status === 'Pending').length} <span className="text-lg font-medium text-neutral-400">Pending</span></h3>
                 </div>
               </div>

               {/* Second Row: Latest Activity & Upcoming Events */}
               <div className="grid lg:grid-cols-3 gap-8">
                  {/* Activity Table */}
                  <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
                       <h3 className="text-xl font-bold">Activity Log</h3>
                       <button onClick={fetchProfileAndData} className="p-2 hover:bg-neutral-50 rounded-xl transition-colors"><RefreshCw className="w-5 h-5 text-neutral-300" /></button>
                    </div>
                    <div className="overflow-x-auto scroll-hide">
                      {listings.length === 0 && userRole === 'Farmer' ? (
                        <div className="p-20 text-center space-y-4">
                          <PackageSearch className="w-16 h-16 text-neutral-200 mx-auto" />
                          <p className="font-bold text-neutral-400 uppercase tracking-widest text-xs">No active listings yet</p>
                        </div>
                      ) : (
                        <table className="w-full text-left">
                           <thead className="bg-neutral-50 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                             <tr><th className="px-8 py-4">Context</th><th className="px-8 py-4">Metric</th><th className="px-8 py-4">Status</th><th className="px-8 py-4 text-right">Actions</th></tr>
                           </thead>
                           <tbody className="divide-y divide-neutral-100">
                             {(userRole === 'Farmer' ? listings : onboardedEntities).slice(0, 5).map(item => (
                               <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                                 <td className="px-8 py-6">
                                   <p className="font-bold">{userRole === 'Farmer' ? item.name : item.full_name}</p>
                                   <p className="text-[10px] text-neutral-400 uppercase">{userRole === 'Farmer' ? item.category : item.user_type}</p>
                                 </td>
                                 <td className="px-8 py-6 font-medium text-neutral-600">
                                   {userRole === 'Farmer' ? `₦${item.price.toLocaleString()}` : `ID: ${item.id.slice(0,8)}`}
                                 </td>
                                 <td className="px-8 py-6">
                                   <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit">
                                      <CheckCircle2 className="w-3 h-3" /> Live
                                   </span>
                                 </td>
                                 <td className="px-8 py-6 text-right">
                                    <button className="p-2 text-neutral-300 hover:text-neutral-900"><MoreVertical className="w-4 h-4" /></button>
                                 </td>
                               </tr>
                             ))}
                           </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                  {/* Upcoming Events Column */}
                  <div className="bg-[#0A1D11] rounded-[2.5rem] p-8 text-white relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 blur-3xl -mr-10 -mt-10"></div>
                    <div className="flex items-center justify-between mb-8 relative">
                      <h3 className="text-xl font-bold">Upcoming Events</h3>
                      <Calendar className="text-lime-400 w-6 h-6" />
                    </div>
                    <div className="space-y-4 relative flex-1">
                      {upcomingEvents.map(event => (
                        <div key={event.id} className="bg-white/5 border border-white/10 p-5 rounded-3xl hover:bg-white/10 transition-colors cursor-pointer group">
                           <div className="flex items-center gap-4">
                              <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                                {event.icon}
                              </div>
                              <div>
                                <p className="font-bold text-sm">{event.title}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">{event.date}</span>
                                  <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded-full uppercase text-white/60 font-black">{event.type}</span>
                                </div>
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                    <button className="mt-8 py-4 bg-lime-400 text-[#0A1D11] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-lime-300 transition-all">
                      View Event Hub
                    </button>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'My Listings' && userRole === 'Farmer' && (
             <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <h2 className="text-2xl font-bold">Inventory Manager</h2>
                  <button onClick={() => setIsAddingListing(true)} className="w-full sm:w-auto bg-[#0A1D11] text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {listings.map(item => (
                     <div key={item.id} className="bg-white rounded-[2.5rem] border border-neutral-200 overflow-hidden group shadow-sm hover:shadow-xl transition-all">
                       <div className="h-48 relative bg-neutral-100">
                         <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                         <div className="absolute top-4 right-4 flex gap-2">
                            <button onClick={() => handleDeleteListing(item.id)} className="p-2 bg-white/90 backdrop-blur rounded-full shadow-sm text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                         </div>
                       </div>
                       <div className="p-6 space-y-4">
                          <div className="flex justify-between items-start">
                             <div>
                               <h4 className="font-bold text-lg">{item.name}</h4>
                               <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">{item.category}</p>
                             </div>
                             <div className="text-right">
                               <p className="font-black text-lime-600 text-lg">₦{item.price.toLocaleString()}</p>
                               <p className="text-[8px] font-bold text-neutral-400 uppercase">per {item.unit || 'kg'}</p>
                             </div>
                          </div>
                          <div className="flex items-center justify-between border-t border-neutral-50 pt-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-neutral-400 uppercase">Stock Level</span>
                              <span className="font-bold">{item.stock} {item.unit || 'kg'}</span>
                            </div>
                            <button className="text-[10px] font-black uppercase text-lime-600 flex items-center gap-1 hover:gap-2 transition-all">Edit Listing <Edit2 className="w-3 h-3" /></button>
                          </div>
                       </div>
                     </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'Profile' && (
            <div className="max-w-2xl bg-white p-8 sm:p-12 rounded-[2.5rem] border border-neutral-200 shadow-sm animate-in slide-in-from-bottom-4">
               <div className="flex items-center gap-8 mb-12">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-[2.5rem] bg-lime-100 flex items-center justify-center text-lime-700 text-4xl sm:text-5xl font-black border-4 border-white shadow-xl">
                    {profile?.full_name?.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black">{profile?.full_name}</h2>
                    <p className="text-neutral-500 font-medium">{userRole} Account</p>
                    <div className="flex items-center gap-2 mt-2 text-green-600 text-xs font-bold uppercase tracking-widest">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      ID Verified
                    </div>
                  </div>
               </div>

               <div className="space-y-6">
                 <div className="p-6 bg-neutral-50 rounded-2xl space-y-1">
                   <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Email Address</p>
                   <p className="font-bold">{profile?.email}</p>
                 </div>
                 <div className="p-6 bg-neutral-50 rounded-2xl space-y-1">
                   <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Location</p>
                   <p className="font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-neutral-300" /> {profile?.location || 'Lagos, Nigeria'}</p>
                 </div>
                 {userRole === 'Agent' && (
                   <div className="p-6 bg-[#0A1D11] text-white rounded-2xl space-y-1">
                     <p className="text-[10px] font-black text-lime-400 uppercase tracking-widest">Referral Link</p>
                     <p className="font-mono text-sm">agrilink.chain/join?ref={profile?.referral_code}</p>
                   </div>
                 )}
               </div>

               <button className="w-full mt-10 py-5 bg-[#0A1D11] text-white rounded-2xl font-black text-lg hover:bg-neutral-800 transition-all shadow-xl shadow-[#0A1D11]/10">
                 Edit Public Profile
               </button>
            </div>
          )}
        </div>
      </main>
      <style>{`
        .scroll-hide::-webkit-scrollbar { display: none; }
        .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

// Re-importing missing icons
const MoreVertical = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
);
const PackageSearch = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="M16.5 9.4 7.55 4.24"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/><circle cx="18.5" cy="15.5" r="2.5"/><path d="M20.27 17.27 22 19"/></svg>
);

export default Dashboard;
