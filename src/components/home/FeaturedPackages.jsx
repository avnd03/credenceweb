import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PackageCard from '../common/PackageCard';
import { packagesAPI } from '../../services/api';

const FeaturedPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await packagesAPI.getAll({ featured: true, limit: 6 });
      setPackages(res.data.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = activeTab === 'all'
    ? packages
    : packages.filter((p) => p.tour_type === activeTab);

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'domestic', label: 'Domestic' },
    { key: 'international', label: 'International' },
    { key: 'honeymoon', label: 'Honeymoon' },
    { key: 'adventure', label: 'Adventure' },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-title">Featured Tour Packages</h2>
        <p className="section-subtitle">
          Hand-picked holiday packages designed to give you the best travel experience
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600 shadow'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="flex justify-center">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}

        {filteredPackages.length === 0 && !loading && (
          <p className="text-center text-gray-500 py-8">No packages found in this category.</p>
        )}

        <div className="text-center mt-12">
          <Link to="/packages" className="btn-secondary">
            View All Packages →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedPackages;
