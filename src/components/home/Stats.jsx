import React, { useState, useEffect, useRef } from 'react';

const stats = [
  { number: 15000, suffix: '+', label: 'Happy Travelers' },
  { number: 250, suffix: '+', label: 'Tour Packages' },
  { number: 50, suffix: '+', label: 'Destinations' },
  { number: 14, suffix: '+', label: 'Years Experience' },
];

const Stats = () => {
  const [counters, setCounters] = useState(stats.map(() => 0));
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    stats.forEach((stat, index) => {
      const increment = stat.number / 60;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.number) {
          current = stat.number;
          clearInterval(timer);
        }
        setCounters((prev) => {
          const newCounters = [...prev];
          newCounters[index] = Math.floor(current);
          return newCounters;
        });
      }, 30);
    });
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-16 bg-hero-gradient">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <h3 className="text-4xl md:text-5xl font-bold font-heading text-white mb-2">
                {counters[index].toLocaleString()}{stat.suffix}
              </h3>
              <p className="text-primary-200 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
