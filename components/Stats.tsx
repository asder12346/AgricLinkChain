
import React from 'react';

const Stats: React.FC = () => {
  const stats = [
    { value: '0.3M+', label: 'Farmers Onboarded' },
    { value: '₦1.2B+', label: 'Daily Transactions' },
    { value: '45K+', label: 'Active Buyers' },
    { value: '2,500+', label: 'Communities Reached' }
  ];

  return (
    <div className="bg-[#0A1D11] py-20 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-4xl md:text-5xl lg:text-6xl font-black text-lime-400 tracking-tighter">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-white/50 font-medium uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
