import React, { useState, useEffect } from 'react';
import { FiStar, FiCheck, FiX, FiTrash2, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { testimonialsAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, approved

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await testimonialsAPI.getAll();
      setTestimonials(res.data.data);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, approve) => {
    try {
      await testimonialsAPI.approve(id, { is_approved: approve, featured: false });
      toast.success(approve ? 'Testimonial approved' : 'Testimonial rejected');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const toggleFeatured = async (t) => {
    try {
      await testimonialsAPI.approve(t.id, { is_approved: t.is_approved, featured: !t.featured });
      toast.success(t.featured ? 'Removed from featured' : 'Added to featured');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await testimonialsAPI.delete(id);
      toast.success('Deleted');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'pending') return !t.is_approved;
    if (filter === 'approved') return t.is_approved;
    return true;
  });

  const pendingCount = testimonials.filter(t => !t.is_approved).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-gray-800">Testimonials</h2>
        <p className="text-sm text-gray-500 mt-1">Manage customer reviews and testimonials</p>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
          All ({testimonials.length})
        </button>
        <button onClick={() => setFilter('pending')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
          Pending ({pendingCount})
        </button>
        <button onClick={() => setFilter('approved')} className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}>
          Approved ({testimonials.length - pendingCount})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="loader"></div></div>
      ) : filteredTestimonials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTestimonials.map((t) => (
            <div key={t.id} className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${t.is_approved ? 'border-green-500' : 'border-yellow-500'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.location || 'Location N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={14} className={i < t.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} />
                  ))}
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 italic">"{t.review}"</p>

              {t.package_title && (
                <p className="text-xs text-gray-400 mb-4">📦 {t.package_title}</p>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {t.is_approved ? '✅ Approved' : '⏳ Pending'}
                  </span>
                  {t.featured && <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">⭐ Featured</span>}
                </div>

                <div className="flex items-center gap-1">
                  {!t.is_approved && (
                    <button onClick={() => handleApprove(t.id, true)} className="p-2 hover:bg-green-50 rounded-lg transition" title="Approve">
                      <FiCheck className="text-green-500" size={16} />
                    </button>
                  )}
                  {t.is_approved && (
                    <>
                      <button onClick={() => toggleFeatured(t)} className="p-2 hover:bg-yellow-50 rounded-lg transition" title={t.featured ? 'Remove from featured' : 'Make featured'}>
                        <FiStar className={t.featured ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'} size={16} />
                      </button>
                      <button onClick={() => handleApprove(t.id, false)} className="p-2 hover:bg-orange-50 rounded-lg transition" title="Unapprove">
                        <FiX className="text-orange-500" size={16} />
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(t.id)} className="p-2 hover:bg-red-50 rounded-lg transition" title="Delete">
                    <FiTrash2 className="text-red-500" size={16} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-3">{formatDate(t.created_at)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm text-center py-16">
          <FiStar className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-400">No testimonials found</p>
        </div>
      )}
    </div>
  );
};

export default ManageTestimonials;
