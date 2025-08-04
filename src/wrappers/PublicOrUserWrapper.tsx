import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  role: string;
  isVerified: boolean;
}

const PublicOrUserWrapper: React.FC = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    // No token, allow access
    return <Outlet />;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    console.log(decoded);

    if (decoded.role === 'user') {
      // Token exists and role is 'user', allow access
      return <Outlet />;
    } else {
      // Token exists but role is not 'user', redirect to /login/{role}
      return <Navigate to={`/login/${decoded.role}`} replace />;
    }
  } catch (err) {
    console.error('Invalid Token', err);
    // If token is invalid, allow access as if no token
    return <Outlet />;
  }
};

export default PublicOrUserWrapper;
