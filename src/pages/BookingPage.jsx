import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiCheck, FiUser, FiMail, FiPhone, FiCalendar, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { packagesAPI, bookingsAPI } from '../services/api';
import { formatPrice, getImageUrl } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const BookingPage = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);

  const [formData, setFormData] = useState({
    full_name: user ? `${user.first_name} ${user.last_name}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    travel_date: '',
    num_adults: 1,
    num_children: 0,
    special_requests: '',
  });

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        // Try to get package by ID via slug search
        const res = await packagesAPI.getAll({ limit: 100 });
        const found = res.data.data.find(p => p.id === parseInt(packageId));
        if (found) {
          setPkg(found);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [packageId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const pricePerPerson = pkg ? (pkg.discount_price || pkg.price) : 0;
  const childPrice = pricePerPerson * 0.5;
  const totalPrice = (pricePerPerson * formData.num_adults) + (childPrice * formData.num_children);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await bookingsAPI.create({
        ...formData,
        package_id: parseInt(packageId),
      });
      setBookingRef(res.data.data.booking_ref);
      toast.success('Booking submitted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  // Booking Confirmation
  if (bookingRef) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="text-green-600" size={40} />
          </div>
          <h2 className="text-3xl font-heading font-bold text-gray-800 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your booking has been submitted successfully. Our team will contact you shortly.
          </p>
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
            <p className="text-2xl font-bold text-primary-600">{bookingRef}</p>
          </div>
          <p className="text-sm text-gray-500 mb-8">
            A confirmation email has been sent to <strong>{formData.email}</strong>
          </p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/')} className="btn-secondary flex-1">
              Go Home
            </button>
            <button onClick={() => navigate('/packages')} className="btn-primary flex-1">
              Browse More
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">Package Not Found</h2>
          <button onClick={() => navigate('/packages')} className="btn-primary">Browse Packages</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Book {pkg.title} - Credence Holidays</title>
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-gray-800 mb-8">Complete Your Booking</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-heading font-semibold mb-6">Traveler Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiUser className="inline mr-1" /> Full Name *
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiMail className="inline mr-1" /> Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiPhone className="inline mr-1" /> Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 98765 43210"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiCalendar className="inline mr-1" /> Travel Date *
                    </label>
                    <input
                      type="date"
                      name="travel_date"
                      value={formData.travel_date}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiUsers className="inline mr-1" /> Adults *
                    </label>
                    <select
                      name="num_adults"
                      value={formData.num_adults}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Adult' : 'Adults'}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Children</label>
                    <select
                      name="num_children"
                      value={formData.num_children}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {[0, 1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Child' : 'Children'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests</label>
                  <textarea
                    name="special_requests"
                    value={formData.special_requests}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any special requirements or preferences..."
                    className="input-field resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full text-lg disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : `Confirm Booking - ${formatPrice(totalPrice)}`}
                </button>
              </form>
            </div>

            {/* Booking Summary */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="font-heading font-semibold text-lg mb-4">Booking Summary</h3>

                <div className="flex gap-4 mb-6 pb-6 border-b">
                  <img
                    src={getImageUrl(pkg.main_image)}
                    alt={pkg.title}
                    className="w-24 h-24 rounded-xl object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200';
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{pkg.title}</h4>
                    <p className="text-gray-500 text-xs mt-1">{pkg.destination_name}</p>
                    <p className="text-gray-500 text-xs">{pkg.duration_nights}N / {pkg.duration_days}D</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Adults ({formData.num_adults}x)</span>
                    <span>{formatPrice(pricePerPerson * formData.num_adults)}</span>
                  </div>
                  {formData.num_children > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Children ({formData.num_children}x)</span>
                      <span>{formatPrice(childPrice * formData.num_children)}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">Total Amount</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-4">
                  * Taxes and fees may apply. Final amount will be confirmed by our team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingPage;
