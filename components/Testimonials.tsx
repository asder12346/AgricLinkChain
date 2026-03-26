
import React from 'react';

const stories = [
  {
    name: 'Ibrahim Musa',
    location: 'Rice Farmer, Jigawa',
    quote: "AgricLinkChain changed my life. I used to sell to middlemen who took 40% of my profit. Now I sell directly and earn almost double.",
    img: 'https://picsum.photos/seed/ib-musa/100/100',
    crop: 'Rice Farming',
    earnings: '↑ 92%',
    stars: 5,
  },
  {
    name: 'Aisha Bello',
    location: 'Cocoa Producer, Osun',
    quote: "The transparency and ease of payment are what I love most. I can track every kilo of cocoa from my farm to the buyer in real time.",
    img: 'https://picsum.photos/seed/ai-bello/100/100',
    crop: 'Cocoa Production',
    earnings: '↑ 68%',
    stars: 5,
  },
  {
    name: 'Emeka Okafor',
    location: 'Cassava Farmer, Anambra',
    quote: "With market alerts and direct access to Lagos buyers, I never miss a good price window. This platform is a game changer.",
    img: 'https://picsum.photos/seed/emeka-ok/100/100',
    crop: 'Cassava & Yam',
    earnings: '↑ 55%',
    stars: 5,
  },
];

const Testimonials: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 bg-lime-600/10 border border-lime-600/20 rounded-full px-4 py-2">
          <span className="text-xs font-bold uppercase tracking-widest text-lime-600">Real Stories</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#071210]">
          Farmers who transformed their lives
        </h2>
        <p className="text-neutral-500 max-w-md mx-auto">Real results from real farmers across Nigeria.</p>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {stories.map((story, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-[1.75rem] border border-neutral-100 p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-neutral-200/80 hover:-translate-y-1"
          >
            {/* Stars */}
            <div>
              <div className="flex gap-1 mb-5">
                {Array.from({ length: story.stars }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-[#071210] text-base leading-relaxed font-medium italic mb-6">
                "{story.quote}"
              </p>
            </div>

            {/* Author + Stats */}
            <div>
              {/* Earnings badge */}
              <div className="flex items-center justify-between mb-5 p-3 bg-lime-50 rounded-xl">
                <span className="text-xs text-lime-700 font-semibold">{story.crop}</span>
                <span className="text-xs font-extrabold text-lime-600">{story.earnings} earnings</span>
              </div>
              {/* Author */}
              <div className="flex items-center gap-3">
                <img src={story.img} alt={story.name} loading="lazy" decoding="async" className="w-12 h-12 rounded-2xl object-cover" />
                <div>
                  <div className="font-bold text-[#071210]">{story.name}</div>
                  <div className="text-xs text-neutral-400">{story.location}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
