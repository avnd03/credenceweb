import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiCalendar, FiUsers, FiDollarSign, FiTrendingUp, FiArrowRight, FiEye } from 'react-icons/fi';
import { packagesAPI } from '../../services/api';
import { formatPrice, formatDate } from '../../utils/helpers';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await packagesAPI.getStats();
        setStats(res.data.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="loader"></div></div>;

  const statCards = [
    { icon: <FiPackage />, label: 'Total Packages', value: stats?.totalPackages || 0, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-600', link: '/admin/packages' },
    { icon: <FiCalendar />, label: 'Total Bookings', value: stats?.totalBookings || 0, color: 'green', bg: 'bg-green-50', text: 'text-green-600', link: '/admin/bookings' },
    { icon: <FiUsers />, label: 'Registered Users', value: stats?.totalUsers || 0, color: 'purple', bg: 'bg-purple-50', text: 'text-purple-600', link: '/admin/users' },
    { icon: <FiDollarSign />, label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), color: 'orange', bg: 'bg-orange-50', text: 'text-orange-600', link: '/admin/bookings' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-heading font-bold mb-2">Welcome back, Admin! 👋</h2>
        <p className="text-primary-200">Here's what's happening with Credence Holidays today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <Link key={i} to={card.link} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                {React.cloneElement(card.icon, { size: 22, className: card.text })}
              </div>
              <FiArrowRight className="text-gray-300 group-hover:text-primary-500 transition" />
            </div>
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/packages/create" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition border-l-4 border-primary-500">
          <h3 className="font-semibold text-gray-800 mb-2">➕ Add New Package</h3>
          <p className="text-sm text-gray-500">Create a new tour package with itinerary</p>
        </Link>
        <Link to="/admin/destinations/create" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition border-l-4 border-green-500">
          <h3 className="font-semibold text-gray-800 mb-2">🌍 Add Destination</h3>
          <p className="text-sm text-gray-500">Add a new travel destination</p>
        </Link>
        <Link to="/admin/bookings" className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition border-l-4 border-orange-500">
          <h3 className="font-semibold text-gray-800 mb-2">📋 Manage Bookings</h3>
          <p className="text-sm text-gray-500">View and manage all customer bookings</p>
        </Link>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-heading font-semibold">Recent Bookings</h3>
          <Link to="/admin/bookings" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
            View All <FiArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Booking Ref</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Customer</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Package</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Amount</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats?.recentBookings?.length > 0 ? stats.recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-primary-600">{b.booking_ref}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{b.full_name}</p>
                    <p className="text-xs text-gray-400">{b.email}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-[200px] truncate">{b.package_title}</td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{formatPrice(b.total_price)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(b.created_at)}</td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-400">No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
    unpaid: 'bg-gray-100 text-gray-700',
    partial: 'bg-orange-100 text-orange-700',
    refunded: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export default AdminDashboard;
