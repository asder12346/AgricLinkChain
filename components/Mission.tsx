
import React from 'react';
import { Target, Users, Award } from 'lucide-react';

interface MissionProps {
  onJoin: (role: string) => void;
}

const team = [
  { name: 'Ibrahim', role: 'Co-Founder', img: 'https://picsum.photos/seed/ibra/400/400' },
  { name: 'Aisha', role: 'Product Lead', img: 'https://picsum.photos/seed/aisha/400/400' },
  { name: 'Sarah', role: 'Chief Agronomist', img: 'https://picsum.photos/seed/sarah/400/400' }
];

const Mission: React.FC<MissionProps> = ({ onJoin }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-20">
        <div className="space-y-12">
          <div className="space-y-6">
            <h4 className="text-lime-400 font-bold uppercase tracking-widest text-sm">Our Mission</h4>
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Empowering the Future of <br />
              <span className="text-white/60">Global Agriculture</span>
            </h2>
            <p className="text-xl text-white/50 leading-relaxed max-w-xl">
              At AgricLinkChain, we believe that technology can solve the most pressing challenges in the agricultural supply chain. By removing middlemen and providing direct market access, we ensure that farmers receive fair value for their hard work while providing buyers with guaranteed quality and transparency.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm text-white/40 uppercase tracking-widest">Transparency</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">20+</div>
              <div className="text-sm text-white/40 uppercase tracking-widest">Partnerships</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold">Safe</div>
              <div className="text-sm text-white/40 uppercase tracking-widest">Ecosystem</div>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 space-y-12">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Our Leadership</h3>
            <button 
              onClick={() => onJoin('Agent')}
              className="bg-lime-400 text-[#0A1D11] px-6 py-2 rounded-full font-bold text-sm hover:bg-lime-300 transition-colors"
            >
              Become an Agent
            </button>
          </div>
          
          <div className="grid gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="flex items-center gap-6 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-lime-400 rounded-2xl rotate-6 group-hover:rotate-0 transition-transform"></div>
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="relative w-20 h-20 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all border border-white/10" 
                  />
                </div>
                <div>
                  <div className="text-xl font-bold">{member.name}</div>
                  <div className="text-white/40 text-sm font-medium uppercase tracking-widest">{member.role}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10 text-center space-y-4">
            <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Clear and Simple</p>
            <div className="text-2xl font-bold">Make farming smarter, stronger, and simpler</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
