import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiArrowRight } from 'react-icons/fi';
import { destinationsAPI } from '../services/api';
import { getImageUrl } from '../utils/helpers';
import Loader from '../components/common/Loader';

const DestinationsPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationsAPI.getAll();
        setDestinations(res.data.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <Helmet>
        <title>Destinations - Credence Holidays</title>
        <meta name="description" content="Explore popular travel destinations offered by Credence Holidays." />
      </Helmet>

      <div className="relative h-64 md:h-80 bg-hero-gradient flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=1920"
            alt="Destinations"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">Destinations</h1>
          <p className="text-xl text-white/80">Discover the world's most beautiful places</p>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <Link
                key={dest.id}
                to={`/packages?destination=${dest.slug}`}
                className="group relative rounded-2xl overflow-hidden h-80 card-hover"
              >
                <img
                  src={getImageUrl(dest.image)}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600';
                  }}
                />
                <div className="gradient-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-primary-300 text-sm font-medium">{dest.country}</span>
                  <h3 className="text-2xl font-heading font-bold text-white mb-2">{dest.name}</h3>
                  <p className="text-white/80 text-sm mb-3 line-clamp-2">{dest.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">
                      {dest.package_count} {dest.package_count === 1 ? 'package' : 'packages'}
                    </span>
                    <span className="text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <FiArrowRight />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {destinations.length === 0 && (
            <div className="text-center py-20">
              <h3 className="text-xl font-heading font-semibold">No destinations found</h3>
              <p className="text-gray-500 mt-2">Check back soon for exciting new destinations!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default DestinationsPage;
