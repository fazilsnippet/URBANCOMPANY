import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import FullscreenSpinner from '../components/common/FullscreenSpinner';

export default function PrivateRoute({ roles = [], children }) {
  const { user, status } = useSelector((s) => s.auth);
  const location = useLocation();

  if (status === 'loading') return <FullscreenSpinner />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}