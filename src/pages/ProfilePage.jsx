import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiUser, FiCalendar, FiPackage, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authAPI, bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate } from '../utils/helpers';

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingsAPI.getUserBookings();
      setBookings(res.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await authAPI.updateProfile(profile);
      login({ ...user, ...profile });
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  return (
    <>
      <Helmet>
        <title>My Profile - Credence Holidays</title>
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-5xl mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUser className="text-primary-600" size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 rounded-xl font-medium transition ${
                activeTab === 'bookings' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 shadow'
              }`}
            >
              <FiPackage className="inline mr-2" /> My Bookings
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-xl font-medium transition ${
                activeTab === 'profile' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 shadow'
              }`}
            >
              <FiEdit2 className="inline mr-2" /> Edit Profile
            </button>
          </div>

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-heading font-semibold text-lg">{booking.package_title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor[booking.status]}`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <span>📍 {booking.destination_name}</span>
                          <span>📅 {formatDate(booking.travel_date)}</span>
                          <span>👥 {booking.num_adults}A + {booking.num_children}C</span>
                          <span>🔖 Ref: {booking.booking_ref}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">{formatPrice(booking.total_price)}</p>
                        <p className="text-sm text-gray-500">{formatDate(booking.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <FiCalendar className="mx-auto text-gray-300 mb-4" size={48} />
                  <h3 className="text-xl font-heading font-semibold mb-2">No bookings yet</h3>
                  <p className="text-gray-500">Start exploring our amazing tour packages!</p>
                </div>
              )}
            </div>
          )}

          {/* Profile Edit Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-heading font-semibold mb-6">Edit Profile</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={profile.first_name}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profile.last_name}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <button type="submit" className="btn-primary">Save Changes</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
