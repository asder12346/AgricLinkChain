
import React from 'react';
import { Leaf, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8 col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="bg-lime-400 p-1.5 rounded-lg">
                <Leaf className="w-6 h-6 text-[#0A1D11]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">AgricLinkChain</span>
            </div>
            <p className="text-white/40 leading-relaxed max-w-xs">
              The world’s most trusted digital marketplace for local and industrial agriculture.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Instagram].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-lime-400 hover:text-[#0A1D11] transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Solutions', 'Marketplace', 'Impact', 'Stories', 'About Us'].map((item) => (
                <li key={item}><a href="#" className="text-white/40 hover:text-lime-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-8">Support</h4>
            <ul className="space-y-4">
              {['Help Center', 'Privacy Policy', 'Terms of Use', 'Shipping', 'Returns'].map((item) => (
                <li key={item}><a href="#" className="text-white/40 hover:text-lime-400 transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="font-bold text-lg mb-8">Newsletter</h4>
            <p className="text-white/40">Receive the latest updates from our agricultural community.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-lime-400 transition-colors" 
              />
              <button className="bg-lime-400 text-[#0A1D11] px-6 py-3 rounded-xl font-bold hover:bg-lime-300 transition-colors">Join</button>
            </form>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white/30 text-sm">
            © 2026 AgricLinkChain. All rights reserved.
          </div>
          <div className="flex gap-8 text-sm text-white/30">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
