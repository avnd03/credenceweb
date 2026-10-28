import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { destinationsAPI } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';

const PopularDestinations = () => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationsAPI.getAll({ featured: true });
        setDestinations(res.data.data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };
    fetchDestinations();
  }, []);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">Popular Destinations</h2>
        <p className="section-subtitle">
          Explore trending destinations loved by travelers worldwide
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {destinations.map((dest, index) => (
            <Link
              key={dest.id}
              to={`/packages?destination=${dest.slug}`}
              className={`relative rounded-2xl overflow-hidden group cursor-pointer card-hover ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
              style={{ minHeight: index === 0 ? '400px' : '200px' }}
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
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-heading font-bold text-xl mb-1">
                  {dest.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">
                    {dest.package_count} {dest.package_count === 1 ? 'package' : 'packages'}
                  </span>
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center space-x-1 text-sm">
                    <span>Explore</span>
                    <FiArrowRight />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/destinations" className="btn-secondary">
            All Destinations →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
