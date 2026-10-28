import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiPhone, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { bookingsAPI } from '../../services/api';
import { formatPrice, formatDate } from '../../utils/helpers';
import { StatusBadge } from './AdminDashboard';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await bookingsAPI.getAll(params);
      setBookings(res.data.data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, field, value) => {
    try {
      await bookingsAPI.updateStatus(id, { [field]: value });
      toast.success('Booking updated');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-gray-800">Bookings</h2>
        <p className="text-sm text-gray-500 mt-1">View and manage all customer bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {['', 'pending', 'confirmed', 'cancelled', 'completed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              statusFilter === s ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border hover:bg-gray-50'
            }`}
          >
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="loader"></div></div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div
                className="p-5 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded">
                        {b.booking_ref}
                      </span>
                      <StatusBadge status={b.status} />
                      <StatusBadge status={b.payment_status} />
                    </div>
                    <h4 className="font-semibold text-gray-800">{b.package_title}</h4>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span>👤 {b.full_name}</span>
                      <span>📅 {formatDate(b.travel_date)}</span>
                      <span>👥 {b.num_adults}A + {b.num_children}C</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-800">{formatPrice(b.total_price)}</p>
                    <p className="text-xs text-gray-400 mt-1">Booked: {formatDate(b.created_at)}</p>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === b.id && (
                <div className="border-t px-5 py-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Customer Info */}
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-3 text-sm">Customer Details</h5>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2"><FiMail className="text-gray-400" size={14} /> {b.email}</p>
                        <p className="flex items-center gap-2"><FiPhone className="text-gray-400" size={14} /> {b.phone}</p>
                        {b.special_requests && (
                          <div className="mt-3">
                            <p className="text-xs font-medium text-gray-500 mb-1">Special Requests:</p>
                            <p className="text-gray-600 bg-white p-2 rounded border text-xs">{b.special_requests}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Update Status */}
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-3 text-sm">Booking Status</h5>
                      <select
                        value={b.status}
                        onChange={(e) => updateStatus(b.id, 'status', e.target.value)}
                        className="input-field text-sm !py-2 mb-3"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>
                      <h5 className="font-semibold text-gray-700 mb-3 text-sm">Payment Status</h5>
                      <select
                        value={b.payment_status}
                        onChange={(e) => updateStatus(b.id, 'payment_status', e.target.value)}
                        className="input-field text-sm !py-2"
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                        <option value="paid">Paid</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h5 className="font-semibold text-gray-700 mb-3 text-sm">Quick Actions</h5>
                      <div className="space-y-2">
                        <a href={`mailto:${b.email}?subject=Re: Booking ${b.booking_ref}`} className="block w-full text-center py-2 border rounded-lg text-sm hover:bg-primary-50 hover:text-primary-600 transition">
                          📧 Send Email
                        </a>
                        <a href={`tel:${b.phone}`} className="block w-full text-center py-2 border rounded-lg text-sm hover:bg-green-50 hover:text-green-600 transition">
                          📞 Call Customer
                        </a>
                        <a href={`https://wa.me/${b.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2 border rounded-lg text-sm hover:bg-green-50 hover:text-green-600 transition">
                          💬 WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm text-center py-16">
          <p className="text-gray-400">No bookings found</p>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
