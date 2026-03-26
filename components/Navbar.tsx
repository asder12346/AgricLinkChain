
import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, LayoutDashboard, Wheat } from 'lucide-react';
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
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Solutions', href: '#solutions' },
    { name: 'Marketplace', href: '#marketplace' },
    { name: 'Impact', href: '#impact' },
    { name: 'Team', href: '#team' },
    { name: 'Stories', href: '#stories' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-dark border-b border-[#d7b464]/10 shadow-2xl shadow-black/30 py-3'
          : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 group"
            >
              <div className="relative w-10 h-10 rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300 bg-[#d7b464] flex items-center justify-center">
                <Wheat className="w-5 h-5 text-[#102014]" />
              </div>
              <span className="text-[17px] font-extrabold tracking-tight text-white group-hover:text-lime-300 transition-colors">
                Agric<span className="text-lime-400">Link</span>Chain
              </span>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center">
              <div className="flex items-center gap-1 bg-[#f7f3e8]/[0.05] border border-[#d7b464]/10 rounded-full px-2 py-1.5 backdrop-blur-xl">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide text-white/55 hover:text-white hover:bg-[#d7b464]/10 transition-all duration-200"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <button
                    onClick={onGoDashboard}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide text-white border border-[#d7b464]/10 bg-[#f7f3e8]/[0.06] hover:bg-[#d7b464]/10 hover:border-[#d7b464]/20 transition-all"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 rounded-full text-white/40 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-400/20 transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onJoin}
                    className="text-xs font-semibold text-white/60 hover:text-white transition-colors px-3 py-2"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={onJoin}
                    className="bg-lime-400 text-[#071210] px-5 py-2.5 rounded-full text-xs font-bold tracking-wide hover:bg-lime-300 transition-all hover:shadow-lg hover:shadow-lime-400/25 btn-press"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2.5 rounded-xl bg-[#f7f3e8]/[0.06] border border-[#d7b464]/10 text-white hover:bg-[#d7b464]/10 transition-all"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

        {/* Drawer */}
        <div className={`absolute top-0 right-0 h-full w-72 bg-[#071210] border-l border-[#d7b464]/10 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between p-5 border-b border-[#d7b464]/10">
            <span className="text-[15px] font-extrabold text-white">Menu</span>
            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg bg-[#f7f3e8]/[0.06] text-white/60">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-5 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-[#d7b464]/10 transition-all"
              >
                {link.name}
              </button>
            ))}
          </div>
          <div className="p-5 border-t border-[#d7b464]/10 space-y-3">
            {user ? (
              <>
                <button
                  onClick={() => { setIsOpen(false); onGoDashboard(); }}
                  className="w-full bg-lime-400 text-[#071210] py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full border border-white/10 text-white/50 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setIsOpen(false); onJoin(); }}
                  className="w-full bg-lime-400 text-[#071210] py-3.5 rounded-2xl font-bold text-sm"
                >
                  Get Started
                </button>
                <button
                  onClick={() => { setIsOpen(false); onJoin(); }}
                  className="w-full border border-white/10 text-white/60 py-3.5 rounded-2xl font-bold text-sm hover:bg-white/[0.05] transition-all"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
