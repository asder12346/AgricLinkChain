import { Shield, Leaf, Tractor, Anchor, CloudSun } from 'lucide-react';

const partners = [
  { name: 'AGRI-TRUST', icon: Shield, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { name: 'GROW-TECH', icon: Leaf, color: 'text-green-600', bgColor: 'bg-green-50' },
  { name: 'JOHN DEERE', icon: Tractor, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { name: 'E-Loader', icon: Anchor, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  { name: 'AGRIVEST', icon: CloudSun, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
];

export function Partners() {
  return (
    <section className="py-16 bg-white overflow-hidden border-b border-gray-100">
      <div className="section-container mb-12 text-center">
        <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
          Our platform is built to support farmers, agribusinesses, and agricultural innovators by delivering <span className="font-semibold text-green-600">practical tools</span> that respect the land while improving productivity.
        </p>
      </div>

      <div className="relative flex overflow-x-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 py-4">
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl ${partner.bgColor} transition-all duration-300 hover:scale-105`}
            >
              <partner.icon className={`w-8 h-8 ${partner.color}`} />
              <span className={`text-xl font-bold tracking-tight text-gray-800`}>
                {partner.name}
              </span>
            </div>
          ))}
        </div>

        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-12 py-4 ml-12">
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl ${partner.bgColor} transition-all duration-300 hover:scale-105`}
            >
              <partner.icon className={`w-8 h-8 ${partner.color}`} />
              <span className={`text-xl font-bold tracking-tight text-gray-800`}>
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
