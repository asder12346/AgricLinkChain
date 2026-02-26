
import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf, LogOut, LayoutDashboard } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NavbarProps {
  onJoin: () => void;
  onGoDashboard: () => void;
  user: any;
}

const Navbar: React.FC<NavbarProps> = ({ onJoin, onGoDashboard, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Solutions', href: '#solutions' },
    { name: 'Marketplace', href: '#marketplace' },
    { name: 'Impact', href: '#impact' },
    { name: 'Stories', href: '#stories' },
    { name: 'Explore', href: '#marketplace' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#0A1D11]/90 backdrop-blur-xl py-4 border-b border-white/5 shadow-2xl' : 'bg-transparent py-7'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-lime-400 p-1.5 rounded-xl shadow-lg shadow-lime-400/20 group-hover:rotate-6 transition-transform overflow-hidden">
              <img src="/logo.png" className="w-8 h-8 object-contain" alt="Logo" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">AgricLinkChain</span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-xs font-black uppercase tracking-widest text-white/60 hover:text-lime-400 transition-all"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-5">
                <button
                  onClick={onGoDashboard}
                  className="flex items-center gap-2.5 bg-lime-400/10 text-lime-400 border border-lime-400/20 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-lime-400 hover:text-[#0A1D11] transition-all shadow-xl"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 p-3 rounded-2xl transition-all border border-white/10"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onJoin}
                className="bg-lime-400 text-[#0A1D11] px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-lime-300 transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-lime-400/20"
              >
                Join Platform
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2.5 bg-white/5 rounded-xl border border-white/10">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden absolute w-full bg-[#0A1D11] transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen opacity-100 border-b border-white/5' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-6 pt-6 pb-12 space-y-6">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className="block w-full text-left text-2xl font-black py-3 text-white/40 hover:text-lime-400 transition-colors"
            >
              {link.name}
            </button>
          ))}
          <div className="h-px bg-white/5 my-8"></div>
          {user ? (
            <div className="space-y-4">
              <button
                onClick={() => { setIsOpen(false); onGoDashboard(); }}
                className="w-full bg-lime-400 text-[#0A1D11] py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <LayoutDashboard className="w-5 h-5" /> Go to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-white/5 text-white/40 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 border border-white/10"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setIsOpen(false); onJoin(); }}
              className="w-full bg-lime-400 text-[#0A1D11] py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-lime-400/20"
            >
              Join Platform
            </button>
          )}
        </div>
      </div>
    </nav >
  );
};

export default Navbar;
