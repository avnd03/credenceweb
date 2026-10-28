import React, { useState, useEffect } from 'react';
import { FiMail, FiDownload, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { newsletterAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const ManageNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await newsletterAPI.getSubscribers();
      setSubscribers(res.data.data);
    } catch (error) {
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async (email) => {
    if (!window.confirm(`Remove ${email} from newsletter?`)) return;
    try {
      await newsletterAPI.unsubscribe({ email });
      toast.success('Subscriber removed');
      fetchSubscribers();
    } catch (error) {
      toast.error('Failed to remove');
    }
  };

  const exportCSV = () => {
    const activeSubscribers = subscribers.filter(s => s.is_active);
    const csv = 'Email,Subscribed Date\n' + activeSubscribers.map(s => `${s.email},${s.subscribed_at}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'credence_newsletter_subscribers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  const activeCount = subscribers.filter(s => s.is_active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800">Newsletter Subscribers</h2>
          <p className="text-sm text-gray-500 mt-1">{activeCount} active subscribers</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium w-fit">
          <FiDownload size={16} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="loader"></div></div>
      ) : subscribers.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">#</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Subscribed</th>
                  <th className="px-6 py-3 text-right font-medium text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subscribers.map((s, i) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-400">{i + 1}</td>
                    <td className="px-6 py-3">
                      <span className="flex items-center gap-2">
                        <FiMail className="text-gray-400" size={14} />
                        {s.email}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {s.is_active ? 'Active' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500 text-xs">{formatDate(s.subscribed_at)}</td>
                    <td className="px-6 py-3 text-right">
                      {s.is_active && (
                        <button onClick={() => handleUnsubscribe(s.email)} className="p-2 hover:bg-red-50 rounded-lg transition" title="Unsubscribe">
                          <FiTrash2 className="text-red-500" size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm text-center py-16">
          <FiMail className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-400">No subscribers yet</p>
        </div>
      )}
    </div>
  );
};

export default ManageNewsletter;
