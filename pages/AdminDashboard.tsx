
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, ShoppingBag, Package, Wallet, ShieldCheck,
  LogOut, Menu, X, RefreshCw, CheckCircle2, Building2, Leaf, Loader2, Search,
  MoreVertical, PackageSearch, Trash2, Eye, Download
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  onSignOut: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  const [userStats, setUserStats] = useState({ farmers: 0, buyers: 0, agents: 0, total: 0 });
  const [revenue, setRevenue] = useState(0);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminData();

    const productSubscription = supabase
      .channel('admin-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, () => fetchAdminData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchAdminData())
      .subscribe();

    return () => {
      supabase.removeChannel(productSubscription);
    };
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profiles) {
        setAllUsers(profiles);
        setUserStats({
          farmers: profiles.filter(p => p.user_type === 'Farmer').length,
          buyers: profiles.filter(p => p.user_type === 'Buyer').length,
          agents: profiles.filter(p => p.user_type === 'Agent').length,
          total: profiles.length
        });
      }

      const { data: listings, error: listingError } = await supabase
        .from('listings')
        .select(`*, profiles(full_name)`)
        .order('created_at', { ascending: false });

      if (listings) setProducts(listings);

      const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (orders) {
        setTransactions(orders);
        setRevenue(orders.reduce((acc, curr) => acc + (curr.total_price || 0), 0));
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    const { error } = await supabase.from('listings').delete().eq('id', id);
    if (!error) fetchAdminData();
  };

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName], (key, value) => value === null ? '' : value)).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Users', icon: Users },
    { name: 'Products', icon: Package },
    { name: 'Transactions', icon: Wallet },
    { name: 'Security', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex font-['Plus_Jakarta_Sans'] text-[#0A1D11]">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A1D11] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="rounded-full shadow-lg shadow-lime-400/20 overflow-hidden w-10 h-10 flex items-center justify-center">
              <img src="/logo.png" className="w-full h-full object-cover rounded-full" alt="Logo" />
            </div>
            <span className="text-xl font-extrabold text-white">Staff Admin</span>
          </div>
          <div className="space-y-1 flex-1">
            <p className="px-4 mb-4 text-[10px] font-black text-white/30 uppercase tracking-widest">Master Control</p>
            {menuItems.map((item) => (
              <button key={item.name} onClick={() => setActiveTab(item.name)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.name ? 'bg-lime-400 text-[#0A1D11]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                <item.icon className="w-5 h-5" /> {item.name}
              </button>
            ))}
          </div>
          <button onClick={onSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-red-400/10 transition-all border-t border-white/5 pt-6">
            <LogOut className="w-5 h-5" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-neutral-100 rounded-xl"><Menu className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold">{activeTab}</h2>
          </div>
          <button onClick={fetchAdminData} className="flex items-center gap-2 text-lime-600 font-bold text-xs uppercase bg-lime-50 px-4 py-2 rounded-full">
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Sync Database
          </button>
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-10">
          {activeTab === 'Overview' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Volume', value: `₦${revenue.toLocaleString()}`, icon: Wallet, color: 'text-green-500' },
                  { label: 'Farmers', value: userStats.farmers, icon: Users, color: 'text-blue-500' },
                  { label: 'Buyers', value: userStats.buyers, icon: ShoppingBag, color: 'text-orange-500' },
                  { label: 'Agents', value: userStats.agents, icon: Building2, color: 'text-lime-500' }
                ].map((stat) => (
                  <div key={stat.label} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm group hover:border-lime-400/30 transition-all">
                    <div className={`p-3 w-fit rounded-2xl bg-neutral-50 mb-4 ${stat.color}`}><stat.icon className="w-6 h-6" /></div>
                    <h4 className="text-2xl font-black">{stat.value}</h4>
                    <p className="text-neutral-400 text-[10px] font-black uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                    <h3 className="font-bold">Recent Signups</h3>
                    <button onClick={() => setActiveTab('Users')} className="text-[10px] font-black uppercase text-lime-600">See All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-neutral-50 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                        <tr><th className="px-6 py-4">User</th><th className="px-6 py-4">Role</th><th className="px-6 py-4 text-right">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {allUsers.slice(0, 5).map((u) => (
                          <tr key={u.id} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div><p className="text-sm font-bold">{u.full_name}</p><p className="text-[10px] text-neutral-400">{u.email}</p></div>
                            </td>
                            <td className="px-6 py-4"><span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 uppercase tracking-widest">{u.user_type}</span></td>
                            <td className="px-6 py-4 text-right"><CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-[#0A1D11] rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-lime-400/20 blur-[60px] rounded-full"></div>
                  <h3 className="text-xl font-bold mb-6">Market Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-xs font-bold text-white/60">Live Listings</span>
                      <span className="text-xl font-black text-lime-400">{products.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                      <span className="text-xs font-bold text-white/60">Total Users</span>
                      <span className="text-xl font-black text-lime-400">{allUsers.length}</span>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab('Products')} className="mt-8 bg-lime-400 text-[#0A1D11] py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-lime-300 transition-all">Audit Products</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Users' && (
            <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
              <div className="p-8 border-b border-neutral-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">User Management</h2>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => exportToCSV(allUsers, 'agrilink_users')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0A1D11] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-lime-400 hover:text-[#0A1D11] transition-all"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input type="text" placeholder="Search accounts..." className="bg-neutral-50 border border-neutral-100 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-lime-400" />
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-neutral-50 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Name / ID</th>
                      <th className="px-8 py-4">Role</th>
                      <th className="px-8 py-4">Contact</th>
                      <th className="px-8 py-4">Linked Agent</th>
                      <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {allUsers.map(u => (
                      <tr key={u.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-bold text-sm">{u.full_name}</p>
                          <p className="text-[10px] font-mono text-neutral-400">{u.id.slice(0, 13)}...</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${u.user_type === 'Farmer' ? 'bg-blue-100 text-blue-700' :
                            u.user_type === 'Agent' ? 'bg-lime-100 text-lime-700' : 'bg-neutral-100 text-neutral-700'
                            }`}>{u.user_type}</span>
                        </td>
                        <td className="px-8 py-6 text-xs text-neutral-500">{u.email}</td>
                        <td className="px-8 py-6 text-xs font-mono text-neutral-400">{u.referred_by || '--'}</td>
                        <td className="px-8 py-6 text-right"><button className="p-2 text-neutral-300 hover:text-[#0A1D11]"><MoreVertical className="w-4 h-4" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Products' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-2xl font-bold">Platform Inventory Audit</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => exportToCSV(products, 'agrilink_inventory')}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#0A1D11] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-lime-400 hover:text-[#0A1D11] transition-all shadow-xl"
                  >
                    <Download className="w-4 h-4" /> Export Inventory
                  </button>
                  <div className="bg-lime-100 text-lime-700 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">{products.length} Items Live</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(item => (
                  <div key={item.id} className="bg-white rounded-[2rem] border border-neutral-100 overflow-hidden shadow-sm group">
                    <div className="h-40 relative bg-neutral-100">
                      <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute top-4 left-4 bg-[#0A1D11]/80 backdrop-blur-md px-3 py-1 rounded-full text-white text-[8px] font-black uppercase tracking-widest">
                        {item.category}
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold">Farmer: {item.profiles?.full_name || 'N/A'}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-neutral-50 pt-4">
                        <p className="font-black text-lg text-[#0A1D11]">₦{item.price.toLocaleString()}</p>
                        <div className="flex gap-2">
                          <button className="p-2 bg-neutral-50 rounded-lg text-neutral-400 hover:text-blue-500"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => deleteProduct(item.id)} className="p-2 bg-neutral-50 rounded-lg text-neutral-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'Transactions' && (
            <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
              <div className="p-8 border-b border-neutral-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Transaction Ledger</h2>
                <button
                  onClick={() => exportToCSV(transactions, 'agrilink_transactions')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#0A1D11] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-lime-400 hover:text-[#0A1D11] transition-all shadow-xl"
                >
                  <Download className="w-4 h-4" /> Export Ledger
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-neutral-50 text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Transaction ID</th>
                      <th className="px-8 py-4">Buyer ID</th>
                      <th className="px-8 py-4">Amount</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {transactions.map(t => (
                      <tr key={t.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-8 py-6 font-mono text-xs">{t.id.slice(0, 16).toUpperCase()}</td>
                        <td className="px-8 py-6 text-xs text-neutral-500 font-mono">{t.buyer_id.slice(0, 16)}...</td>
                        <td className="px-8 py-6 font-bold">₦{t.total_amount?.toLocaleString() || '0'}</td>
                        <td className="px-8 py-6">
                          <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${t.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>{t.status}</span>
                        </td>
                        <td className="px-8 py-6 text-right text-xs font-bold text-neutral-400">{new Date(t.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr><td colSpan={5} className="px-8 py-20 text-center text-neutral-300 font-bold">No transactions found.</td></tr>
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

export default AdminDashboard;
