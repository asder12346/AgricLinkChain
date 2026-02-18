
import React from 'react';
// Added Leaf to the imports from lucide-react
import { ArrowRight, Play, ChevronDown, Leaf } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000" 
          alt="Agriculture" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1D11]/90 via-[#0A1D11]/60 to-[#0A1D11]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/90">Traditional Farming</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Smart Farming for <br />
              <span className="text-lime-400">Future Generations</span>
            </h1>
            
            <p className="text-xl text-white/70 max-w-lg leading-relaxed">
              AgriLinkChain connects farmers directly to global buyers using advanced technology to ensure fair pricing, transparency, and sustainable growth.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-lime-400 text-[#0A1D11] px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-lime-300 transition-all transform hover:scale-105 active:scale-95 group">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-white/20 transition-all">
                <Play className="w-5 h-5 fill-current" />
                Live Projects
              </button>
            </div>

            <div className="flex items-center gap-6 pt-8 border-t border-white/10">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <img 
                    key={i}
                    src={`https://picsum.photos/seed/${i + 10}/100/100`}
                    alt="User"
                    className="w-12 h-12 rounded-full border-2 border-[#0A1D11] object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="text-lg font-bold">+12K</div>
                <div className="text-sm text-white/50">Trusted by over 12,000+ farmers</div>
              </div>
            </div>
          </div>

          <div className="hidden lg:block relative">
            <div className="absolute -inset-4 bg-lime-400/20 rounded-[2.5rem] blur-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000" 
              alt="Farmer with Tablet" 
              className="relative rounded-[2rem] border border-white/20 shadow-2xl object-cover h-[500px] w-full"
            />
            {/* Floating Card */}
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 flex items-center gap-4 animate-bounce-slow">
              <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center text-lime-600">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <div className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">Top Seller</div>
                <div className="text-[#0A1D11] font-bold text-lg">Organic Tomatoes</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Scroll</span>
          <ChevronDown className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
