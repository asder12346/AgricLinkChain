
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, User as UserIcon, Bell, 
  LogOut, Leaf, Plus, TrendingUp, Clock, Menu, X, Settings,
  Trash2, RefreshCw, Users, Loader2, Save, ShoppingBag, Box, Image as ImageIcon,
  PlusCircle, CheckCircle2, Edit2
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DashboardProps {
  user: any;
  onSignOut: () => void;
  onGoHome: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut, onGoHome }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [onboardedEntities, setOnboardedEntities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingListing, setIsAddingListing] = useState(false);

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

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfileAndData();
  }, [user.id]);

  const fetchProfileAndData = async () => {
    setLoading(true);
    try {
      // Get detailed profile
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
    <div className="min-h-screen bg-[#F8FAF9] flex font-['Plus_Jakarta_Sans']">
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0A1D11] transform transition-all duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-lime-400 p-1.5 rounded-lg cursor-pointer" onClick={onGoHome}><Leaf className="w-6 h-6 text-[#0A1D11]" /></div>
            <span className="text-xl font-extrabold text-white">AgriLinkChain</span>
          </div>
          <div className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <button key={item.name} onClick={() => { setActiveTab(item.name); setIsAddingListing(false); }} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === item.name ? 'bg-lime-400 text-[#0A1D11]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                <item.icon className="w-5 h-5" /> {item.name}
              </button>
            ))}
          </div>
          <button onClick={onSignOut} className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-red-400 hover:bg-red-400/10 transition-all border-t border-white/5 pt-6">
            <LogOut className="w-5 h-5" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2"><Menu className="w-6 h-6" /></button>
          <h1 className="font-bold text-lg">{activeTab}</h1>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <p className="text-xs font-black uppercase text-neutral-400">{userRole}</p>
               <p className="text-sm font-bold">{profile?.full_name}</p>
             </div>
             <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center font-bold text-lime-700">{profile?.full_name?.charAt(0)}</div>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-10">
          {activeTab === 'Overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                 <div>
                   <h2 className="text-3xl font-black text-[#0A1D11]">Hello, {profile?.full_name?.split(' ')[0]}!</h2>
                   <p className="text-neutral-500 font-medium">Manage your agricultural hub from one place.</p>
                 </div>
                 {userRole === 'Farmer' && (
                   <button onClick={() => setIsAddingListing(true)} className="bg-lime-400 text-[#0A1D11] px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-lime-400/20">
                     <Plus className="w-5 h-5" /> New Product
                   </button>
                 )}
               </div>

               {isAddingListing && (
                 <div className="bg-white p-8 rounded-[2.5rem] border-2 border-lime-400/20">
                   <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-bold flex items-center gap-2"><PlusCircle className="text-lime-500" /> List New Produce</h3>
                     <button onClick={() => setIsAddingListing(false)} className="text-neutral-400"><X /></button>
                   </div>
                   <form onSubmit={handleAddListing} className="grid md:grid-cols-2 gap-6">
                     <input required type="text" value={newListing.name} onChange={e => setNewListing({...newListing, name: e.target.value})} placeholder="Product Name" className="w-full bg-neutral-50 border rounded-xl px-4 py-3" />
                     <select value={newListing.category} onChange={e => setNewListing({...newListing, category: e.target.value})} className="w-full bg-neutral-50 border rounded-xl px-4 py-3">
                        <option>Vegetables</option><option>Fruits</option><option>Grains</option><option>Tubers</option>
                     </select>
                     <input required type="number" value={newListing.price} onChange={e => setNewListing({...newListing, price: e.target.value})} placeholder="Price (₦)" className="w-full bg-neutral-50 border rounded-xl px-4 py-3" />
                     <input required type="number" value={newListing.stock} onChange={e => setNewListing({...newListing, stock: e.target.value})} placeholder="Stock Count" className="w-full bg-neutral-50 border rounded-xl px-4 py-3" />
                     <textarea className="md:col-span-2 w-full bg-neutral-50 border rounded-xl px-4 py-3" rows={3} placeholder="Description" value={newListing.description} onChange={e => setNewListing({...newListing, description: e.target.value})} />
                     <button type="submit" className="md:col-span-2 bg-[#0A1D11] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2">
                       {loading ? <Loader2 className="animate-spin" /> : <Save />} Post Listing
                     </button>
                   </form>
                 </div>
               )}

               <div className="grid md:grid-cols-3 gap-6">
                 {userRole === 'Agent' ? (
                   <div className="bg-[#0A1D11] p-8 rounded-[2.5rem] text-white flex flex-col justify-between shadow-xl">
                     <p className="text-[10px] font-black uppercase tracking-widest text-lime-400">Your Referral Code</p>
                     <h3 className="text-4xl font-black font-mono mt-2">{agentCode}</h3>
                     <button onClick={() => {navigator.clipboard.writeText(agentCode); alert('Copied!');}} className="mt-6 bg-lime-400 text-[#0A1D11] py-3 rounded-xl font-bold text-xs uppercase">Copy ID</button>
                   </div>
                 ) : (
                   <div className="bg-lime-400 p-8 rounded-[2.5rem] text-[#0A1D11] shadow-xl">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Active Listings</p>
                     <h3 className="text-4xl font-black mt-2">{listings.length} Products</h3>
                   </div>
                 )}
                 <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
                   <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Revenue</p>
                   <h3 className="text-4xl font-black text-[#0A1D11] mt-2">₦{(orders.reduce((a,b) => a + (b.total_price || 0), 0)).toLocaleString()}</h3>
                 </div>
                 <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm">
                   <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Pending Orders</p>
                   <h3 className="text-4xl font-black text-[#0A1D11] mt-2">{orders.filter(o => o.status === 'Pending').length}</h3>
                 </div>
               </div>

               {userRole === 'Farmer' && listings.length > 0 && (
                 <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
                       <h3 className="text-xl font-bold">Latest Listings</h3>
                       <button onClick={fetchProfileAndData} className="text-lime-600 font-bold text-xs flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Sync</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead className="bg-neutral-50 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                           <tr><th className="px-8 py-4">Product</th><th className="px-8 py-4">Price</th><th className="px-8 py-4">Stock</th><th className="px-8 py-4 text-right">Action</th></tr>
                         </thead>
                         <tbody className="divide-y divide-neutral-100">
                           {listings.slice(0, 5).map(item => (
                             <tr key={item.id} className="hover:bg-neutral-50/50">
                               <td className="px-8 py-6 font-bold">{item.name}</td>
                               <td className="px-8 py-6">₦{item.price.toLocaleString()}</td>
                               <td className="px-8 py-6">{item.stock} {item.unit}</td>
                               <td className="px-8 py-6 text-right"><button onClick={() => handleDeleteListing(item.id)} className="text-red-400"><Trash2 className="w-4 h-4" /></button></td>
                             </tr>
                           ))}
                         </tbody>
                      </table>
                    </div>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'My Network' && userRole === 'Agent' && (
            <div className="bg-white rounded-[2.5rem] border border-neutral-100 overflow-hidden shadow-sm animate-in fade-in">
              <div className="p-8 border-b border-neutral-100"><h3 className="text-xl font-bold">Referred Partners</h3></div>
              <table className="w-full text-left">
                <thead className="bg-neutral-50 text-[10px] font-black text-neutral-400 uppercase"><tr><th className="px-8 py-4">Name</th><th className="px-8 py-4">Role</th><th className="px-8 py-4">Joined</th></tr></thead>
                <tbody className="divide-y divide-neutral-100">
                  {onboardedEntities.map(e => (
                    <tr key={e.id} className="hover:bg-neutral-50/50"><td className="px-8 py-6 font-bold">{e.full_name}</td><td className="px-8 py-6">{e.user_type}</td><td className="px-8 py-6 text-neutral-400">{new Date(e.created_at).toLocaleDateString()}</td></tr>
                  ))}
                  {onboardedEntities.length === 0 && <tr><td colSpan={3} className="p-12 text-center text-neutral-400">No network data yet</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
