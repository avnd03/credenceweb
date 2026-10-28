import React, { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { newsletterAPI } from '../../services/api';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await newsletterAPI.subscribe({ email });
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-accent-500 to-pink-500 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
          Get Exclusive Travel Deals
        </h2>
        <p className="text-white/90 mb-8 max-w-xl mx-auto">
          Subscribe to our newsletter and be the first to know about special offers,
          new destinations, and travel tips.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-6 py-4 rounded-xl text-gray-800 outline-none focus:ring-4 focus:ring-white/30 transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white px-8 py-4 rounded-xl font-medium
                       hover:bg-gray-800 transition-all duration-300 flex items-center
                       justify-center space-x-2 disabled:opacity-50"
          >
            <FiSend />
            <span>{loading ? 'Subscribing...' : 'Subscribe'}</span>
          </button>
        </form>

        <p className="text-white/70 text-sm mt-4">
          No spam, unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
