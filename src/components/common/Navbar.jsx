import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiChevronDown, FiPhone, FiMail } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isHome = location.pathname === '/';

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-800 text-white py-2 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <a href="tel:+919876543210" className="flex items-center space-x-1 hover:text-primary-200 transition">
              <FiPhone size={14} />
              <span>+91 98765 43210</span>
            </a>
            <a href="mailto:info@credenceholidays.com" className="flex items-center space-x-1 hover:text-primary-200 transition">
              <FiMail size={14} />
              <span>info@credenceholidays.com</span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <span>🌏 Your Trusted Travel Partner</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-white shadow-lg'
          : 'bg-white/95 backdrop-blur-sm shadow-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-hero-gradient rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl font-heading">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold font-heading text-gray-800 leading-tight">
                  Credence
                </h1>
                <p className="text-xs text-primary-600 font-medium -mt-1">HOLIDAYS</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavLink to="/" label="Home" />
              <NavLink to="/packages" label="Packages" />
              <NavLink to="/destinations" label="Destinations" />
              <NavLink to="/about" label="About Us" />
              <NavLink to="/contact" label="Contact" />
            </div>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <FiUser className="text-primary-600" />
                    </div>
                    <span className="font-medium">{user.first_name}</span>
                    <FiChevronDown size={16} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border py-2 z-50">
                      <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition">
                        My Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition">
                          Admin Dashboard
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition flex items-center space-x-2"
                      >
                        <FiLogOut />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium transition">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-sm !py-2.5 !px-5">
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-primary-600"
            >
              {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t shadow-xl">
            <div className="px-4 py-6 space-y-4">
              <MobileNavLink to="/" label="Home" />
              <MobileNavLink to="/packages" label="Packages" />
              <MobileNavLink to="/destinations" label="Destinations" />
              <MobileNavLink to="/about" label="About Us" />
              <MobileNavLink to="/contact" label="Contact" />
              <hr />
              {user ? (
                <>
                  <MobileNavLink to="/profile" label="My Profile" />
                  {user.role === 'admin' && <MobileNavLink to="/admin" label="Admin Dashboard" />}
                  <button onClick={handleLogout} className="w-full text-left py-2 text-red-600 font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex space-x-3">
                  <Link to="/login" className="btn-secondary flex-1 text-center !py-2.5">Login</Link>
                  <Link to="/register" className="btn-primary flex-1 text-center !py-2.5">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

const NavLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`font-medium transition-colors duration-200 relative py-2 ${
        isActive
          ? 'text-primary-600'
          : 'text-gray-700 hover:text-primary-600'
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full" />
      )}
    </Link>
  );
};

const MobileNavLink = ({ to, label }) => (
  <Link to={to} className="block py-2 text-gray-700 hover:text-primary-600 font-medium transition">
    {label}
  </Link>
);

export default Navbar;
