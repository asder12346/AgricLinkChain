import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, role } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardLink = () => {
    if (!role) return '/dashboard';
    switch (role) {
      case 'farmer':
        return '/farmer/dashboard';
      case 'buyer':
        return '/buyer/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If not on home page, navigate to home then scroll
      if (location.pathname !== '/') {
        window.location.href = '/#contact';
      }
    }
  };

  const navClass = cn(
    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
    scrolled || !isHome 
      ? "bg-white/90 backdrop-blur-md border-b border-gray-100 py-2 shadow-sm" 
      : "bg-transparent py-4 border-b border-white/10"
  );

  const textClass = cn(
    "text-sm font-medium transition-colors",
    scrolled || !isHome ? "text-gray-700 hover:text-green-600" : "text-white/80 hover:text-white"
  );

  const logoClass = cn(
    "text-xl font-bold transition-colors",
    scrolled || !isHome ? "text-gray-900" : "text-white"
  );

  return (
    <nav className={navClass}>
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
              scrolled || !isHome ? "bg-green-600" : "bg-white/20 backdrop-blur-sm"
            )}>
              <Leaf className={cn("w-5 h-5", scrolled || !isHome ? "text-white" : "text-green-400")} />
            </div>
            <span className={logoClass}>AgricLinkChain</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={textClass}>
              Home
            </Link>
            <Link to="/marketplace" className={textClass}>
              Marketplace
            </Link>
            <Link to="/about" className={textClass}>
              About
            </Link>
            <Link to="/contact" className={textClass}>
              Contact
            </Link>
          </div>

          {/* Get Started Button */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Button 
                  asChild 
                  variant="ghost" 
                  className={cn(
                    "rounded-full px-6",
                    scrolled || !isHome ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                  )}
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button 
                  asChild 
                  className={cn(
                    "rounded-full px-6 border-0",
                    scrolled || !isHome 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-white text-green-900 hover:bg-white/90"
                  )}
                >
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            ) : (
               <Button 
                  asChild 
                  className={cn(
                    "rounded-full px-6 border-0",
                    scrolled || !isHome 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-white text-green-900 hover:bg-white/90"
                  )}
                >
                  <Link to={getDashboardLink()}>Dashboard</Link>
                </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className={cn("w-6 h-6", scrolled || !isHome ? "text-gray-900" : "text-white")} />
            ) : (
              <Menu className={cn("w-6 h-6", scrolled || !isHome ? "text-gray-900" : "text-white")} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white absolute top-full left-0 right-0 shadow-lg px-6">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-sm font-medium text-gray-700 hover:text-green-600" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link to="/marketplace" className="text-sm font-medium text-gray-700 hover:text-green-600" onClick={() => setIsOpen(false)}>
                Marketplace
              </Link>
              <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-green-600" onClick={() => setIsOpen(false)}>
                About
              </Link>
              <Link to="/contact" className="text-sm font-medium text-gray-700 hover:text-green-600" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                {!user ? (
                  <>
                     <Button asChild variant="outline" className="w-full justify-center rounded-full">
                      <Link to="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                    </Button>
                    <Button asChild className="w-full justify-center bg-green-600 hover:bg-green-700 rounded-full">
                      <Link to="/signup" onClick={() => setIsOpen(false)}>Get Started</Link>
                    </Button>
                  </>
                ) : (
                   <Button asChild className="w-full justify-center bg-green-600 hover:bg-green-700 rounded-full">
                      <Link to={getDashboardLink()} onClick={() => setIsOpen(false)}>Dashboard</Link>
                    </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
