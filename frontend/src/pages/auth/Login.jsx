import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MdEmail, MdLock, MdLogin, MdBadge, MdSupervisorAccount, MdPerson } from 'react-icons/md';
import { HiOutlineSparkles } from 'react-icons/hi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        const userRole = res.user.role?.toLowerCase();
        if (userRole === 'hr') {
          navigate('/hr/dashboard');
        } else if (userRole === 'manager') {
          navigate('/manager/dashboard');
        } else {
          navigate('/employee/dashboard');
        }
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-Click Demo Login fill
  const handleQuickFill = (roleType) => {
    if (roleType === 'hr') {
      setEmail('hr@staffsync.com');
      setPassword('password123');
    } else if (roleType === 'manager') {
      setEmail('david.mitchell@staffsync.com');
      setPassword('password123');
    } else if (roleType === 'employee') {
      setEmail('employee@staffsync.com');
      setPassword('password123');
    }
    setError('');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: '#f1f5f9' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-4 text-white shadow-sm mb-3"
            style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #2563eb, #1e40af)' }}
          >
            <HiOutlineSparkles size={32} />
          </div>
          <h2 className="fw-bold text-dark mb-1">
            Staff<span style={{ color: '#2563eb' }}>Sync</span>
          </h2>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>
            Modern Human Resource Management System
          </p>
        </div>

        {/* Demo Fast-Switch Buttons */}
        <div className="card border-0 shadow-sm rounded-4 mb-3 p-3 bg-white">
          <small className="text-muted fw-bold text-uppercase d-block mb-2 text-center" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
            ⚡ 1-Click Demo Credentials
          </small>
          <div className="d-flex gap-2 flex-wrap">
            <button
              type="button"
              className="btn btn-sm btn-outline-danger flex-grow-1 d-flex align-items-center justify-content-center gap-1 py-2"
              onClick={() => handleQuickFill('hr')}
            >
              <MdBadge /> <span>HR Admin</span>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center gap-1 py-2"
              onClick={() => handleQuickFill('manager')}
            >
              <MdSupervisorAccount /> <span>Manager</span>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-success flex-grow-1 d-flex align-items-center justify-content-center gap-1 py-2"
              onClick={() => handleQuickFill('employee')}
            >
              <MdPerson /> <span>Employee</span>
            </button>
          </div>
        </div>

        {/* Main Login Card */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          <h4 className="fw-bold mb-3 text-dark">Sign in to your account</h4>
          <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
            Enter your workplace credentials to access your dashboard.
          </p>

          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 d-flex align-items-center gap-2 mb-4" style={{ fontSize: '0.875rem' }}>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <MdEmail size={18} />
                </span>
                <input
                  type="email"
                  className="form-control border-start-0 ps-0"
                  placeholder="name@staffsync.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label fw-semibold text-secondary mb-0" style={{ fontSize: '0.85rem' }}>
                  Password
                </label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#2563eb', textDecoration: 'none' }}>
                  Forgot password?
                </Link>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <MdLock size={18} />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary-custom w-100 justify-content-center py-2 mt-3"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  <MdLogin size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-3 border-top text-center">
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>
              Need a new staff account?{' '}
            </span>
            <Link to="/register" className="fw-semibold" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem' }}>
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
