
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Leaf, TrendingUp, Shield } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#071210]">
      {/* Background Image with multiple overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000"
          alt="Agriculture"
          className="w-full h-full object-cover opacity-25"
        />
        {/* Dark top + bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#071210] via-[#071210]/40 to-[#071210]" />
        {/* Left fade */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071210] via-transparent to-[#071210]/70" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 z-0 bg-grid opacity-30" />

      {/* Lime radial glow at top-center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-lime-400/8 rounded-full blur-[120px] z-0" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-5 gap-12 xl:gap-20 items-center">

          {/* Left: Copy (3 columns) */}
          <div className="lg:col-span-3 space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-lime-400/[0.08] border border-lime-400/20 rounded-full px-4 py-2 mx-auto lg:mx-0">
              <span className="dot-live" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-lime-400">
                Nigeria's #1 Agricultural Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
              <span className="text-white">Smart Farming</span>
              <br />
              <span className="text-gradient-lime">for Future</span>
              <br />
              <span className="text-white">Generations</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Connecting farmers directly to global buyers — eliminating middlemen, ensuring fair pricing, and bringing transparency to every harvest.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onStart}
                className="group bg-lime-400 text-[#071210] px-7 py-4 rounded-2xl text-sm font-bold flex items-center gap-2.5 hover:bg-lime-300 transition-all hover:shadow-xl hover:shadow-lime-400/30 btn-press"
              >
                Start for Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.querySelector('#marketplace')?.scrollIntoView({ behavior: 'smooth' })}
                className="border border-white/[0.12] text-white/70 px-7 py-4 rounded-2xl text-sm font-bold hover:bg-white/[0.06] hover:text-white hover:border-white/20 transition-all btn-press"
              >
                Explore Market
              </button>
            </div>

            {/* Social Proof Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 pt-4 border-t border-white/[0.06]">
              <div className="flex -space-x-2.5">
                {[15, 16, 17, 18].map((i) => (
                  <img
                    key={i}
                    src={`https://picsum.photos/seed/${i + 30}/100/100`}
                    alt="User"
                    className="w-9 h-9 rounded-full border-2 border-[#071210] object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  {[1,2,3,4,5].map(i => <span key={i} className="text-amber-400 text-xs">★</span>)}
                  <span className="text-white font-bold text-sm ml-1">4.9</span>
                </div>
                <div className="text-white/40 text-xs">Trusted by 12,000+ farmers</div>
              </div>
              <div className="h-8 w-px bg-white/[0.08] hidden sm:block" />
              <div className="text-center sm:text-left">
                <div className="text-white font-bold text-sm">₦1.2B+</div>
                <div className="text-white/40 text-xs">Daily transactions</div>
              </div>
            </div>
          </div>

          {/* Right: Visual Panel (2 columns) */}
          <div className="lg:col-span-2 relative hidden lg:block">
            {/* Glow behind card */}
            <div className="absolute -inset-6 bg-lime-400/10 rounded-[2.5rem] blur-3xl" />

            {/* Main image */}
            <div className="relative rounded-[2rem] overflow-hidden border border-white/[0.1] shadow-2xl">
              <img
                src="https://cdn.businessday.ng/2016/12/farmers.jpg"
                alt="Farmers at work"
                className="w-full h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071210]/80 via-transparent to-transparent" />

              {/* Floating overlay card — bottom */}
              <div className="absolute bottom-5 left-5 right-5 glass rounded-2xl px-5 py-4 flex items-center gap-4 border-white/[0.1]">
                <div className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#071210]" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Market Price Alert</div>
                  <div className="text-lime-400 text-xs font-semibold">Cocoa +12% this week ↑</div>
                </div>
              </div>
            </div>

            {/* Floating stat card — top right */}
            <div className="absolute -top-4 -right-4 glass rounded-2xl px-5 py-4 space-y-1 border-white/[0.1] animate-float">
              <div className="text-xs text-white/40 font-semibold uppercase tracking-wider">Today's Sales</div>
              <div className="text-2xl font-extrabold text-white">₦4.8M</div>
              <div className="text-lime-400 text-xs font-bold">↑ 23% vs yesterday</div>
            </div>

            {/* Shield badge */}
            <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-lime-400 rounded-2xl flex items-center justify-center shadow-xl animate-float-delayed">
              <Shield className="w-7 h-7 text-[#071210]" />
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Hero;
