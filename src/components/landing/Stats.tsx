import { useEffect, useState, useRef } from 'react';

interface StatItemProps {
  value: string;
  label: string;
  suffix?: string;
}

function StatItem({ value, label }: { value: string; label: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const suffix = value.replace(/[0-9.]/g, '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
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

      const current = progress * numericValue;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isVisible, numericValue]);

  return (
    <div ref={containerRef} className="text-center group hover:-translate-y-1 transition-transform duration-300">
      <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
        {displayValue.toLocaleString(undefined, {
          maximumFractionDigits: displayValue < 10 ? 1 : 0
        })}{suffix}
      </div>
      <div className="text-sm font-bold uppercase tracking-widest text-gray-500">
        {label}
      </div>
    </div>
  );
}

export function Stats() {
  const stats = [
    { value: '1.5M+', label: 'Acres Monitored' },
    { value: '500K+', label: 'Farmers Empowered' },
    { value: '2M+', label: 'Tons Produce Traded' },
    { value: '750K+', label: 'Successful Harvests' },
  ];

  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem key={index} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
