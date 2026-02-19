
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
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp: number | null = null;
    const duration = 2000; // 2 seconds animation

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutExpo
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentCount = easedProgress * target;
      setCount(currentCount);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isVisible, target]);

  return (
    <div ref={elementRef} className="text-4xl md:text-5xl lg:text-6xl font-black text-lime-400 tracking-tighter tabular-nums">
      {prefix}{count.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}{suffix}
    </div>
  );
};

const Stats: React.FC = () => {
  const stats = [
    { target: 0.3, decimals: 1, prefix: '', suffix: 'M+', label: 'Farmers Onboarded' },
    { target: 1.2, decimals: 1, prefix: '₦', suffix: 'B+', label: 'Daily Transactions' },
    { target: 45, decimals: 0, prefix: '', suffix: 'K+', label: 'Active Buyers' },
    { target: 2500, decimals: 0, prefix: '', suffix: '+', label: 'Communities Reached' }
  ];

  return (
    <div className="bg-[#0A1D11] py-20 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-2 group">
              <AnimatedCounter 
                target={stat.target} 
                decimals={stat.decimals} 
                prefix={stat.prefix} 
                suffix={stat.suffix} 
              />
              <div className="text-sm md:text-base text-white/50 font-medium uppercase tracking-widest group-hover:text-white transition-colors">
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
