import React, { useState, useEffect } from 'react';
import SearchBar from '../common/SearchBar';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920',
    title: 'Discover Paradise',
    subtitle: 'Explore stunning beaches and crystal-clear waters',
  },
  {
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920',
    title: 'Adventure Awaits',
    subtitle: 'Trek through majestic mountains and lush valleys',
  },
  {
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920',
    title: 'Luxury Getaways',
    subtitle: 'Experience world-class hospitality and comfort',
  },
  {
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920',
    title: 'Cultural Journeys',
    subtitle: 'Immerse yourself in rich heritage and traditions',
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        <div className="text-center mb-10 fade-in">
          <p className="text-primary-300 font-medium mb-3 tracking-wider uppercase text-sm">
            Welcome to Credence Holidays
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-heading text-white mb-4 leading-tight">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-4xl">
          <SearchBar />
        </div>

        {/* Slide Indicators */}
        <div className="flex space-x-3 mt-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
