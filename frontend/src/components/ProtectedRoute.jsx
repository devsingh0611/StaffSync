import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading StaffSync...</span>
          </div>
          <p className="mt-3 text-muted fw-semibold">Loading StaffSync HRMS...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to permitted dashboard based on actual role
    if (role === 'hr') return <Navigate to="/hr/dashboard" replace />;
    if (role === 'manager') return <Navigate to="/manager/dashboard" replace />;
    return <Navigate to="/employee/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
