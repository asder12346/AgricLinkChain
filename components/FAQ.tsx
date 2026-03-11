
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: "How do I register as a farmer?",
    a: "Click 'Get Started', select 'I'm a Farmer', and complete your profile. You'll provide your farm size, location, and primary crops. Verification is near-instant so you can start listing produce within minutes."
  },
  {
    q: "How are prices determined on the platform?",
    a: "Prices are driven by real-time market demand and quality grading. Farmers set their own asking price, and our AI suggests competitive ranges based on current commodity data and historical trends."
  },
  {
    q: "Is the payment system secure?",
    a: "Absolutely. We use an escrow model — funds are held securely and only released after both parties confirm successful delivery and quality standards are met. End-to-end encrypted."
  },
  {
    q: "Do you offer logistics / delivery services?",
    a: "Yes. We partner with verified logistics companies for haulage and last-mile delivery. Shipping costs are calculated transparently during checkout so there are no surprise fees."
  },
  {
    q: "Can international buyers purchase from Nigerian farmers?",
    a: "Yes! We support global exports to 40+ countries. International buyers can browse listings, make offers, and purchase with automatic currency conversion and compliant cross-border payments."
  },
];

const FAQ: React.FC = () => {
  const [active, setActive] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-4 mb-14">
        <div className="inline-flex items-center gap-2 bg-lime-600/10 border border-lime-600/20 rounded-full px-4 py-2">
          <span className="text-xs font-bold uppercase tracking-widest text-lime-600">Got Questions?</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#071210]">
          Frequently asked questions
        </h2>
        <p className="text-neutral-400 max-w-sm mx-auto">
          Everything you need to get started with AgricLinkChain.
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
              active === idx
                ? 'border-lime-200 shadow-lg shadow-lime-100/50'
                : 'border-neutral-100 hover:border-neutral-200'
            }`}
          >
            <button
              onClick={() => setActive(active === idx ? null : idx)}
              className={`w-full text-left px-7 py-5 flex items-center justify-between transition-colors gap-4 ${
                active === idx ? 'bg-[#071210] text-white' : 'bg-white text-[#071210] hover:bg-neutral-50'
              }`}
            >
              <span className="font-bold text-base">{faq.q}</span>
              <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                active === idx
                  ? 'bg-lime-400 border-lime-400 text-[#071210]'
                  : 'border-neutral-200 text-neutral-400'
              }`}>
                {active === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </span>
            </button>
            <div className={`transition-all duration-300 ease-in-out ${active === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="px-7 py-5 text-neutral-500 leading-relaxed border-t border-neutral-100 bg-white">
                {faq.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
