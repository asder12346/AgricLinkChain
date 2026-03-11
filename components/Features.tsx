
import React from 'react';
import { Globe, ShieldCheck, BarChart3, Zap, ArrowUpRight } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      number: '01',
      title: 'Global Marketplace',
      desc: 'Access buyers from 40+ countries without intermediaries. List your crop, set your price, sell directly.',
      accent: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      number: '02',
      title: 'Secure Escrow Payments',
      desc: 'Funds held safely in escrow and released only after confirmed delivery. Zero chargebacks, full trust.',
      accent: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      number: '03',
      title: 'Smart Inventory AI',
      desc: 'AI-driven tools predict demand, suggest optimal pricing, and track stock from field to fulfillment.',
      accent: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      number: '04',
      title: 'Instant Market Alerts',
      desc: 'Real-time commodity price notifications keep you ahead of market movements and maximize earnings.',
      accent: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div className="space-y-4 max-w-xl">
          <div className="badge-live">Why AgricLinkChain?</div>
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Everything you need to{' '}
            <span className="text-gradient-lime">farm smarter</span>
          </h2>
        </div>
        <p className="text-white/45 max-w-sm leading-relaxed lg:text-right">
          One platform. Full supply chain visibility. From field to global buyer.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="group relative glass rounded-2xl p-7 card-hover overflow-hidden"
          >
            {/* Number watermark */}
            <div className="absolute top-5 right-6 text-7xl font-black text-white/[0.03] leading-none select-none pointer-events-none">
              {f.number}
            </div>

            {/* Icon */}
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border ${f.accent} mb-5 transition-transform duration-300 group-hover:scale-110`}>
              {f.icon}
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-lime-300 transition-colors">{f.title}</h3>
            <p className="text-white/50 leading-relaxed">{f.desc}</p>

            <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-lime-400/60 group-hover:text-lime-400 transition-colors">
              Learn more <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom ribbon stats */}
      <div className="mt-8 grid grid-cols-3 divide-x divide-white/[0.06] bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        {[
          { value: '98%', label: 'Uptime SLA' },
          { value: '< 30s', label: 'Payment Settlement' },
          { value: '40+', label: 'Countries Reached' },
        ].map((s, i) => (
          <div key={i} className="py-7 text-center group hover:bg-white/[0.03] transition-colors">
            <div className="text-2xl font-extrabold text-lime-400">{s.value}</div>
            <div className="text-xs text-white/40 font-semibold tracking-widest uppercase mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
