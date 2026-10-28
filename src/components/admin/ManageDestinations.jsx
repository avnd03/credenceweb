import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiStar, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { destinationsAPI } from '../../services/api';
import { getImageUrl, formatDate } from '../../utils/helpers';

const ManageDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await destinationsAPI.getAll();
      setDestinations(res.data.data);
    } catch (error) {
      toast.error('Failed to load destinations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? All packages under this destination will also be deleted!`)) return;
    try {
      await destinationsAPI.delete(id);
      toast.success('Destination deleted');
      fetchDestinations();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800">Destinations</h2>
          <p className="text-sm text-gray-500 mt-1">Manage travel destinations</p>
        </div>
        <Link to="/admin/destinations/create" className="btn-primary flex items-center gap-2 w-fit">
          <FiPlus size={18} /> Add Destination
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="loader"></div></div>
      ) : destinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div key={dest.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
              <div className="relative h-44">
                <img
                  src={getImageUrl(dest.image)}
                  alt={dest.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 right-3 flex gap-2">
                  {dest.featured && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">⭐ Featured</span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${dest.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {dest.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="text-lg font-heading font-bold">{dest.name}</h3>
                  <p className="text-sm text-white/80">{dest.country} • {dest.package_count || 0} packages</p>
                </div>
              </div>

              <div className="p-4">
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{dest.description || 'No description'}</p>
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className="text-xs text-gray-400">Slug: /{dest.slug}</span>
                  <div className="flex items-center gap-1">
                    <Link to={`/packages?destination=${dest.slug}`} target="_blank" className="p-2 hover:bg-gray-100 rounded-lg transition" title="View on site">
                      <FiEye size={15} className="text-gray-500" />
                    </Link>
                    <Link to={`/admin/destinations/edit/${dest.id}`} className="p-2 hover:bg-blue-50 rounded-lg transition" title="Edit">
                      <FiEdit2 size={15} className="text-blue-500" />
                    </Link>
                    <button onClick={() => handleDelete(dest.id, dest.name)} className="p-2 hover:bg-red-50 rounded-lg transition" title="Delete">
                      <FiTrash2 size={15} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm text-center py-16">
          <p className="text-gray-400 mb-4">No destinations yet</p>
          <Link to="/admin/destinations/create" className="btn-primary"><FiPlus className="inline mr-2" />Add Destination</Link>
        </div>
      )}
    </div>
  );
};

export default ManageDestinations;
