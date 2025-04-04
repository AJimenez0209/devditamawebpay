import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface RequireAdminProps {
  children: ReactNode;
}

const RequireAdmin = ({ children }: RequireAdminProps) => {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    if (!decoded.isAdmin) return <Navigate to="/" />;
  } catch (err) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
