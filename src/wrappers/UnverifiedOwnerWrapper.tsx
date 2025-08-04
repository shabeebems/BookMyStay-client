import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  role: string;
  isVerified: boolean;
}

const UnverifiedOwnerWrapper: React.FC = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login/owner" replace />;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    console.log(decoded);

    // Only allow owner who is NOT verified
    if (decoded.role === 'owner' && !decoded.isVerified) {
      return <Outlet />;
    } else {
      // Redirect verified owner to dashboard, others to their login
      if (decoded.role === 'owner') {
        return <Navigate to="/owner-dashboard" replace />;
      } else {
        return <Navigate to={`/login/${decoded.role}`} replace />;
      }
    }

  } catch (err) {
    console.error('Invalid Token', err);
    return <Navigate to="/login/owner" replace />;
  }
};

export default UnverifiedOwnerWrapper;
