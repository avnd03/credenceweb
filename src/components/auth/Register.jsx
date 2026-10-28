import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.register(formData);
      login(res.data.data);
      toast.success('Registration successful! Welcome to Credence Holidays!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Register - Credence Holidays</title>
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-hero-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl font-heading">C</span>
              </div>
              <h1 className="text-2xl font-heading font-bold text-gray-800">Create Account</h1>
              <p className="text-gray-500 mt-1">Join Credence Holidays today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required placeholder="First Name" className="input-field !pl-10 !py-2.5 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required placeholder="Last Name" className="input-field !py-2.5 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className="input-field !pl-10 !py-2.5 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" className="input-field !pl-10 !py-2.5 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required placeholder="Min 6 characters" className="input-field !pl-10 !pr-10 !py-2.5 text-sm" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirm password" className="input-field !pl-10 !py-2.5 text-sm" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-gray-500 mt-6 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
