
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Package, 
  Wallet, 
  BarChart4, 
  ShieldCheck, 
  LogOut, 
  Search, 
  Menu, 
  X, 
  Bell, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Building2,
  History,
  Trash2,
  Settings,
  Leaf
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminDashboardProps {
  onSignOut: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Mocking data for admin insights
      const mockUsers = [
        { id: '1', name: 'John Doe', type: 'Farmer', email: 'john@farmer.com', joined: '2024-01-10', status: 'Active' },
        { id: '2', name: 'Global Foods Ltd', type: 'Buyer', email: 'contact@global.com', joined: '2024-01-15', status: 'Verified' },
        { id: '3', name: 'Sarah Agent', type: 'Agent', email: 'sarah@agrilink.com', joined: '2024-02-01', status: 'Active' },
        { id: '4', name: 'City Pharmacy', type: 'Pharmacy', email: 'info@citypharm.com', joined: '2024-02-05', status: 'Active' },
        { id: '5', name: 'Alice Smith', type: 'Farmer', email: 'alice@farm.com', joined: '2024-02-10', status: 'Pending' }
      ];
      setUsers(mockUsers);

      const mockProducts = [
        { id: 'p1', name: 'Organic Ginger', price: 800, unit: 'kg', farmer: 'John Doe', stock: '200kg' },
        { id: 'p2', name: 'Long Grain Rice', price: 25000, unit: 'bag', farmer: 'Alice Smith', stock: '50 bags' },
        { id: 'p3', name: 'Tomato Paste', price: 3000, unit: 'crate', farmer: 'John Doe', stock: '15 crates' }
      ];
      setProducts(mockProducts);

      const { data: realTransactions } = await supabase
        .from('orders')
        .select('*')
        .limit(10)
        .order('created_at', { ascending: false });
      
      setTransactions(realTransactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Users', icon: Users },
    { name: 'Products', icon: Package },
    { name: 'Transactions', icon: Wallet },
    { name: 'Reports', icon: BarChart4 },
    { name: 'Security', icon: ShieldCheck },
    { name: 'Settings', icon: Settings }
  ];

  const stats = [
    { label: 'Total Revenue', value: '₦45.2M', growth: '+12.5%', icon: Wallet, color: 'text-green-500' },
    { label: 'Active Farmers', value: '12,402', growth: '+4.2%', icon: Users, color: 'text-blue-500' },
    { label: 'Total Buyers', value: '45,120', growth: '+8.1%', icon: ShoppingBag, color: 'text-orange-500' },
    { label: 'Agents', value: '2,840', growth: '+2.4%', icon: Building2, color: 'text-lime-500' }
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex font-['Plus_Jakarta_Sans'] text-[#0A1D11]">
      {/* Admin Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0A1D11] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-lime-400 p-1.5 rounded-lg shadow-lg shadow-lime-400/20">
              <Leaf className="w-6 h-6 text-[#0A1D11]" />
            </div>
            <span className="text-xl font-extrabold text-white tracking-tight">Staff Portal</span>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden ml-auto text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-1 flex-1">
            <p className="px-4 mb-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Management</p>
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === item.name ? 'bg-lime-400 text-[#0A1D11]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 px-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center text-[#0A1D11] font-black">AD</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">Admin Staff</p>
                <p className="text-[10px] font-bold text-white/40 uppercase">Super User</p>
              </div>
            </div>
            <button onClick={onSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-red-400/10 transition-all">
              <LogOut className="w-5 h-5" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen relative overflow-y-auto">
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200 px-6 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-neutral-100 rounded-xl">
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="text" placeholder="Search data, users..." className="bg-neutral-100 border-none rounded-xl pl-12 pr-6 py-2.5 w-80 text-sm focus:ring-2 focus:ring-lime-400 transition-all outline-none" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <Bell className="w-6 h-6 text-neutral-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[8px] text-white flex items-center justify-center font-bold">3</span>
            </div>
            <div className="h-8 w-px bg-neutral-200" />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">Platform Status</p>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Healthy</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-12 max-w-7xl mx-auto space-y-10">
          {activeTab === 'Overview' && (
            <div className="space-y-10 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black">Platform Dashboard</h2>
                  <p className="text-neutral-500 font-medium">Global agricultural supply chain performance overview.</p>
                </div>
                <div className="flex gap-3">
                  <button className="bg-white border border-neutral-200 px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-neutral-50 transition-all">
                    <Filter className="w-4 h-4" /> Filter Date
                  </button>
                  <button className="bg-[#0A1D11] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-neutral-800 transition-all">
                    Export Report
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl bg-neutral-50 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-bold ${stat.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.growth.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.growth}
                      </div>
                    </div>
                    <h4 className="text-3xl font-black">{stat.value}</h4>
                    <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Tables Row */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg">Recent User Activity</h3>
                    <button className="text-lime-600 font-bold text-sm hover:underline">View All Users</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-neutral-50 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-left">
                        <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {users.map((u) => (
                          <tr key={u.id} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-xs">{u.name.charAt(0)}</div>
                                <div>
                                  <p className="text-sm font-bold">{u.name}</p>
                                  <p className="text-[10px] text-neutral-400">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest ${
                                u.type === 'Farmer' ? 'bg-orange-100 text-orange-600' : 
                                u.type === 'Pharmacy' ? 'bg-blue-100 text-blue-600' : 
                                u.type === 'Agent' ? 'bg-lime-100 text-lime-700' : 'bg-neutral-100 text-neutral-600'
                              }`}>
                                {u.type}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' || u.status === 'Verified' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
                                <span className="text-xs font-bold text-neutral-500">{u.status}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-neutral-400 hover:text-[#0A1D11]"><MoreVertical className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Products */}
                <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg">Inventory Monitoring</h3>
                    <button className="text-lime-600 font-bold text-sm hover:underline">View Inventory</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-neutral-50 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-left">
                        <tr>
                          <th className="px-6 py-4">Product</th>
                          <th className="px-6 py-4">Farmer</th>
                          <th className="px-6 py-4">Stock</th>
                          <th className="px-6 py-4 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {products.map((p) => (
                          <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-lime-600"><Package className="w-5 h-5" /></div>
                                <p className="text-sm font-bold">{p.name}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-neutral-500">{p.farmer}</td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-bold text-[#0A1D11]">{p.stock}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <p className="text-sm font-black">₦{p.price.toLocaleString()}</p>
                              <p className="text-[8px] text-neutral-400 uppercase tracking-widest">per {p.unit}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Transactions Row */}
              <div className="bg-[#0A1D11] rounded-3xl p-10 text-white space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/10 blur-[100px] rounded-full"></div>
                <div className="flex items-center justify-between relative">
                  <div>
                    <h3 className="text-2xl font-bold">Live Transaction Stream</h3>
                    <p className="text-white/40 font-medium">Monitoring platform-wide sales and escrow releases.</p>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Volume (24h)</p>
                      <p className="text-xl font-black text-lime-400">₦1.24 Billion</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center text-[#0A1D11]"><History className="w-5 h-5" /></div>
                  </div>
                </div>

                <div className="grid gap-4 relative">
                  {transactions.slice(0, 3).map((tx) => (
                    <div key={tx.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-6 hover:bg-white/10 transition-all">
                      <div className="w-12 h-12 rounded-full bg-lime-400/20 flex items-center justify-center text-lime-400">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-lg">{tx.product_name}</p>
                            <p className="text-xs text-white/40">Order ID: #{tx.id.slice(0, 8)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-xl text-lime-400">₦{tx.total_price.toLocaleString()}</p>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-white/10 text-white/60">{tx.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center py-10 text-white/30 font-bold uppercase tracking-widest">No recent transactions to stream</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'Overview' && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#0A1D11] shadow-xl border border-neutral-100">
                <Settings className="w-10 h-10 animate-spin-slow" />
              </div>
              <h3 className="text-2xl font-bold">{activeTab} management section coming soon</h3>
              <p className="text-neutral-400 max-w-sm">Our development team is finalizing the granular management tools for {activeTab.toLowerCase()}.</p>
              <button onClick={() => setActiveTab('Overview')} className="bg-[#0A1D11] text-white px-10 py-4 rounded-2xl font-bold">Back to Command Center</button>
            </div>
          )}
        </div>
      </main>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
