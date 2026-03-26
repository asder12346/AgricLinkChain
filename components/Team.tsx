import React from 'react';
import { ArrowRight, ExternalLink, Github, Linkedin, Sprout, Wheat, ShieldCheck, Zap, Globe, Code2 } from 'lucide-react';

const team = [
  {
    name: 'ASA HAZO',
    role: 'CEO & Founder',
    description:
      "The visionary leader driving AgricLinkChain's mission to revolutionize agricultural supply chains across Africa. With a deep understanding of rural economies and a passion for technology-driven change, Asa is building the bridge between the farm and the global market.",
    image: '/images/team/asa.jpeg',
    linkedin: '#',
    specialty: 'Strategy & Vision',
    accent: 'Founding Vision',
    icon: Wheat,
    stats: [
      { label: 'Focus', value: 'Expansion' },
      { label: 'Mission', value: 'Farmer-first' },
      { label: 'Reach', value: 'Africa-wide' },
    ],
    tags: ['Leadership', 'AgriTech', 'Africa'],
  },
  {
    name: 'Cornelius',
    role: 'Lead Developer',
    description:
      'The technical architect building the secure, transparent infrastructure that powers real-time trade between farmers and international buyers at scale.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    linkedin: '#',
    github: '#',
    specialty: 'Platform Engineering',
    accent: 'Platform Systems',
    icon: Sprout,
    tags: ['Full-Stack', 'Blockchain', 'React', 'TypeScript'],
  },
];

const Team: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Ambient blobs */}
      <div className="absolute -top-20 left-1/3 w-[600px] h-[600px] rounded-full bg-lime-400/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#d7b464]/8 blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center space-y-5 mb-20 relative">
        <div className="inline-flex items-center gap-2.5 bg-[#d7b464]/10 border border-[#d7b464]/25 rounded-full px-5 py-2.5 shadow-lg shadow-[#d7b464]/5">
          <span className="w-2 h-2 rounded-full bg-[#d7b464] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.28em] text-[#d7b464]">The Innovators</span>
        </div>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95]">
          Built by&nbsp;
          <span className="relative inline-block">
            <span className="text-gradient-lime">believers</span>
            <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 200 10" preserveAspectRatio="none">
              <path d="M0,5 Q50,0 100,5 Q150,10 200,5" stroke="rgba(163,230,53,0.4)" strokeWidth="2" fill="none" />
            </svg>
          </span>
        </h2>
        <p className="text-white/40 max-w-xl mx-auto text-base md:text-lg leading-relaxed">
          A compact, conviction-driven team rewiring how African agriculture connects to the world.
        </p>
      </div>

      {/* CEO Card — Large Feature */}
      <div className="relative rounded-[3rem] overflow-hidden border border-white/8 bg-[linear-gradient(135deg,rgba(20,38,27,0.9),rgba(9,18,12,0.97))] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)] mb-8">
        {/* Background texture */}
        <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d7b464]/8 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-lime-400/5 blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid lg:grid-cols-[420px_1fr] min-h-[480px]">
          {/* Image Panel */}
          <div className="relative overflow-hidden">
            <img
              src={team[0].image}
              alt={team[0].name}
              loading="lazy"
              decoding="async"
              className="w-full h-full min-h-[340px] object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#09120c] hidden lg:block" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#09120c] via-[#091510]/60 to-transparent lg:hidden" />

            {/* Top badge */}
            <div className="absolute top-6 left-6 flex items-center gap-2 rounded-full bg-[#0a1508]/80 border border-[#d7b464]/25 px-4 py-2 backdrop-blur-xl">
              <Wheat className="w-3.5 h-3.5 text-[#d7b464]" />
              <span className="text-[9px] font-black uppercase tracking-[0.22em] text-[#d7b464]">Founding Vision</span>
            </div>

            {/* Stats strip — bottom of image on mobile */}
            <div className="absolute bottom-0 inset-x-0 lg:hidden flex divide-x divide-white/10">
              {team[0].stats.map((s) => (
                <div key={s.label} className="flex-1 px-4 py-4 bg-[#09120c]/85 backdrop-blur-md text-center">
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30">{s.label}</p>
                  <p className="text-sm font-black text-white mt-1">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Content Panel */}
          <div className="flex flex-col justify-center p-8 lg:p-12 space-y-7">
            {/* Meta */}
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#d7b464]">{team[0].specialty}</p>
              <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tight">{team[0].name}</h3>
              <p className="text-lg font-semibold text-white/60">{team[0].role}</p>
            </div>

            <p className="text-white/45 leading-relaxed max-w-lg text-sm">{team[0].description}</p>

            {/* Stats row — desktop only */}
            <div className="hidden lg:flex gap-6">
              {team[0].stats.map((s) => (
                <div key={s.label} className="border border-white/8 rounded-2xl px-5 py-3 bg-white/[0.03]">
                  <p className="text-[8px] font-black uppercase tracking-[0.18em] text-white/25">{s.label}</p>
                  <p className="text-base font-black text-white mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {team[0].tags.map((tag) => (
                <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-lime-400/70 border border-lime-400/20 bg-lime-400/5 rounded-full px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={team[0].linkedin}
                className="w-11 h-11 flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/50 hover:bg-[#d7b464] hover:text-[#102014] hover:border-[#d7b464] transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <button className="inline-flex items-center gap-2 rounded-2xl bg-lime-400 text-[#0a1508] px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-lime-300 transition-colors shadow-lg shadow-lime-400/20">
                View Profile <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row — Developer + CTA */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-8">

        {/* Developer Card — same split layout as CEO */}
        <div className="relative overflow-hidden rounded-[3rem] border border-white/8 bg-[linear-gradient(135deg,rgba(18,33,23,0.92),rgba(9,18,12,0.97))] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none" />
          <div className="absolute top-0 left-0 w-64 h-64 bg-lime-400/6 blur-[100px] pointer-events-none" />

          <div className="relative z-10 grid sm:grid-cols-[300px_1fr] h-full">
            {/* Full-bleed Image Panel */}
            <div className="relative overflow-hidden min-h-[360px]">
              <img
                src={team[1].image}
                alt={team[1].name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-top filter contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#09120c] hidden sm:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#09120c] via-black/20 to-transparent sm:hidden" />

              {/* Active badge */}
              <div className="absolute top-6 left-6 flex items-center gap-2 rounded-full bg-[#0a1508]/85 border border-lime-400/25 px-4 py-2 backdrop-blur-xl">
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.22em] text-lime-400">System Online</span>
              </div>
            </div>

            {/* Content Panel */}
            <div className="flex flex-col justify-center p-8 lg:p-10 space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#d7b464]">{team[1].specialty}</p>
                <h3 className="text-3xl font-black text-white mt-1 tracking-tight">{team[1].name}</h3>
                <p className="text-base font-semibold text-white/60 mt-0.5">{team[1].role}</p>
              </div>

              <p className="text-sm leading-relaxed text-white/45 max-w-sm">{team[1].description}</p>

              {/* Tech Stats Row — fills space and matches CEO style */}
              <div className="flex gap-4">
                <div className="border border-white/8 rounded-xl px-4 py-2 bg-white/[0.02]">
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/20">Engine</p>
                  <p className="text-xs font-black text-white mt-0.5 tracking-wide">Infrastructure</p>
                </div>
                <div className="border border-white/8 rounded-xl px-4 py-2 bg-white/[0.02]">
                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-white/20">Security</p>
                  <p className="text-xs font-black text-white mt-0.5 tracking-wide">Blockchain</p>
                </div>
              </div>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-2">
                {team[1].tags.map((tag) => (
                  <span key={tag} className="text-[8px] font-bold uppercase tracking-widest text-lime-400/60 border border-lime-400/15 bg-lime-400/5 rounded-full px-2.5 py-1">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <a href={team[1].linkedin} className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50 hover:bg-[#d7b464] hover:text-[#102014] transition-all">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <a href={team[1].github} className="w-9 h-9 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50 hover:bg-[#d7b464] hover:text-[#102014] transition-all">
                  <Github className="w-3.5 h-3.5" />
                </a>
                <button className="ml-auto inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-lime-400/70 hover:text-lime-400 transition-colors">
                  Portfolio <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mission / CTA Card */}
        <div className="relative overflow-hidden rounded-[3rem] border border-lime-400/15 bg-[linear-gradient(145deg,rgba(143,180,63,0.08),rgba(9,18,12,0.96))] p-8 md:p-10 flex flex-col justify-between shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-0 bg-grid opacity-[0.04] pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-56 h-56 bg-lime-400/10 blur-[80px] pointer-events-none" />

          <div className="relative z-10 space-y-6 flex-1 flex flex-col">
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center">
              <Globe className="w-7 h-7 text-lime-400" />
            </div>

            <div className="space-y-3 flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-lime-400/70">Join The Mission</p>
              <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                Ready to reshape agriculture?
              </h3>
              <p className="text-white/40 text-sm leading-relaxed">
                AgricLinkChain is building a stronger digital backbone for African agriculture — one farmer, one buyer, one trusted transaction at a time.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <Zap className="w-4 h-4 text-[#d7b464] mb-2" />
                <p className="text-lg font-black text-white">36+</p>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Active Regions</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <Code2 className="w-4 h-4 text-lime-400 mb-2" />
                <p className="text-lg font-black text-white">99.2%</p>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">Trade Verified</p>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-3 rounded-2xl bg-lime-400 text-[#0a1508] px-6 py-4 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-lime-300 transition-colors shadow-xl shadow-lime-400/20">
              Join the Mission <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
