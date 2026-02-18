
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    q: "How do I register as a farmer?",
    a: "Simply click the 'Join Platform' button, select 'I'm a Farmer', and fill in your details. You'll need to verify your phone number and location to start listing products."
  },
  {
    q: "How are prices determined?",
    a: "Prices are set based on real-time market demand and quality grading. Farmers can set their own prices, and our platform provides suggested ranges based on current data."
  },
  {
    q: "Is the payment system secure?",
    a: "Yes, we use end-to-end encrypted payment gateways. Funds are held in escrow and released only after both parties confirm delivery and quality standards."
  },
  {
    q: "Do you offer delivery services?",
    a: "We partner with verified logistics companies to handle haulage and last-mile delivery. Shipping costs are calculated transparently during the transaction."
  }
];

const FAQ: React.FC = () => {
  const [active, setActive] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-4 mb-20">
        <h4 className="text-lime-600 font-bold uppercase tracking-widest text-sm">Got Questions?</h4>
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0A1D11]">Frequently asked questions</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-neutral-100 rounded-3xl overflow-hidden transition-all hover:shadow-lg">
            <button 
              onClick={() => setActive(active === idx ? null : idx)}
              className={`w-full text-left p-8 flex items-center justify-between transition-colors ${active === idx ? 'bg-[#0A1D11] text-white' : 'bg-white text-[#0A1D11]'}`}
            >
              <span className="text-xl font-bold">{faq.q}</span>
              {active === idx ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
            </button>
            <div className={`transition-all duration-300 ease-in-out ${active === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="p-8 text-neutral-500 leading-relaxed text-lg border-t border-neutral-100">
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
