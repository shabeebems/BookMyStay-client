import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  role: string;
}

const PublicRouteWrapper: React.FC = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Outlet />;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    console.log(decoded);
    // If token exists, redirect to their dashboard
    switch (decoded.role) {
      case 'admin':
        return <Navigate to="/admin-dashboard" replace />;
      case 'owner':
        return <Navigate to="/owner-dashboard" replace />;
      case 'user':
        return <Navigate to="/" replace />;
      default:
        return <Navigate to="/login/user" replace />;
    }
  } catch (err) {
    console.error('Invalid Token', err);
    return <Outlet />;
  }
};

export default PublicRouteWrapper;
