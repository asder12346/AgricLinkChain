
import React from 'react';
import { Twitter, Linkedin, Instagram, Youtube, Wheat } from 'lucide-react';

const Footer: React.FC = () => {
  const columns = [
    {
      title: 'Platform',
      links: ['Solutions', 'Marketplace', 'Smart Pricing', 'Logistics', 'Analytics'],
    },
    {
      title: 'Company',
      links: ['About Us', 'Leadership', 'Careers', 'Press Kit', 'Contact'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Use', 'Cookie Policy', 'Security', 'Compliance'],
    },
  ];

  return (
    <footer className="bg-[#071210] border-t border-[#d7b464]/10">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#2c2210]/70 via-[#142117] to-[#071210]" />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#d7b464]/10 blur-[90px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              Bring your next harvest to market faster
            </h3>
            <p className="text-white/40">Join farmers and buyers building a stronger agricultural trade network.</p>
          </div>
          <button className="flex-shrink-0 bg-lime-400 text-[#071210] px-8 py-4 rounded-2xl font-bold text-sm hover:bg-lime-300 transition-all hover:shadow-xl hover:shadow-lime-400/20 btn-press">
            Enter Marketplace
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 mb-14">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-[#d7b464] rounded-2xl flex items-center justify-center shadow-lg">
                <Wheat className="w-5 h-5 text-[#102014]" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">
                Agric<span className="text-lime-400">Link</span>Chain
              </span>
            </div>
            <p className="text-white/35 leading-relaxed max-w-xs text-sm">
              Nigeria's most trusted digital marketplace for local and industrial agriculture — built for farmers, powered by technology.
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-xl border border-[#d7b464]/10 flex items-center justify-center text-white/30 hover:bg-lime-400 hover:text-[#071210] hover:border-lime-400 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h5 className="text-xs font-black uppercase tracking-widest text-white/50 mb-5">{col.title}</h5>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-white/35 hover:text-lime-400 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-8 border-y border-[#d7b464]/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-sm font-bold text-white mb-1">Stay in the loop</div>
            <div className="text-xs text-white/35">Market alerts, weather-sensitive updates, and farming insights.</div>
          </div>
          <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 md:w-64 bg-white/[0.05] border border-[#d7b464]/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-lime-400/50"
            />
            <button className="bg-lime-400 text-[#071210] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-lime-300 transition-colors btn-press">
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-white/25">
            © 2026 AgricLinkChain Ltd. All rights reserved.
          </div>
          <div className="flex gap-6 text-xs text-white/25">
            {['Privacy', 'Terms', 'Cookies', 'Sitemap'].map((l) => (
              <a key={l} href="#" className="hover:text-white/60 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
