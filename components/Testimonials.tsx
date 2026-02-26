
import React from 'react';
import { Quote } from 'lucide-react';

const stories = [
  {
    name: 'Ibrahim Musa',
    location: 'Rice Farmer, Jigawa',
    quote: "AgricLinkChain changed my life. I used to sell to middlemen who took 40% of my profit. Now I sell directly and earn almost double.",
    img: 'https://picsum.photos/seed/ib-musa/100/100'
  },
  {
    name: 'Aisha Bello',
    location: 'Cocoa Producer, Osun',
    quote: "The transparency and ease of payment are what I love most. I can track every kilo of cocoa from my farm to the buyer.",
    img: 'https://picsum.photos/seed/ai-bello/100/100'
  }
];

const Testimonials: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-4 mb-20">
        <h4 className="text-lime-600 font-bold uppercase tracking-widest text-sm">Real Stories</h4>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0A1D11]">By Our Farmers</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {stories.map((story, idx) => (
          <div key={idx} className="relative bg-white p-12 rounded-[2.5rem] shadow-xl shadow-neutral-200/50 border border-neutral-100 flex flex-col justify-between">
            <div className="absolute top-10 right-10 text-lime-400 opacity-20">
              <Quote className="w-20 h-20 fill-current" />
            </div>
            
            <p className="text-2xl font-medium text-[#0A1D11] leading-relaxed italic mb-12 relative z-10">
              "{story.quote}"
            </p>

            <div className="flex items-center gap-4">
              <img src={story.img} alt={story.name} className="w-16 h-16 rounded-2xl object-cover" />
              <div>
                <div className="text-xl font-bold text-[#0A1D11]">{story.name}</div>
                <div className="text-neutral-500 font-medium">{story.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
