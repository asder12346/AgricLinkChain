
import React from 'react';

const LogoCloud: React.FC = () => {
  const logos = [
    'GreenFarm', 'AgriBoost', 'EcoHarvest', 'PureSoil', 'FarmTrack', 'AgroLogic',
    'GreenFarm', 'AgriBoost', 'EcoHarvest', 'PureSoil', 'FarmTrack', 'AgroLogic'
  ];

  return (
    <div className="py-12 bg-[#08160D] border-y border-white/5 overflow-hidden whitespace-nowrap">
      <div className="flex animate-marquee">
        {logos.map((logo, idx) => (
          <div key={idx} className="flex items-center mx-12">
            <span className="text-2xl font-bold text-white/30 tracking-tight flex items-center gap-2 group cursor-pointer hover:text-lime-400 transition-colors">
              <span className="w-2 h-2 rounded-full bg-lime-400/30 group-hover:bg-lime-400"></span>
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
