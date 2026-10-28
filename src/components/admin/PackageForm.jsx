import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiArrowLeft, FiPlus, FiTrash2, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { packagesAPI, destinationsAPI } from '../../services/api';
import { getImageUrl, tourTypes } from '../../utils/helpers';

const PackageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [destinations, setDestinations] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    destination_id: '',
    description: '',
    short_description: '',
    duration_days: '',
    duration_nights: '',
    max_people: 20,
    min_age: 0,
    price: '',
    discount_price: '',
    tour_type: 'domestic',
    difficulty: 'easy',
    featured: false,
    best_season: '',
    inclusions: '',
    exclusions: '',
    is_active: true,
  });

  const [itinerary, setItinerary] = useState([]);

  useEffect(() => {
    fetchDestinations();
    if (isEditing) fetchPackage();
  }, [id]);

  const fetchDestinations = async () => {
    try {
      const res = await destinationsAPI.getAll();
      setDestinations(res.data.data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const fetchPackage = async () => {
    setFetching(true);
    try {
      // Need to get package by ID — fetch all and find
      const res = await packagesAPI.getAll({ limit: 999 });
      const pkg = res.data.data.find(p => p.id === parseInt(id));
      if (!pkg) { toast.error('Package not found'); navigate('/admin/packages'); return; }

      // Get full package with itinerary
      const detailRes = await packagesAPI.getBySlug(pkg.slug);
      const detail = detailRes.data.data;

      setFormData({
        title: detail.title || '',
        destination_id: detail.destination_id || '',
        description: detail.description || '',
        short_description: detail.short_description || '',
        duration_days: detail.duration_days || '',
        duration_nights: detail.duration_nights || '',
        max_people: detail.max_people || 20,
        min_age: detail.min_age || 0,
        price: detail.price || '',
        discount_price: detail.discount_price || '',
        tour_type: detail.tour_type || 'domestic',
        difficulty: detail.difficulty || 'easy',
        featured: detail.featured || false,
        best_season: detail.best_season || '',
        inclusions: detail.inclusions || '',
        exclusions: detail.exclusions || '',
        is_active: detail.is_active !== undefined ? detail.is_active : true,
      });

      if (detail.main_image) setImagePreview(getImageUrl(detail.main_image));
      if (detail.itinerary && detail.itinerary.length > 0) {
        setItinerary(detail.itinerary.map(d => ({
          day_number: d.day_number,
          title: d.title,
          description: d.description,
          meals: d.meals || '',
          accommodation: d.accommodation || '',
        })));
      }
    } catch (error) {
      toast.error('Failed to load package');
      navigate('/admin/packages');
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

  // --- Itinerary Management ---
  const addDay = () => {
    setItinerary(prev => ([
      ...prev,
      {
        day_number: prev.length + 1,
        title: '',
        description: '',
        meals: '',
        accommodation: '',
      }
    ]));
  };

  const updateDay = (index, field, value) => {
    setItinerary(prev => prev.map((day, i) =>
      i === index ? { ...day, [field]: value } : day
    ));
  };

  const removeDay = (index) => {
    setItinerary(prev =>
      prev.filter((_, i) => i !== index)
        .map((day, i) => ({ ...day, day_number: i + 1 }))
    );
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) { toast.error('Title is required'); return; }
    if (!formData.destination_id) { toast.error('Select a destination'); return; }
    if (!formData.price) { toast.error('Price is required'); return; }
    if (!formData.duration_days || !formData.duration_nights) { toast.error('Duration is required'); return; }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== '') {
          data.append(key, val);
        }
      });

      if (imageFile) data.append('main_image', imageFile);
      if (itinerary.length > 0) data.append('itinerary', JSON.stringify(itinerary));

      if (isEditing) {
        await packagesAPI.update(id, data);
        toast.success('Package updated successfully!');
      } else {
        await packagesAPI.create(data);
        toast.success('Package created successfully!');
      }
      navigate('/admin/packages');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center py-20"><div className="loader"></div></div>;

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin/packages')} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <FiArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800">
            {isEditing ? 'Edit Package' : 'Create New Package'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isEditing ? 'Update package details and itinerary' : 'Fill in the details to create a new tour package'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">📋 Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Package Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g., Magical Goa Beach Holiday" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination *</label>
              <select name="destination_id" value={formData.destination_id} onChange={handleChange} required className="input-field">
                <option value="">Select Destination</option>
                {destinations.map(d => <option key={d.id} value={d.id}>{d.name} ({d.country})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tour Type *</label>
              <select name="tour_type" value={formData.tour_type} onChange={handleChange} className="input-field">
                {tourTypes.map(t => <option key={t.value} value={t.value}>{t.icon} {t.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Nights) *</label>
              <input type="number" name="duration_nights" value={formData.duration_nights} onChange={handleChange} required min="1" placeholder="4" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days) *</label>
              <input type="number" name="duration_days" value={formData.duration_days} onChange={handleChange} required min="1" placeholder="5" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" placeholder="15999" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price (₹)</label>
              <input type="number" name="discount_price" value={formData.discount_price} onChange={handleChange} min="0" step="0.01" placeholder="12999" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max People</label>
              <input type="number" name="max_people" value={formData.max_people} onChange={handleChange} min="1" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Age</label>
              <input type="number" name="min_age" value={formData.min_age} onChange={handleChange} min="0" className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="input-field">
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Best Season</label>
              <input type="text" name="best_season" value={formData.best_season} onChange={handleChange} placeholder="October - March" className="input-field" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
              <input type="text" name="short_description" value={formData.short_description} onChange={handleChange} placeholder="Brief summary for cards (max 200 chars)" maxLength={500} className="input-field" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="5" placeholder="Detailed package description..." className="input-field resize-none" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Inclusions</label>
              <textarea name="inclusions" value={formData.inclusions} onChange={handleChange} rows="3" placeholder="Comma separated: Hotel, Breakfast, Transfers" className="input-field resize-none" />
              <p className="text-xs text-gray-400 mt-1">Separate items with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Exclusions</label>
              <textarea name="exclusions" value={formData.exclusions} onChange={handleChange} rows="3" placeholder="Comma separated: Flights, Lunch, Personal expenses" className="input-field resize-none" />
              <p className="text-xs text-gray-400 mt-1">Separate items with commas</p>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded" />
                <span className="text-sm font-medium text-gray-700">⭐ Featured Package</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded" />
                <span className="text-sm font-medium text-gray-700">✅ Active</span>
              </label>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 pb-3 border-b">🖼️ Main Image</h3>

          <div className="flex items-start gap-6">
            {imagePreview && (
              <div className="relative w-48 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setImageFile(null); }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            )}
            <div className="flex-1">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50/50 transition">
                <FiImage size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Click to upload image</span>
                <span className="text-xs text-gray-400">JPG, PNG, WebP (Max 5MB)</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Itinerary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-3 border-b">
            <h3 className="text-lg font-semibold text-gray-800">📅 Day-wise Itinerary</h3>
            <button type="button" onClick={addDay} className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition text-sm font-medium">
              <FiPlus size={16} /> Add Day
            </button>
          </div>

          {itinerary.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-400 mb-4">No itinerary days added yet</p>
              <button type="button" onClick={addDay} className="btn-primary text-sm !py-2 !px-4">
                <FiPlus className="inline mr-1" /> Add First Day
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {itinerary.map((day, index) => (
                <div key={index} className="border rounded-xl p-5 bg-gray-50 relative group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {day.day_number}
                      </span>
                      <h4 className="font-semibold text-gray-700">Day {day.day_number}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDay(index)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition opacity-0 group-hover:opacity-100"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Day Title *</label>
                      <input
                        type="text"
                        value={day.title}
                        onChange={(e) => updateDay(index, 'title', e.target.value)}
                        placeholder="e.g., Arrival in Goa"
                        className="input-field text-sm !py-2"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description *</label>
                      <textarea
                        value={day.description}
                        onChange={(e) => updateDay(index, 'description', e.target.value)}
                        placeholder="Describe the day's activities..."
                        rows="3"
                        className="input-field text-sm !py-2 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Meals</label>
                      <input
                        type="text"
                        value={day.meals}
                        onChange={(e) => updateDay(index, 'meals', e.target.value)}
                        placeholder="e.g., Breakfast, Dinner"
                        className="input-field text-sm !py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Accommodation</label>
                      <input
                        type="text"
                        value={day.accommodation}
                        onChange={(e) => updateDay(index, 'accommodation', e.target.value)}
                        placeholder="e.g., Beach Resort"
                        className="input-field text-sm !py-2"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button type="button" onClick={addDay} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary-500 hover:text-primary-600 transition text-sm font-medium">
                <FiPlus className="inline mr-1" /> Add Another Day
              </button>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm p-6">
          <button type="button" onClick={() => navigate('/admin/packages')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            <FiSave size={18} />
            <span>{loading ? 'Saving...' : isEditing ? 'Update Package' : 'Create Package'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PackageForm;
