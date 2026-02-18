
import React from 'react';
import { Globe, ShieldCheck, BarChart3, ChevronRight } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Marketplace',
      desc: 'Connect with buyers from across the world without middlemen.'
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: 'Secure Transactions',
      desc: 'End-to-end encrypted payments and verified trade agreements.'
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Smart Inventory',
      desc: 'Advanced tools to track your harvest and manage stock levels.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h4 className="text-lime-400 font-bold uppercase tracking-widest text-sm">Why AgriLinkChain?</h4>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Smart Farming in use, <br />
              <span className="text-white/60">Better Results</span>
            </h2>
          </div>

          <div className="grid gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="group flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-lime-400/50 hover:bg-white/[0.07] transition-all">
                <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="inline-flex items-center gap-2 text-lime-400 font-bold hover:gap-4 transition-all">
            See how it works <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <div className="aspect-square bg-lime-400/10 rounded-[3rem] overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1000" 
              alt="Technology in farm"
              className="w-full h-full object-cover mix-blend-overlay opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-24 h-24 rounded-full bg-lime-400/20 backdrop-blur-md flex items-center justify-center animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-lime-400 flex items-center justify-center text-[#0A1D11]">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
               </div>
            </div>
          </div>
          {/* Floating Metrics */}
          <div className="absolute top-10 -right-4 md:-right-10 bg-[#0A1D11] border border-white/20 p-6 rounded-2xl shadow-2xl">
            <div className="text-lime-400 text-3xl font-extrabold">98%</div>
            <div className="text-white/50 text-xs font-semibold uppercase tracking-wider mt-1">Efficiency Boost</div>
          </div>
          <div className="absolute bottom-10 -left-4 md:-left-10 bg-lime-400 text-[#0A1D11] p-6 rounded-2xl shadow-2xl">
            <div className="text-3xl font-extrabold">12k+</div>
            <div className="text-[#0A1D11]/70 text-xs font-semibold uppercase tracking-wider mt-1">Active Smart Farms</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Play: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);

export default Features;
