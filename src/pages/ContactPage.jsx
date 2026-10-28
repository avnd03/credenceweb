import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { contactAPI } from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await contactAPI.submit(formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Credence Holidays</title>
        <meta name="description" content="Get in touch with Credence Holidays for tour bookings, inquiries, and support." />
      </Helmet>

      {/* Hero */}
      <div className="relative h-64 md:h-80 bg-hero-gradient flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920"
            alt="Contact Us"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">Contact Us</h1>
          <p className="text-xl text-white/80">We'd love to hear from you</p>
        </div>
      </div>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold mb-8">Get in Touch</h2>

              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-primary-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Our Office</h4>
                  <p className="text-gray-600 text-sm">
                    123, Travel House, MG Road,<br />
                    Mumbai, Maharashtra 400001
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiPhone className="text-primary-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Phone</h4>
                  <p className="text-gray-600 text-sm">
                    <a href="tel:+919876543210" className="hover:text-primary-600">+91 98765 43210</a><br />
                    <a href="tel:+912212345678" className="hover:text-primary-600">+91 22 1234 5678</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-primary-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-gray-600 text-sm">
                    <a href="mailto:info@credenceholidays.com" className="hover:text-primary-600">info@credenceholidays.com</a><br />
                    <a href="mailto:bookings@credenceholidays.com" className="hover:text-primary-600">bookings@credenceholidays.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiClock className="text-primary-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Working Hours</h4>
                  <p className="text-gray-600 text-sm">
                    Mon - Sat: 9:00 AM - 7:00 PM<br />
                    Sunday: 10:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-8 border">
                <h2 className="text-2xl font-heading font-bold mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help?"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder="Tell us about your travel plans..."
                      className="input-field resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                  >
                    <FiSend />
                    <span>{loading ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-16 rounded-2xl overflow-hidden shadow-lg h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.14571459073!2d72.74109999999999!3d19.082502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Credence Holidays Location"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
