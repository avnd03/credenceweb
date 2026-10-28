import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiUsers, FiStar } from 'react-icons/fi';
import { formatPrice, getImageUrl } from '../../utils/helpers';

const PackageCard = ({ pkg }) => {
  const hasDiscount = pkg.discount_price && pkg.discount_price < pkg.price;
  const discountPercent = hasDiscount
    ? Math.round(((pkg.price - pkg.discount_price) / pkg.price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover group">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={getImageUrl(pkg.main_image)}
          alt={pkg.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600';
          }}
        />
        <div className="gradient-overlay" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {discountPercent}% OFF
            </span>
          )}
          {pkg.featured && (
            <span className="bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>

        {/* Tour Type */}
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
            {pkg.tour_type}
          </span>
        </div>

        {/* Destination */}
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center space-x-1">
            <FiMapPin size={14} />
            <span className="text-sm font-medium">{pkg.destination_name}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition">
          {pkg.title}
        </h3>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {pkg.short_description || pkg.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <FiClock size={14} />
            <span>{pkg.duration_nights}N / {pkg.duration_days}D</span>
          </div>
          <div className="flex items-center space-x-1">
            <FiUsers size={14} />
            <span>Max {pkg.max_people}</span>
          </div>
          {pkg.rating > 0 && (
            <div className="flex items-center space-x-1">
              <FiStar size={14} className="text-yellow-500 fill-yellow-500" />
              <span>{pkg.rating}</span>
            </div>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            {hasDiscount && (
              <span className="text-gray-400 line-through text-sm">
                {formatPrice(pkg.price)}
              </span>
            )}
            <p className="text-2xl font-bold text-primary-600">
              {formatPrice(hasDiscount ? pkg.discount_price : pkg.price)}
            </p>
            <span className="text-xs text-gray-400">per person</span>
          </div>
          <Link
            to={`/packages/${pkg.slug}`}
            className="btn-primary !py-2.5 !px-5 text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
