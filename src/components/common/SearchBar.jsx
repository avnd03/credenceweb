import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiCalendar } from 'react-icons/fi';
import { tourTypes } from '../../utils/helpers';

const SearchBar = ({ className = '' }) => {
  const [search, setSearch] = useState('');
  const [tourType, setTourType] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (tourType) params.set('tour_type', tourType);
    navigate(`/packages?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className={`${className}`}>
      <div className="bg-white rounded-2xl shadow-2xl p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Destination Search */}
          <div className="relative">
            <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" size={20} />
            <input
              type="text"
              placeholder="Where do you want to go?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-12"
            />
          </div>

          {/* Tour Type */}
          <div className="relative">
            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" size={20} />
            <select
              value={tourType}
              onChange={(e) => setTourType(e.target.value)}
              className="input-field !pl-12 appearance-none cursor-pointer"
            >
              <option value="">All Tour Types</option>
              {tourTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button type="submit" className="btn-primary flex items-center justify-center space-x-2">
            <FiSearch size={20} />
            <span>Search Packages</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
