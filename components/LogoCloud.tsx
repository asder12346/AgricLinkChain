
import React from 'react';

const LogoCloud: React.FC = () => {
  const row1 = ['GreenFarm', 'AgriBoost', 'EcoHarvest', 'PureSoil', 'FarmTrack', 'AgroLogic', 'HarvestX', 'BioFarm'];
  const row2 = ['NaijaAgro', 'SeedLink', 'CropChain', 'SoilRich', 'YieldPro', 'FreshDirect', 'MarketTree', 'GrainHub'];

  const MarqueeRow = ({ items, reverse = false }: { items: string[]; reverse?: boolean }) => (
    <div className={`flex whitespace-nowrap ${reverse ? 'animate-[marquee-reverse_40s_linear_infinite]' : 'animate-[marquee_40s_linear_infinite]'}`}
      style={{ animation: reverse ? 'marquee-reverse 40s linear infinite' : 'marquee 40s linear infinite' }}
    >
      {[...items, ...items].map((logo, idx) => (
        <div key={idx} className="flex items-center mx-10 flex-shrink-0">
          <span className="text-2xl font-black text-white/20 tracking-tighter flex items-center gap-3 hover:text-white/60 transition-all duration-500 cursor-pointer group">
            <span className="w-2 h-2 rounded-full bg-lime-400/40 group-hover:bg-lime-400 group-hover:scale-150 transition-all shadow-sm shadow-lime-400/20" />
            {logo}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="py-16 bg-[#071210] border-y border-white/[0.04] overflow-hidden select-none relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#071210] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#071210] to-transparent z-10 pointer-events-none" />

      <div className="mb-3">
        <MarqueeRow items={row1} />
      </div>
      <div>
        <MarqueeRow items={row2} reverse />
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default LogoCloud;
