import React, { useState, useEffect } from 'react';
import { FiUsers, FiSearch, FiMail, FiPhone, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await authAPI.getAllUsers();
      setUsers(res.data.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.first_name.toLowerCase().includes(search.toLowerCase()) ||
    u.last_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-gray-800">Users</h2>
        <p className="text-sm text-gray-500 mt-1">All registered users ({users.length} total)</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field !pl-10 !py-2.5 text-sm" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="loader"></div></div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">User</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Phone</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Role</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-500">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                          {u.first_name[0]}{u.last_name[0]}
                        </div>
                        <span className="font-medium text-gray-800">{u.first_name} {u.last_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 text-gray-600">{u.phone || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {u.role === 'admin' && <FiShield className="inline mr-1" size={12} />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">{formatDate(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-400">No users found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
