import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground py-16">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
              <span className="text-xl font-bold">AgriLinkChain</span>
            </div>
            <p className="text-sidebar-foreground/70 text-sm mb-4">
              Connecting farmers directly with buyers for a more efficient and transparent agricultural marketplace.
            </p>
            <div className="space-y-2 text-sm text-sidebar-foreground/70">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>contact@agrilinkchain.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link to="/" className="hover:text-sidebar-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-sidebar-primary transition-colors">About Us</Link></li>
              <li><Link to="/marketplace" className="hover:text-sidebar-primary transition-colors">Marketplace</Link></li>
              <li><Link to="/contact" className="hover:text-sidebar-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* For Farmers */}
          <div>
            <h4 className="font-semibold mb-4">For Farmers</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link to="/signup?role=farmer" className="hover:text-sidebar-primary transition-colors">Join as Farmer</Link></li>
              <li><Link to="/farmer-guide" className="hover:text-sidebar-primary transition-colors">Seller Guide</Link></li>
              <li><Link to="/pricing" className="hover:text-sidebar-primary transition-colors">Pricing</Link></li>
              <li><Link to="/verification" className="hover:text-sidebar-primary transition-colors">Verification Process</Link></li>
            </ul>
          </div>
          
          {/* For Buyers */}
          <div>
            <h4 className="font-semibold mb-4">For Buyers</h4>
            <ul className="space-y-2 text-sm text-sidebar-foreground/70">
              <li><Link to="/signup?role=buyer" className="hover:text-sidebar-primary transition-colors">Join as Buyer</Link></li>
              <li><Link to="/buyer-guide" className="hover:text-sidebar-primary transition-colors">Buyer Guide</Link></li>
              <li><Link to="/quality" className="hover:text-sidebar-primary transition-colors">Quality Standards</Link></li>
              <li><Link to="/support" className="hover:text-sidebar-primary transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-sidebar-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-sidebar-foreground/50">
          <p>© {new Date().getFullYear()} AgriLinkChain. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-sidebar-foreground transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-sidebar-foreground transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
