import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  LayoutDashboard, 
  Store, 
  ShoppingCart, 
  CreditCard, 
  User, 
  Bell, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface BuyerLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/buyer/dashboard' },
  { icon: Store, label: 'Marketplace', href: '/buyer/marketplace' },
  { icon: ShoppingCart, label: 'My Orders', href: '/buyer/orders' },
  { icon: CreditCard, label: 'Payments', href: '/buyer/payments' },
  { icon: User, label: 'Profile', href: '/buyer/profile' },
  { icon: Bell, label: 'Notifications', href: '/buyer/notifications' },
];

export function BuyerLayout({ children }: BuyerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile, buyer } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md h-16 flex items-center justify-between px-4 border-b border-gray-200 shadow-sm">
        <Link to="/buyer/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="font-serif font-bold text-xl text-gray-900">AgricLinkChain</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-full w-72 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        shadow-2xl lg:shadow-none
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-3 p-8">
            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif font-bold text-xl text-gray-900 block leading-none">AgricLinkChain</span>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Buyer Portal</span>
            </div>
          </div>

          {/* User info card */}
          <div className="mx-4 mt-2 mb-6 p-4 rounded-2xl bg-orange-50/50 border border-orange-100/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-700 font-bold shadow-sm border border-orange-100">
                {profile?.full_name?.[0] || 'B'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate">{buyer?.business_name || 'Your Business'}</p>
                <p className="text-xs text-orange-600 font-medium capitalize">{buyer?.business_type || 'Buyer'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 group
                    ${isActive 
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20' 
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-100">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl px-4 py-6"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Log Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-72 pt-20 lg:pt-8 min-h-screen transition-all duration-300">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
