import React from 'react';
import { FiShield, FiDollarSign, FiHeadphones, FiAward, FiHeart, FiGlobe } from 'react-icons/fi';

const features = [
  {
    icon: <FiShield size={32} />,
    title: 'Trusted & Safe',
    description: 'Licensed and certified travel agency with 14+ years of experience in the industry.',
  },
  {
    icon: <FiDollarSign size={32} />,
    title: 'Best Price Guarantee',
    description: 'We guarantee the best prices with no hidden charges. Value for every penny spent.',
  },
  {
    icon: <FiHeadphones size={32} />,
    title: '24/7 Support',
    description: 'Round-the-clock customer support before, during, and after your trip.',
  },
  {
    icon: <FiAward size={32} />,
    title: 'Award Winning',
    description: 'Multiple awards for excellence in travel services and customer satisfaction.',
  },
  {
    icon: <FiHeart size={32} />,
    title: 'Personalized Service',
    description: 'Customized itineraries tailored to your preferences, budget, and travel style.',
  },
  {
    icon: <FiGlobe size={32} />,
    title: 'Global Network',
    description: 'Strong partnerships with hotels, airlines, and local guides across the globe.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-primary-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-500 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400 rounded-full translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-center mb-4">
          Why Choose Credence Holidays?
        </h2>
        <p className="text-primary-200 text-center max-w-2xl mx-auto mb-16">
          We are committed to making your holidays memorable with our exceptional services
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10
                         hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-primary-500/30 rounded-xl flex items-center justify-center mb-6
                              group-hover:bg-primary-500 transition-colors duration-300">
                <span className="text-primary-300 group-hover:text-white transition-colors">
                  {feature.icon}
                </span>
              </div>
              <h3 className="font-heading font-semibold text-xl mb-3">{feature.title}</h3>
              <p className="text-primary-200 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
