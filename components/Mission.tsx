
import React from 'react';
import { Target, ArrowUpRight, Check } from 'lucide-react';

interface MissionProps {
  onJoin: (role: string) => void;
}

const team = [
  { name: 'Ibrahim Ahmed', role: 'Co-Founder & CEO', img: 'https://picsum.photos/seed/ibra/400/400' },
  { name: 'Aisha Nwosu', role: 'Chief Product Officer', img: 'https://picsum.photos/seed/aisha/400/400' },
  { name: 'Sarah Okonkwo', role: 'Chief Agronomist', img: 'https://picsum.photos/seed/sarah/400/400' },
];

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

        {/* Right: Team Card */}
        <div className="glass rounded-[2.5rem] p-8 md:p-10 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Leadership Team</h3>
            <button
              onClick={() => onJoin('Agent')}
              className="flex items-center gap-1.5 text-xs font-bold text-lime-400 hover:text-lime-300 transition-colors"
            >
              Become an Agent <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-5">
            {team.map((member, idx) => (
              <div key={idx} className="flex items-center gap-5 group p-3 rounded-2xl hover:bg-white/[0.04] transition-colors">
                <div className="relative flex-shrink-0">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-white/[0.1] grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-lime-400 rounded-full border-2 border-[#071210]" />
                </div>
                <div>
                  <div className="font-bold text-white group-hover:text-lime-300 transition-colors">{member.name}</div>
                  <div className="text-xs text-white/40 font-medium uppercase tracking-wider mt-0.5">{member.role}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/[0.07] text-center space-y-3">
            <div className="text-white/35 font-bold uppercase tracking-widest text-[10px]">Our Northstar</div>
            <div className="text-xl font-bold text-white leading-snug">
              Make farming smarter, stronger, and simpler — for everyone.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
