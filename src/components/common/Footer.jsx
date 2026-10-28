import React from 'react';
import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-hero-gradient rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl font-heading">C</span>
              </div>
              <div>
                <h3 className="text-xl font-bold font-heading text-white">Credence</h3>
                <p className="text-xs text-primary-400 font-medium -mt-1">HOLIDAYS</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Your trusted travel partner since 2010. We craft unforgettable holiday experiences
              across the globe with personalized service and unbeatable value.
            </p>
            <div className="flex space-x-4">
              <SocialIcon icon={<FiFacebook />} href="https://facebook.com/credenceholidays" />
              <SocialIcon icon={<FiInstagram />} href="https://instagram.com/credenceholidays" />
              <SocialIcon icon={<FiTwitter />} href="https://twitter.com/credenceholidays" />
              <SocialIcon icon={<FiYoutube />} href="https://youtube.com/credenceholidays" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-heading font-semibold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <FooterLink to="/" label="Home" />
              <FooterLink to="/packages" label="Tour Packages" />
              <FooterLink to="/destinations" label="Destinations" />
              <FooterLink to="/about" label="About Us" />
              <FooterLink to="/contact" label="Contact Us" />
            </ul>
          </div>

          {/* Tour Types */}
          <div>
            <h4 className="text-white font-heading font-semibold text-lg mb-6">Tour Types</h4>
            <ul className="space-y-3">
              <FooterLink to="/packages?type=domestic" label="Domestic Tours" />
              <FooterLink to="/packages?type=international" label="International Tours" />
              <FooterLink to="/packages?type=honeymoon" label="Honeymoon Packages" />
              <FooterLink to="/packages?type=adventure" label="Adventure Tours" />
              <FooterLink to="/packages?type=family" label="Family Holidays" />
              <FooterLink to="/packages?type=pilgrimage" label="Pilgrimage Tours" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-heading font-semibold text-lg mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <FiMapPin className="text-primary-400 mt-1 flex-shrink-0" size={18} />
                <p className="text-sm">
                  123, Travel House, MG Road,<br />
                  Mumbai, Maharashtra 400001
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="text-primary-400 flex-shrink-0" size={18} />
                <div>
                  <a href="tel:+919876543210" className="text-sm hover:text-primary-400 transition">
                    +91 98765 43210
                  </a>
                  <br />
                  <a href="tel:+912212345678" className="text-sm hover:text-primary-400 transition">
                    +91 22 1234 5678
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="text-primary-400 flex-shrink-0" size={18} />
                <a href="mailto:info@credenceholidays.com" className="text-sm hover:text-primary-400 transition">
                  info@credenceholidays.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Credence Holidays. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary-400 transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-primary-400 transition">
              Terms & Conditions
            </Link>
            <Link to="/refund" className="text-sm text-gray-500 hover:text-primary-400 transition">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, label }) => (
  <li>
    <Link to={to} className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-200">
      {label}
    </Link>
  </li>
);

const SocialIcon = ({ icon, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors duration-300"
  >
    {icon}
  </a>
);

export default Footer;
