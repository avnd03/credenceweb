import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiImage, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { destinationsAPI } from '../../services/api';
import { getImageUrl } from '../../utils/helpers';

const DestinationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    country: '',
    description: '',
    featured: false,
    is_active: true,
  });

  useEffect(() => {
    if (isEditing) fetchDestination();
  }, [id]);

  const fetchDestination = async () => {
    setFetching(true);
    try {
      const res = await destinationsAPI.getAll();
      const dest = res.data.data.find(d => d.id === parseInt(id));
      if (!dest) { toast.error('Destination not found'); navigate('/admin/destinations'); return; }

      setFormData({
        name: dest.name || '',
        country: dest.country || '',
        description: dest.description || '',
        featured: dest.featured || false,
        is_active: dest.is_active !== undefined ? dest.is_active : true,
      });
      if (dest.image) setImagePreview(getImageUrl(dest.image));
    } catch (error) {
      toast.error('Failed to load destination');
      navigate('/admin/destinations');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error('Name is required'); return; }
    if (!formData.country.trim()) { toast.error('Country is required'); return; }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => data.append(key, val));
      if (imageFile) data.append('image', imageFile);

      if (isEditing) {
        await destinationsAPI.update(id, data);
        toast.success('Destination updated!');
      } else {
        await destinationsAPI.create(data);
        toast.success('Destination created!');
      }
      navigate('/admin/destinations');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="loader"></div></div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/destinations')} className="p-2 hover:bg-gray-100 rounded-lg">
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-heading font-bold">{isEditing ? 'Edit Destination' : 'Add Destination'}</h2>
          <p className="text-sm text-gray-500 mt-1">Fill in destination details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., Goa" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
            <input type="text" name="country" value={formData.country} onChange={handleChange} required placeholder="e.g., India" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Describe the destination..." className="input-field resize-none" />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination Image</label>
            <div className="flex items-start gap-4">
              {imagePreview && (
                <div className="relative w-40 h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full">
                    <FiTrash2 size={10} />
                  </button>
                </div>
              )}
              <label className="flex flex-col items-center justify-center flex-1 h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-500 transition">
                <FiImage className="text-gray-400 mb-1" size={20} />
                <span className="text-xs text-gray-500">Upload Image</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded" />
              <span className="text-sm font-medium text-gray-700">⭐ Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded" />
              <span className="text-sm font-medium text-gray-700">✅ Active</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button type="button" onClick={() => navigate('/admin/destinations')} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            <FiSave size={18} />
            <span>{loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default DestinationForm;
