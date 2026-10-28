import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loader from './components/common/Loader';
import ScrollToTop from './components/common/ScrollToTop';
import { useAuth } from './context/AuthContext';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const PackagesPage = lazy(() => import('./pages/PackagesPage'));
const PackageDetailPage = lazy(() => import('./pages/PackageDetailPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const DestinationsPage = lazy(() => import('./pages/DestinationsPage'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const LoginPage = lazy(() => import('./components/auth/Login'));
const RegisterPage = lazy(() => import('./components/auth/Register'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) {
    window.location.href = '/login';
    return null;
  }
  if (adminOnly && user.role !== 'admin') {
    window.location.href = '/';
    return null;
  }
  return children;
};

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/packages/:slug" element={<PackageDetailPage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/booking/:packageId" element={<BookingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/admin/*" element={
              <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
