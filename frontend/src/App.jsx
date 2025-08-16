


import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SkeletonLoader from './components/ui/SkeletonLoader';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { useOnlineStatus } from './hooks/useOnlineStatus';

// lazy pages
const Home = React.lazy(() => import('./pages/Home'));
const Browse = React.lazy(() => import('./pages/Browse'));
const ServiceDetails = React.lazy(() => import('./pages/ServiceDetails'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));

function ProtectedRoute({ children, roles }) {
  const auth = useSelector((s) => s.auth);
  if (!auth?.token) return <Navigate to="/login" replace />;
  if (roles && roles.length && !roles.includes(auth.user?.role)) return <Navigate to="/" replace />;
  return children;
}

const  App=()=> {
  const online = useOnlineStatus();

  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Navbar />
      {!online && (
        <div className="bg-yellow-300 text-black p-2 text-center">You are offline — some features may be unavailable</div>
      )}
      <main id="content" className="flex-1 container mx-auto px-4 py-6">
        <Suspense fallback={<SkeletonLoader />}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/service/:id" element={<ServiceDetails />} />
                <Route path="/checkout/:id" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App