import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FiMapPin, FiClock, FiUsers, FiStar, FiCheck, FiX,
  FiCalendar, FiSun, FiChevronDown, FiChevronUp, FiShare2
} from 'react-icons/fi';
import { packagesAPI } from '../services/api';
import { formatPrice, getImageUrl } from '../utils/helpers';
import Loader from '../components/common/Loader';
import PackageCard from '../components/common/PackageCard';

const PackageDetailPage = () => {
  const { slug } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedDays, setExpandedDays] = useState([1]);

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      try {
        const res = await packagesAPI.getBySlug(slug);
        setPkg(res.data.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [slug]);

  const toggleDay = (dayNumber) => {
    setExpandedDays((prev) =>
      prev.includes(dayNumber)
        ? prev.filter((d) => d !== dayNumber)
        : [...prev, dayNumber]
    );
  };

  if (loading) return <Loader />;
  if (!pkg) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-heading font-bold mb-4">Package Not Found</h2>
        <Link to="/packages" className="btn-primary">Browse Packages</Link>
      </div>
    </div>
  );

  const hasDiscount = pkg.discount_price && pkg.discount_price < pkg.price;
  const inclusions = pkg.inclusions ? pkg.inclusions.split(',').map(s => s.trim()) : [];
  const exclusions = pkg.exclusions ? pkg.exclusions.split(',').map(s => s.trim()) : [];

  return (
    <>
      <Helmet>
        <title>{pkg.title} - Credence Holidays</title>
        <meta name="description" content={pkg.short_description || pkg.description?.substring(0, 160)} />
      </Helmet>

      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px]">
        <img
          src={getImageUrl(pkg.main_image)}
          alt={pkg.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-primary-600 text-white text-sm font-medium px-4 py-1.5 rounded-full capitalize">
                {pkg.tour_type}
              </span>
              {hasDiscount && (
                <span className="bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                  {Math.round(((pkg.price - pkg.discount_price) / pkg.price) * 100)}% OFF
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-heading text-white mb-4">
              {pkg.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <span className="flex items-center gap-2">
                <FiMapPin /> {pkg.destination_name}, {pkg.country}
              </span>
              <span className="flex items-center gap-2">
                <FiClock /> {pkg.duration_nights}N / {pkg.duration_days}D
              </span>
              <span className="flex items-center gap-2">
                <FiUsers /> Max {pkg.max_people} People
              </span>
              {pkg.rating > 0 && (
                <span className="flex items-center gap-2">
                  <FiStar className="fill-yellow-400 text-yellow-400" /> {pkg.rating} ({pkg.total_reviews} reviews)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex border-b mb-8 overflow-x-auto">
              {['overview', 'itinerary', 'inclusions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium capitalize whitespace-nowrap transition border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'text-primary-600 border-primary-600'
                      : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="fade-in">
                <h2 className="text-2xl font-heading font-bold mb-4">Overview</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-8">
                  {pkg.description}
                </p>

                {pkg.best_season && (
                  <div className="bg-primary-50 rounded-xl p-6 flex items-center gap-4 mb-8">
                    <FiSun className="text-primary-600" size={24} />
                    <div>
                      <h4 className="font-semibold text-gray-800">Best Season to Visit</h4>
                      <p className="text-gray-600">{pkg.best_season}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Itinerary Tab */}
            {activeTab === 'itinerary' && (
              <div className="fade-in space-y-4">
                <h2 className="text-2xl font-heading font-bold mb-6">Day-wise Itinerary</h2>
                {pkg.itinerary && pkg.itinerary.length > 0 ? (
                  pkg.itinerary.map((day) => (
                    <div key={day.day_number} className="border rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleDay(day.day_number)}
                        className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {day.day_number}
                          </span>
                          <div className="text-left">
                            <h4 className="font-semibold text-gray-800">Day {day.day_number}: {day.title}</h4>
                            {day.meals && <p className="text-sm text-gray-500">🍽️ {day.meals}</p>}
                          </div>
                        </div>
                        {expandedDays.includes(day.day_number) ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                      {expandedDays.includes(day.day_number) && (
                        <div className="p-5 border-t">
                          <p className="text-gray-600 leading-relaxed">{day.description}</p>
                          {day.accommodation && day.accommodation !== 'N/A' && (
                            <p className="mt-3 text-sm text-gray-500">
                              🏨 <strong>Accommodation:</strong> {day.accommodation}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Detailed itinerary will be shared upon booking.</p>
                )}
              </div>
            )}

            {/* Inclusions Tab */}
            {activeTab === 'inclusions' && (
              <div className="fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-heading font-bold text-green-700 mb-4">✅ Inclusions</h3>
                  <ul className="space-y-3">
                    {inclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <FiCheck className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-heading font-bold text-red-700 mb-4">❌ Exclusions</h3>
                  <ul className="space-y-3">
                    {exclusions.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <FiX className="text-red-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24 border">
              <div className="mb-6">
                {hasDiscount && (
                  <span className="text-gray-400 line-through text-lg">
                    {formatPrice(pkg.price)}
                  </span>
                )}
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-primary-600">
                    {formatPrice(hasDiscount ? pkg.discount_price : pkg.price)}
                  </span>
                  <span className="text-gray-500 mb-1">/ person</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-500 flex items-center gap-2">
                    <FiClock /> Duration
                  </span>
                  <span className="font-medium">{pkg.duration_nights}N / {pkg.duration_days}D</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-500 flex items-center gap-2">
                    <FiMapPin /> Destination
                  </span>
                  <span className="font-medium">{pkg.destination_name}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-500 flex items-center gap-2">
                    <FiUsers /> Max Group Size
                  </span>
                  <span className="font-medium">{pkg.max_people} People</span>
                </div>
                {pkg.best_season && (
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-500 flex items-center gap-2">
                      <FiCalendar /> Best Season
                    </span>
                    <span className="font-medium">{pkg.best_season}</span>
                  </div>
                )}
              </div>

              <Link
                to={`/booking/${pkg.id}`}
                className="btn-primary w-full text-center block text-lg"
              >
                Book Now
              </Link>

              <a
                href={`https://wa.me/919876543210?text=Hi, I'm interested in ${pkg.title} package.`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full py-3 rounded-lg font-medium border-2 border-green-500 text-green-600
                           hover:bg-green-500 hover:text-white transition-all duration-300 flex items-center
                           justify-center gap-2 block text-center"
              >
                💬 Enquire on WhatsApp
              </a>

              <button
                onClick={() => {
                  navigator.share?.({
                    title: pkg.title,
                    text: pkg.short_description,
                    url: window.location.href,
                  }).catch(() => {
                    navigator.clipboard.writeText(window.location.href);
                  });
                }}
                className="mt-3 w-full py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100
                           transition flex items-center justify-center gap-2"
              >
                <FiShare2 /> Share Package
              </button>
            </div>
          </div>
        </div>

        {/* Related Packages */}
        {pkg.related_packages && pkg.related_packages.length > 0 && (
          <div className="mt-20">
            <h2 className="section-title">Similar Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {pkg.related_packages.map((relPkg) => (
                <PackageCard key={relPkg.id} pkg={relPkg} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PackageDetailPage;
