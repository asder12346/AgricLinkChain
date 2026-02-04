import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  BarChart3, 
  FileText, 
  LogOut,
  Menu,
  X,
  Leaf,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin/dashboard' },
  { icon: Leaf, label: 'Farmers', href: '/admin/farmers' },
  { icon: ShoppingBag, label: 'Buyers', href: '/admin/buyers' },
  { icon: Package, label: 'Listings', href: '/admin/listings' },
  { icon: ShoppingCart, label: 'Orders', href: '/admin/orders' },
  { icon: CreditCard, label: 'Transactions', href: '/admin/transactions' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
  { icon: FileText, label: 'Audit Logs', href: '/admin/audit-logs' },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-destructive flex items-center justify-center">
            <Shield className="w-5 h-5 text-destructive-foreground" />
          </div>
          <span className="font-bold text-sidebar-foreground">Admin Panel</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-sidebar-foreground">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-full w-64 bg-sidebar transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-2 p-6 border-b border-sidebar-border">
            <div className="w-10 h-10 rounded-lg bg-destructive flex items-center justify-center">
              <Shield className="w-6 h-6 text-destructive-foreground" />
            </div>
            <div>
              <span className="font-bold text-sidebar-foreground block">AgriLinkChain</span>
              <span className="text-xs text-sidebar-foreground/60">Admin Panel</span>
            </div>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-sidebar-border mt-16 lg:mt-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center text-destructive font-semibold">
                {profile?.full_name?.[0] || 'A'}
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">{profile?.full_name || 'Admin'}</p>
                <p className="text-xs text-sidebar-foreground/60">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
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
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
