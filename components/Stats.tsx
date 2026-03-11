
import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  target: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ target, decimals = 0, prefix = '', suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.3 }
    );
    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTimestamp: number | null = null;
    const duration = 2200;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(eased * target);
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [isVisible, target]);

  return (
    <div ref={elementRef} className="text-4xl md:text-5xl font-black text-lime-400 tracking-tighter tabular-nums leading-none">
      {prefix}{count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </div>
  );
};

const Stats: React.FC = () => {
  const stats = [
    { target: 0.3, decimals: 1, prefix: '', suffix: 'M+', label: 'Farmers Onboarded', sub: 'Across 36 states' },
    { target: 1.2, decimals: 1, prefix: '₦', suffix: 'B+', label: 'Daily Transactions', sub: 'Processed securely' },
    { target: 45, decimals: 0, prefix: '', suffix: 'K+', label: 'Active Buyers', sub: 'Local & international' },
    { target: 2500, decimals: 0, prefix: '', suffix: '+', label: 'Communities', sub: 'Transformed by tech' },
  ];

  return (
    <div className="relative bg-[#071210] py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-lime-400/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="badge-live mx-auto mb-4">Results That Speak</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Numbers behind the mission
          </h2>
        </div>

        {/* Stat Cards - Bento Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="group glass rounded-2xl p-6 md:p-8 card-hover border-white/[0.06] text-center space-y-2"
            >
              <AnimatedCounter
                target={stat.target}
                decimals={stat.decimals}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
              <div className="text-sm md:text-base text-white font-bold group-hover:text-lime-300 transition-colors">{stat.label}</div>
              <div className="text-xs text-white/30">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
