import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-24 pb-12">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-background">AgricLinkChain</span>
            </Link>
            <p className="text-background/60 text-sm leading-relaxed mb-8">
              Revolutionizing agricultural trade through blockchain transparency, AI-driven insights, and direct connections between farmers and global markets.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Platform</h4>
            <ul className="space-y-4">
              <li><Link to="/farmer" className="text-background/60 hover:text-primary transition-colors text-sm">For Farmers</Link></li>
              <li><Link to="/buyer" className="text-background/60 hover:text-primary transition-colors text-sm">For Buyers</Link></li>
              <li><Link to="/traceability" className="text-background/60 hover:text-primary transition-colors text-sm">Traceability</Link></li>
              <li><Link to="/marketplace" className="text-background/60 hover:text-primary transition-colors text-sm">Marketplace</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">AgricLinkChain</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-background/60 hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link to="/careers" className="text-background/60 hover:text-primary transition-colors text-sm">Careers</Link></li>
              <li><Link to="/privacy" className="text-background/60 hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-background/60 hover:text-primary transition-colors text-sm">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-background/60 hover:text-primary transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h4 className="text-lg font-bold mb-6">Connect</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:support@agriclinkchain.com" className="text-background/60 hover:text-primary transition-colors text-sm">
                  support@agriclinkchain.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:+234800AGRILINK" className="text-background/60 hover:text-primary transition-colors text-sm">
                  +234 (0) 800 AGRILINK
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span className="text-background/60 text-sm">Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/40 text-xs">
            © 2026 AgricLinkChain. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-background/40 text-[10px] uppercase tracking-widest font-bold">System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
