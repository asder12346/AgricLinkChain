
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Wallet, 
  Star, 
  User, 
  Bell, 
  LogOut, 
  Leaf, 
  Plus, 
  ChevronRight,
  TrendingUp,
  Clock,
  Home,
  Menu,
  X
} from 'lucide-react';
import Marketplace from '../components/Marketplace';

interface DashboardProps {
  user: any;
  onSignOut: () => void;
  onGoHome: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onSignOut, onGoHome }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userType = user.user_metadata?.user_type || 'Farmer';
  const fullName = user.user_metadata?.full_name || 'Agri User';

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: userType === 'Farmer' ? 'My Listings' : 'My Cart', icon: userType === 'Farmer' ? Package : ShoppingBag },
    { name: 'My Orders', icon: Clock },
    { name: userType === 'Farmer' ? 'Earnings' : 'Wishlist', icon: Wallet },
    { name: 'Reviews', icon: Star },
    { name: 'Profile', icon: User },
    { name: 'Notifications', icon: Bell },
  ];

  const farmerStats = [
    { label: 'Total Listings', value: '0', icon: Package, color: 'text-blue-500' },
    { label: 'Active Orders', value: '0', icon: TrendingUp, color: 'text-orange-500' },
    { label: 'Completed Sales', value: '0', icon: ChevronRight, color: 'text-green-500' },
    { label: 'Total Earnings', value: '₦0', icon: Wallet, color: 'text-lime-500' },
  ];

  const buyerStats = [
    { label: 'Total Purchases', value: '0', icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Active Shipments', value: '0', icon: TrendingUp, color: 'text-orange-500' },
    { label: 'Reviews Given', value: '0', icon: Star, color: 'text-yellow-500' },
    { label: 'Total Spent', value: '₦0', icon: Wallet, color: 'text-lime-500' },
  ];

  const currentStats = userType === 'Farmer' ? farmerStats : buyerStats;

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex">
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
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest px-2 mb-4">
              {userType} Portal
            </p>
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === item.name ? 'bg-lime-400 text-[#0A1D11]' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 space-y-2">
            <button 
              onClick={onGoHome}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <Home className="w-5 h-5" />
              Main Site
            </button>
            <button 
              onClick={onSignOut}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-red-400 hover:bg-red-400/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen relative">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 lg:px-12 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 bg-neutral-100 rounded-xl text-[#0A1D11]">
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-[#0A1D11]">{userType} Dashboard</h1>
                <p className="text-sm text-neutral-400 font-medium">Manage your {userType.toLowerCase()} profile and orders</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-sm font-bold text-[#0A1D11]">{fullName}</span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{userType}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-lime-100 border border-lime-200 flex items-center justify-center text-lime-700 font-bold overflow-hidden">
                {fullName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6 lg:p-12 max-w-7xl mx-auto">
          {activeTab === 'Overview' && (
            <div className="space-y-12">
              <div className="bg-[#0A1D11] rounded-[2.5rem] p-8 lg:p-12 text-white relative overflow-hidden">
                <div className="relative z-10 max-w-2xl space-y-4">
                  <h2 className="text-3xl lg:text-4xl font-extrabold">Welcome back, {fullName.split(' ')[0]}!</h2>
                  <p className="text-white/60 text-lg">Here's a summary of your activities on AgriLinkChain. Start growing your reach today.</p>
                  {userType === 'Farmer' && (
                    <button className="bg-lime-400 text-[#0A1D11] px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-lime-300 transition-all transform hover:scale-105 active:scale-95">
                      <Plus className="w-5 h-5" /> Add New Listing
                    </button>
                  )}
                </div>
                <div className="absolute top-0 right-0 h-full w-1/3 opacity-20 hidden lg:block">
                   <Leaf className="w-full h-full scale-150 rotate-45 text-lime-400" />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentStats.map((stat) => (
                  <div key={stat.label} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl bg-neutral-50 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-neutral-400 text-sm font-medium">{stat.label}</p>
                      <h4 className="text-3xl font-black text-[#0A1D11]">{stat.value}</h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Sections */}
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#0A1D11]">Recent {userType === 'Farmer' ? 'Listings' : 'Activity'}</h3>
                    <button className="text-lime-600 font-bold text-sm hover:underline">View All</button>
                  </div>
                  
                  <div className="bg-white border border-neutral-100 rounded-[2rem] p-12 text-center space-y-6">
                    <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-neutral-300">
                      {userType === 'Farmer' ? <Package className="w-10 h-10" /> : <ShoppingBag className="w-10 h-10" />}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-[#0A1D11]">No {userType === 'Farmer' ? 'listings' : 'activity'} yet</h4>
                      <p className="text-neutral-400 max-w-xs mx-auto">
                        {userType === 'Farmer' 
                          ? 'Create your first listing to start selling your quality produce to global buyers.' 
                          : 'Your recent transactions and searches will appear here.'}
                      </p>
                    </div>
                    {userType === 'Farmer' && (
                      <button className="bg-[#0A1D11] text-white px-8 py-3.5 rounded-2xl font-bold text-sm">
                        Add Listing
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#0A1D11]">Recent Orders</h3>
                    <button className="text-lime-600 font-bold text-sm hover:underline">View All</button>
                  </div>
                  <div className="bg-white border border-neutral-100 rounded-[2rem] p-12 text-center space-y-6">
                    <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto text-neutral-300">
                      <Clock className="w-8 h-8" />
                    </div>
                    <p className="text-neutral-400 text-sm font-medium">Orders will appear here when buyers purchase your products</p>
                  </div>
                </div>
              </div>

              {/* Farmer specific Marketplace access */}
              <div className="pt-12 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-[#0A1D11]">Marketplace Trends</h3>
                  <p className="text-neutral-400 text-sm">Stay updated with current market prices</p>
                </div>
                <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 overflow-hidden border border-neutral-100">
                   <Marketplace />
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'Overview' && (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-300">
                 {activeTab === 'My Orders' ? <Clock className="w-10 h-10" /> : <User className="w-10 h-10" />}
              </div>
              <h3 className="text-2xl font-bold text-[#0A1D11]">{activeTab} section coming soon</h3>
              <p className="text-neutral-400">We are currently building this feature to give you the best experience.</p>
              <button onClick={() => setActiveTab('Overview')} className="text-lime-600 font-bold hover:underline flex items-center gap-2">
                <ChevronRight className="w-4 h-4 rotate-180" /> Back to Overview
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
