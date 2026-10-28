import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import PackageCard from '../components/common/PackageCard';
import { packagesAPI } from '../services/api';
import { tourTypes } from '../utils/helpers';

const PackagesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    tour_type: searchParams.get('tour_type') || searchParams.get('type') || '',
    destination: searchParams.get('destination') || '',
    min_price: searchParams.get('min_price') || '',
    max_price: searchParams.get('max_price') || '',
    sort: searchParams.get('sort') || 'created_at',
    order: searchParams.get('order') || 'DESC',
    page: parseInt(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    fetchPackages();
  }, [filters]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const res = await packagesAPI.getAll(params);
      setPackages(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'created_at' && v !== 'DESC' && v !== 1) {
        params.set(k, v);
      }
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '', tour_type: '', destination: '', min_price: '', max_price: '',
      sort: 'created_at', order: 'DESC', page: 1,
    });
    setSearchParams({});
  };

  return (
    <>
      <Helmet>
        <title>Tour Packages - Credence Holidays</title>
        <meta name="description" content="Browse our wide range of domestic and international tour packages at the best prices." />
      </Helmet>

      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-hero-gradient flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920"
            alt="Tour Packages"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
            Tour Packages
          </h1>
          <p className="text-xl text-white/80">Find your perfect holiday package</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-semibold text-lg">Filters</h3>
                <button onClick={clearFilters} className="text-sm text-primary-600 hover:underline">
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search packages..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              {/* Tour Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tour Type</label>
                <select
                  value={filters.tour_type}
                  onChange={(e) => updateFilter('tour_type', e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">All Types</option>
                  {tourTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.min_price}
                    onChange={(e) => updateFilter('min_price', e.target.value)}
                    className="input-field text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.max_price}
                    onChange={(e) => updateFilter('max_price', e.target.value)}
                    className="input-field text-sm"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={`${filters.sort}-${filters.order}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('-');
                    setFilters({ ...filters, sort, order, page: 1 });
                  }}
                  className="input-field text-sm"
                >
                  <option value="created_at-DESC">Newest First</option>
                  <option value="price-ASC">Price: Low to High</option>
                  <option value="price-DESC">Price: High to Low</option>
                  <option value="duration_days-ASC">Duration: Short to Long</option>
                  <option value="rating-DESC">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{packages.length}</span> of{' '}
                <span className="font-semibold">{pagination.total || 0}</span> packages
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center space-x-2 text-primary-600 font-medium"
              >
                {showFilters ? <FiX /> : <FiFilter />}
                <span>{showFilters ? 'Hide Filters' : 'Filters'}</span>
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="loader"></div>
              </div>
            ) : packages.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {packages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => updateFilter('page', i + 1)}
                        className={`w-10 h-10 rounded-lg font-medium transition ${
                          pagination.page === i + 1
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-primary-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-heading font-semibold mb-2">No packages found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search criteria</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PackagesPage;
