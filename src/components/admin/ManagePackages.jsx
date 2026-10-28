import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiSearch, FiStar, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { packagesAPI } from '../../services/api';
import { formatPrice, formatDate, getImageUrl } from '../../utils/helpers';

const ManagePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchPackages();
  }, [page, filterType]);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filterType) params.tour_type = filterType;
      if (search) params.search = search;
      const res = await packagesAPI.getAll(params);
      setPackages(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPackages();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? This will delete the package and all related data.')) return;
    try {
      await packagesAPI.delete(id);
      toast.success('Package deleted successfully');
      fetchPackages();
    } catch (error) {
      toast.error('Failed to delete package');
    }
  };

  const toggleActive = async (pkg) => {
    try {
      const formData = new FormData();
      Object.entries(pkg).forEach(([key, val]) => {
        if (key !== 'main_image' && key !== 'destination_name' && key !== 'destination_slug' && key !== 'country' && val !== null) {
          formData.append(key, key === 'is_active' ? 1 : 0);
        }
      });
      await packagesAPI.update(pkg.id, formData);
      toast.success(`Package ${pkg.is_active ? 'deactivated' : 'activated'}`);
      fetchPackages();
    } catch (error) {
      toast.error('Failed to update package');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800">Tour Packages</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all tour packages and itineraries</p>
        </div>
        <Link to="/admin/packages/create" className="btn-primary flex items-center gap-2 w-fit">
          <FiPlus size={18} />
          <span>Add Package</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search packages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field !pl-10 !py-2.5 text-sm"
            />
          </form>
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
            className="input-field !py-2.5 text-sm !w-auto min-w-[160px]"
          >
            <option value="">All Types</option>
            <option value="domestic">Domestic</option>
            <option value="international">International</option>
            <option value="adventure">Adventure</option>
            <option value="honeymoon">Honeymoon</option>
            <option value="family">Family</option>
            <option value="pilgrimage">Pilgrimage</option>
            <option value="cruise">Cruise</option>
            <option value="wildlife">Wildlife</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="loader"></div></div>
        ) : packages.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Package</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Destination</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Duration</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Price</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Featured</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Active</th>
                    <th className="px-4 py-3 text-left font-medium text-gray-500">Created</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={getImageUrl(pkg.main_image)}
                            alt={pkg.title}
                            className="w-14 h-10 rounded-lg object-cover bg-gray-100"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100'; }}
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate max-w-[200px]">{pkg.title}</p>
                            <p className="text-xs text-gray-400">ID: {pkg.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{pkg.destination_name}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs rounded-full capitalize font-medium">
                          {pkg.tour_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{pkg.duration_nights}N/{pkg.duration_days}D</td>
                      <td className="px-4 py-3">
                        {pkg.discount_price ? (
                          <div>
                            <p className="font-semibold text-gray-800">{formatPrice(pkg.discount_price)}</p>
                            <p className="text-xs text-gray-400 line-through">{formatPrice(pkg.price)}</p>
                          </div>
                        ) : (
                          <p className="font-semibold text-gray-800">{formatPrice(pkg.price)}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {pkg.featured ? <FiStar className="text-yellow-500 fill-yellow-500" /> : <FiStar className="text-gray-300" />}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(pkg)} className="transition">
                          {pkg.is_active
                            ? <FiToggleRight className="text-green-500" size={24} />
                            : <FiToggleLeft className="text-gray-400" size={24} />
                          }
                        </button>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{formatDate(pkg.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/packages/${pkg.slug}`} target="_blank" className="p-2 hover:bg-gray-100 rounded-lg transition" title="View">
                            <FiEye size={16} className="text-gray-500" />
                          </Link>
                          <Link to={`/admin/packages/edit/${pkg.id}`} className="p-2 hover:bg-blue-50 rounded-lg transition" title="Edit">
                            <FiEdit2 size={16} className="text-blue-500" />
                          </Link>
                          <button onClick={() => handleDelete(pkg.id)} className="p-2 hover:bg-red-50 rounded-lg transition" title="Delete">
                            <FiTrash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.pages} • {pagination.total} total
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(5, pagination.pages))].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-9 h-9 text-sm rounded-lg ${page === i + 1 ? 'bg-primary-600 text-white' : 'border hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                    disabled={page === pagination.pages}
                    className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <FiPackage className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No packages found</h3>
            <p className="text-gray-400 mb-6">Get started by creating your first tour package</p>
            <Link to="/admin/packages/create" className="btn-primary">
              <FiPlus className="inline mr-2" />Create Package
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePackages;
