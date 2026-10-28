import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdHome } from 'react-icons/md';

const NotFound = () => {
  const { role, isAuthenticated } = useAuth();

  const getDashboardPath = () => {
    if (!isAuthenticated) return '/login';
    if (role === 'hr') return '/hr/dashboard';
    if (role === 'manager') return '/manager/dashboard';
    return '/employee/dashboard';
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light text-center p-4">
      <div>
        <h1 className="display-1 fw-bold text-primary mb-2">404</h1>
        <h3 className="fw-bold text-dark mb-2">Page Not Found</h3>
        <p className="text-muted mb-4" style={{ maxWidth: '440px' }}>
          The requested StaffSync page does not exist or you may not have sufficient permissions to view it.
        </p>
        <Link to={getDashboardPath()} className="btn btn-primary-custom d-inline-flex align-items-center gap-2">
          <MdHome size={18} /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
