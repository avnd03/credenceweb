import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/home/HeroSection';
import FeaturedPackages from '../components/home/FeaturedPackages';
import PopularDestinations from '../components/home/PopularDestinations';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Stats from '../components/home/Stats';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Credence Holidays - Your Journey Begins Here | Best Tour Packages</title>
        <meta name="description" content="Credence Holidays offers the best domestic and international tour packages. Explore amazing destinations with personalized service and unbeatable prices." />
      </Helmet>

      <HeroSection />
      <FeaturedPackages />
      <PopularDestinations />
      <WhyChooseUs />
      <Stats />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default HomePage;
