
import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf } from 'lucide-react';

const Navbar: React.FC = () => {
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
    { name: 'Explore', href: '#faq' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A1D11]/90 backdrop-blur-md py-4 border-b border-white/10' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-lime-400 p-1.5 rounded-lg">
              <Leaf className="w-6 h-6 text-[#0A1D11]" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">AgriLinkChain</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-white/80 hover:text-lime-400 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <button className="bg-lime-400 text-[#0A1D11] px-6 py-2.5 rounded-full text-sm font-bold hover:bg-lime-300 transition-all transform hover:scale-105 active:scale-95">
              Join Platform
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute w-full bg-[#0A1D11] transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100 border-b border-white/10' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-4 pt-4 pb-8 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block text-lg font-medium py-2 text-white/90 hover:text-lime-400"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <button className="w-full bg-lime-400 text-[#0A1D11] py-4 rounded-xl font-bold mt-4">
            Join Platform
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
