
import React, { useEffect, useRef } from 'react';
import { ArrowRight, Leaf, TrendingUp, Shield, Sun, Wheat } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#071210]">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000"
          alt="Agriculture"
          className="w-full h-full object-cover opacity-30 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a130d] via-[#102014]/50 to-[#07110a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c160e] via-transparent to-[#0d1710]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(214,178,98,0.24),transparent_24%),radial-gradient(circle_at_82%_14%,rgba(123,152,53,0.16),transparent_22%),linear-gradient(180deg,rgba(14,26,17,0.1),rgba(14,26,17,0.65))]" />
      </div>

      <div className="absolute inset-0 z-0 bg-grid opacity-30" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,rgba(10,23,11,0.95))] z-0" />
      <div className="absolute left-0 right-0 bottom-0 z-0 opacity-35">
        <svg viewBox="0 0 1440 220" className="w-full h-auto fill-[#101d13]">
          <path d="M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,181.3C672,181,768,139,864,122.7C960,107,1056,117,1152,133.3C1248,149,1344,171,1392,181.3L1440,192L1440,221L1392,221C1344,221,1248,221,1152,221C1056,221,960,221,864,221C768,221,672,221,576,221C480,221,384,221,288,221C192,221,96,221,48,221L0,221Z" />
        </svg>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-lime-400/8 rounded-full blur-[120px] z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-5 gap-12 xl:gap-20 items-center">
          <div className="lg:col-span-3 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#d7b464]/10 border border-[#d7b464]/25 rounded-full px-4 py-2 mx-auto lg:mx-0 shadow-[0_8px_30px_rgba(0,0,0,0.18)]">
              <span className="dot-live" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#d7b464]">
                Built for soil, harvest, and trade
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[0.98]">
              <span className="text-white">Grow from</span>
              <br />
              <span className="text-gradient-lime">field to market</span>
              <br />
              <span className="text-white">with confidence</span>
            </h1>

            <p className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed mx-auto lg:mx-0">
              AgricLinkChain gives farmers and buyers a stronger trading ground: transparent pricing, trusted records, direct demand, and a platform that feels rooted in real agriculture.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
              {[
                { icon: Wheat, label: 'Harvest Ready', value: '320k+ tons' },
                { icon: Sun, label: 'Active Regions', value: '36 states' },
                { icon: Shield, label: 'Verified Trade', value: '99.2%' },
              ].map((item) => (
                <div key={item.label} className="glass rounded-[1.6rem] px-5 py-4 border border-white/10 text-left">
                  <item.icon className="w-5 h-5 text-[#d7b464] mb-3" />
                  <div className="text-xs uppercase tracking-[0.18em] text-white/35 font-black">{item.label}</div>
                  <div className="text-lg font-black text-white mt-1">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onStart}
                className="group bg-lime-400 text-[#071210] px-7 py-4 rounded-2xl text-sm font-bold flex items-center gap-2.5 hover:bg-lime-300 transition-all hover:shadow-xl hover:shadow-lime-400/30 btn-press"
              >
                Start Trading
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.querySelector('#marketplace')?.scrollIntoView({ behavior: 'smooth' })}
                className="border border-[#d7b464]/20 bg-[#f7f3e8]/[0.03] text-white/80 px-7 py-4 rounded-2xl text-sm font-bold hover:bg-[#d7b464]/10 hover:text-white hover:border-[#d7b464]/35 transition-all btn-press"
              >
                Explore Produce
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 relative hidden lg:block">
            <div className="absolute -inset-6 bg-[radial-gradient(circle,rgba(215,180,100,0.16),rgba(111,139,47,0.08),transparent_70%)] rounded-[2.5rem] blur-3xl" />

            <div className="relative rounded-[2.5rem] overflow-hidden border border-[#d7b464]/20 shadow-2xl">
              <img
                src="https://cdn.businessday.ng/2016/12/farmers.jpg"
                alt="Farmers at work"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071210]/85 via-transparent to-transparent" />
              <div className="absolute top-5 left-5 px-4 py-2 rounded-full bg-[#102014]/80 border border-[#d7b464]/20 backdrop-blur-xl">
                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#d7b464]">Harvest Season Active</span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 glass rounded-[1.7rem] px-5 py-4 flex items-center gap-4 border-white/[0.1]">
                <div className="w-10 h-10 bg-lime-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#071210]" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">Market Price Alert</div>
                  <div className="text-lime-400 text-xs font-semibold">Sesame +12% this week ↑</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 glass rounded-[1.7rem] px-5 py-4 space-y-1 border-white/[0.1] animate-float">
              <div className="text-xs text-white/40 font-semibold uppercase tracking-wider">Today&apos;s Harvest</div>
              <div className="text-2xl font-extrabold text-white">148 Tons</div>
              <div className="text-lime-400 text-xs font-bold">North-Central nodes active</div>
            </div>

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
