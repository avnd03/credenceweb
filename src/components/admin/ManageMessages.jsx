import React, { useState, useEffect } from 'react';
import { FiMail, FiTrash2, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { contactAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await contactAPI.getMessages();
      setMessages(res.data.data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await contactAPI.markAsRead(id);
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleExpand = (msg) => {
    if (expandedId === msg.id) {
      setExpandedId(null);
    } else {
      setExpandedId(msg.id);
      if (!msg.is_read) markAsRead(msg.id);
    }
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800">Contact Messages</h2>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">{unreadCount} New</span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="loader"></div></div>
      ) : messages.length > 0 ? (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`bg-white rounded-xl shadow-sm overflow-hidden transition ${!msg.is_read ? 'border-l-4 border-primary-500' : ''}`}>
              <div className="p-5 cursor-pointer hover:bg-gray-50 transition" onClick={() => toggleExpand(msg)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {msg.is_read ? <FiMail className="text-gray-400" size={18} /> : <FiMail className="text-primary-500" size={18} />}
                    </div>
                    <div>
                      <h4 className={`font-medium ${msg.is_read ? 'text-gray-600' : 'text-gray-800 font-semibold'}`}>{msg.subject}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {msg.name} • {msg.email}
                        {msg.phone && ` • ${msg.phone}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{formatDate(msg.created_at)}</span>
                </div>
              </div>

              {expandedId === msg.id && (
                <div className="border-t px-5 py-4 bg-gray-50">
                  <p className="text-gray-700 text-sm whitespace-pre-line mb-4">{msg.message}</p>
                  <div className="flex gap-3">
                    <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition">
                      📧 Reply via Email
                    </a>
                    {msg.phone && (
                      <a href={`tel:${msg.phone}`} className="flex items-center gap-2 px-4 py-2 border text-sm rounded-lg hover:bg-gray-100 transition">
                        📞 Call
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm text-center py-16">
          <FiMail className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-400">No messages yet</p>
        </div>
      )}
    </div>
  );
};

export default ManageMessages;
