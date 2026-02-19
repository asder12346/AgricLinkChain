
import React from 'react';

const LogoCloud: React.FC = () => {
  const logos = [
    'GreenFarm', 'AgriBoost', 'EcoHarvest', 'PureSoil', 'FarmTrack', 'AgroLogic',
    'GreenFarm', 'AgriBoost', 'EcoHarvest', 'PureSoil', 'FarmTrack', 'AgroLogic'
  ];

  return (
    <div className="py-20 bg-[#0A1D11] border-y border-white/5 overflow-hidden whitespace-nowrap relative">
      <div className="flex animate-marquee">
        {logos.map((logo, idx) => (
          <div key={idx} className="flex items-center mx-16">
            <span className="text-4xl font-black text-white/40 tracking-tighter flex items-center gap-4 group cursor-pointer hover:text-white transition-all duration-500">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-400 group-hover:scale-150 transition-transform shadow-lg shadow-lime-400/50"></span>
              {logo}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LogoCloud;
