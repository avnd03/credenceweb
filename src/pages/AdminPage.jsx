import React, { useState } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  FiHome, FiPackage, FiCalendar, FiUsers, FiMessageSquare,
  FiStar, FiMapPin, FiMenu, FiX, FiMail, FiSettings, FiLogOut
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// Import Admin Components
import AdminDashboard from '../components/admin/AdminDashboard';
import ManagePackages from '../components/admin/ManagePackages';
import PackageForm from '../components/admin/PackageForm';
import ManageDestinations from '../components/admin/ManageDestinations';
import DestinationForm from '../components/admin/DestinationForm';
import ManageBookings from '../components/admin/ManageBookings';
import ManageUsers from '../components/admin/ManageUsers';
import ManageTestimonials from '../components/admin/ManageTestimonials';
import ManageMessages from '../components/admin/ManageMessages';
import ManageNewsletter from '../components/admin/ManageNewsletter';

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/admin', icon: <FiHome size={18} />, label: 'Dashboard', exact: true },
    { path: '/admin/packages', icon: <FiPackage size={18} />, label: 'Packages' },
    { path: '/admin/destinations', icon: <FiMapPin size={18} />, label: 'Destinations' },
    { path: '/admin/bookings', icon: <FiCalendar size={18} />, label: 'Bookings' },
    { path: '/admin/users', icon: <FiUsers size={18} />, label: 'Users' },
    { path: '/admin/testimonials', icon: <FiStar size={18} />, label: 'Testimonials' },
    { path: '/admin/messages', icon: <FiMessageSquare size={18} />, label: 'Messages' },
    { path: '/admin/newsletter', icon: <FiMail size={18} />, label: 'Newsletter' },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Credence Holidays</title>
      </Helmet>

      <div className="flex bg-gray-100 min-h-screen -mt-0">
        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gray-900 text-white transform transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold font-heading">C</span>
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg">Admin Panel</h2>
                  <p className="text-xs text-gray-400">Credence Holidays</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">Main</p>
            {menuItems.slice(0, 1).map((item) => (
              <SidebarLink key={item.path} item={item} isActive={isActive(item.path, item.exact)} onClick={() => setSidebarOpen(false)} />
            ))}

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mt-6 mb-3">Content</p>
            {menuItems.slice(1, 3).map((item) => (
              <SidebarLink key={item.path} item={item} isActive={isActive(item.path)} onClick={() => setSidebarOpen(false)} />
            ))}

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mt-6 mb-3">Management</p>
            {menuItems.slice(3).map((item) => (
              <SidebarLink key={item.path} item={item} isActive={isActive(item.path)} onClick={() => setSidebarOpen(false)} />
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3 px-4 py-3">
              <div className="w-9 h-9 bg-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition mt-2 text-sm"
            >
              <FiLogOut size={16} />
              <span>Back to Website</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="bg-white shadow-sm sticky top-0 z-30">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                  <FiMenu size={22} />
                </button>
                <h1 className="text-xl font-heading font-semibold text-gray-800">
                  {menuItems.find(m => isActive(m.path, m.exact))?.label || 'Admin'}
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <Link to="/" className="text-sm text-gray-500 hover:text-primary-600 transition">
                  View Site →
                </Link>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            <Routes>
              <Route index element={<AdminDashboard />} />
              <Route path="packages" element={<ManagePackages />} />
              <Route path="packages/create" element={<PackageForm />} />
              <Route path="packages/edit/:id" element={<PackageForm />} />
              <Route path="destinations" element={<ManageDestinations />} />
              <Route path="destinations/create" element={<DestinationForm />} />
              <Route path="destinations/edit/:id" element={<DestinationForm />} />
              <Route path="bookings" element={<ManageBookings />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="testimonials" element={<ManageTestimonials />} />
              <Route path="messages" element={<ManageMessages />} />
              <Route path="newsletter" element={<ManageNewsletter />} />
              <Route path="*" element={<Navigate to="/admin" />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
};

const SidebarLink = ({ item, isActive, onClick }) => (
  <Link
    to={item.path}
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
      isActive
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
        : 'text-gray-400 hover:text-white hover:bg-gray-800'
    }`}
  >
    {item.icon}
    <span className="font-medium">{item.label}</span>
  </Link>
);

export default AdminPage;
