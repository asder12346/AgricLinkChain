import React from 'react';
import { Target, ArrowUpRight, Check } from 'lucide-react';

interface MissionProps {
  onJoin: (role: string) => void;
}

const values = [
  'Eliminating costly middlemen from the supply chain',
  'Ensuring fair, transparent pricing for all farmers',
  'Providing access to global export markets',
  'Leveraging AI for smarter agricultural decisions',
];

const Mission: React.FC<MissionProps> = ({ onJoin }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">
        {/* Left: Mission Content */}
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="badge-live">Our Mission</div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Empowering the{' '}
              <span className="text-gradient-lime">Future of</span>{' '}
              Global Agriculture
            </h2>
            <p className="text-lg text-white/50 leading-relaxed">
              At AgricLinkChain, we believe technology can solve the most pressing challenges in the agricultural supply chain. Removing middlemen and providing direct market access ensures farmers receive fair value while buyers get guaranteed quality.
            </p>
          </div>

          {/* Values list */}
          <ul className="space-y-3">
            {values.map((v, i) => (
              <li key={i} className="flex items-center gap-3 text-white/70">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-lime-400/15 border border-lime-400/30 flex items-center justify-center">
                  <Check className="w-3 h-3 text-lime-400" />
                </span>
                {v}
              </li>
            ))}
          </ul>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.07]">
            {[
              { v: '100%', l: 'Transparent' },
              { v: '20+', l: 'Partnerships' },
              { v: 'Safe', l: 'Ecosystem' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-2xl font-black text-white">{s.v}</div>
                <div className="text-xs text-white/35 uppercase tracking-widest font-semibold mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Mission Image/Impact Card */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-lime-400/20 to-emerald-400/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
          <div className="relative glass rounded-[2.5rem] p-8 md:p-12 overflow-hidden border border-white/10 shadow-2xl">
            <div className="space-y-8 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Direct Impact</h3>
                  <button
                    onClick={() => onJoin('Agent')}
                    className="flex items-center gap-1.5 text-xs font-bold text-lime-400 hover:text-lime-300 transition-colors"
                  >
                    Become an Agent <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-white/50 leading-relaxed">
                  We are building a future where every farmer has the tools, data, and market access they need to thrive in the global economy.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Network', value: 'Global' },
                  { label: 'Security', value: 'Encrypted' },
                  { label: 'Speed', value: 'Real-time' },
                  { label: 'Support', value: '24/7' },
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                    <div className="text-lime-400 font-bold">{item.value}</div>
                    <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-1">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-lime-400 flex items-center justify-center font-black text-[#102014] text-xs">
                    ALC
                  </div>
                  <div>
                    <div className="text-white font-bold tracking-tight">AgricLinkChain</div>
                    <div className="text-xs text-white/40 font-medium">Empowering Africa's Farmers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
