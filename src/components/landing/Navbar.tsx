import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, role } = useAuth();

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AgriLinkChain</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/marketplace" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <Link to="/about" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              Contact
            </Link>
          </div>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Button asChild>
                <Link to={getDashboardLink()}>Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Home
              </Link>
              <Link to="/marketplace" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Marketplace
              </Link>
              <Link to="/about" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                About
              </Link>
              <Link to="/contact" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>
                Contact
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user ? (
                  <Button asChild>
                    <Link to={getDashboardLink()} onClick={() => setIsOpen(false)}>Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" asChild>
                      <Link to="/login" onClick={() => setIsOpen(false)}>Log In</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
