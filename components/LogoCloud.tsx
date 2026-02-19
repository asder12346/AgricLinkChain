
import React from 'react';

const LogoCloud: React.FC = () => {
  const logos = [
    'GreenFarm', 'AgriBoost', 'EcoHarvest', 'PureSoil', 'FarmTrack', 'AgroLogic',
    'GreenFarm', 'AgriBoost', 'EcoHarvest', 'PureSoil', 'FarmTrack', 'AgroLogic'
  ];

  return (
    <div className="py-16 bg-white border-y border-neutral-100 overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee">
        {logos.map((logo, idx) => (
          <div key={idx} className="flex items-center mx-16">
            <span className="text-3xl font-black text-[#0A1D11]/20 tracking-tighter flex items-center gap-3 group cursor-pointer hover:text-lime-600 transition-colors">
              <span className="w-2.5 h-2.5 rounded-full bg-lime-400 group-hover:scale-125 transition-transform"></span>
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
          animation: marquee 40s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LogoCloud;
