import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | Credence Holidays</title>
      </Helmet>

      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-lg">
          <div className="text-8xl mb-6">🌍</div>
          <h1 className="text-6xl font-heading font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-heading font-semibold text-gray-600 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-500 mb-8">
            Looks like this destination doesn't exist on our map.
            Let us help you find the right path to your dream holiday!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary">
              Go to Homepage
            </Link>
            <Link to="/packages" className="btn-secondary">
              Browse Packages
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
