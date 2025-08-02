import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  role: string;
  isVerified: boolean;
}

interface RoleBasedWrapperProps {
  allowedRoles: string[];
}

const RoleBasedWrapper: React.FC<RoleBasedWrapperProps> = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login/user" replace />;
  }

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    console.log(decoded)
    if(decoded.role === "owner" && !decoded.isVerified) {
      return <Navigate to={`/not-verified`} replace />; // Access Denied
    }
    if (allowedRoles.includes(decoded.role)) {
      return <Outlet />; // Render nested routes
    } else {
      return <Navigate to={`/login/${decoded.role}`} replace />; // Access Denied
    }
  } catch (err) {
    console.error('Invalid Token', err);
    return <Navigate to="/login/user" replace />;
  }
};

export default RoleBasedWrapper;
