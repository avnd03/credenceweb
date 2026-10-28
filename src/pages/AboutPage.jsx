import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FiAward, FiUsers, FiGlobe, FiHeart } from 'react-icons/fi';
import Stats from '../components/home/Stats';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us - Credence Holidays</title>
        <meta name="description" content="Learn about Credence Holidays - your trusted travel partner since 2010 with 14+ years of experience." />
      </Helmet>

      {/* Hero */}
      <div className="relative h-64 md:h-80 bg-hero-gradient flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920"
            alt="About Us"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">About Us</h1>
          <p className="text-xl text-white/80">Your Trusted Travel Partner Since 2010</p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-800 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Founded in 2010, Credence Holidays started with a simple mission - to make travel
                accessible, enjoyable, and memorable for everyone. What began as a small travel desk
                has now grown into one of India's most trusted holiday companies.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Over the past 14+ years, we've served more than 15,000 happy travelers, offering
                250+ carefully curated tour packages across 50+ destinations worldwide. Our success
                lies in our commitment to personalized service, competitive pricing, and attention
                to every detail of your journey.
              </p>
              <p className="text-gray-600 leading-relaxed">
                At Credence Holidays, we don't just plan trips - we create experiences that last
                a lifetime. Whether it's a family vacation, a romantic honeymoon, an adventure trek,
                or a spiritual pilgrimage, we ensure every moment is perfect.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=600"
                alt="Travel"
                className="rounded-2xl h-64 w-full object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600"
                alt="Adventure"
                className="rounded-2xl h-64 w-full object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600"
                alt="Culture"
                className="rounded-2xl h-64 w-full object-cover -mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=600"
                alt="Beach"
                className="rounded-2xl h-64 w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-10 shadow-lg">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <FiAward className="text-primary-600" size={28} />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide exceptional travel experiences that exceed expectations, combining
                quality, value, and personalized service. We aim to make every journey
                seamless and every destination unforgettable.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-10 shadow-lg">
              <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center mb-6">
                <FiGlobe className="text-accent-600" size={28} />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become India's most loved and trusted travel company, known for
                creating extraordinary holiday experiences that inspire people to
                explore the world and create beautiful memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Stats />

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title">Meet Our Team</h2>
          <p className="section-subtitle">
            Passionate travel experts dedicated to crafting your perfect holiday
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Rajesh Kumar', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' },
              { name: 'Sneha Patel', role: 'Operations Director', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300' },
              { name: 'Arjun Mehta', role: 'Head of Sales', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300' },
              { name: 'Kavya Sharma', role: 'Customer Relations', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300' },
            ].map((member, i) => (
              <div key={i} className="text-center group">
                <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4 shadow-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-heading font-semibold text-lg">{member.name}</h4>
                <p className="text-primary-600 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
