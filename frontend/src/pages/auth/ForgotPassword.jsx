import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { MdEmail, MdArrowBack, MdCheckCircle } from 'react-icons/md';
import { HiOutlineSparkles } from 'react-icons/hi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      setLoading(true);
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'Password reset instructions have been generated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to process reset request. Please check email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: '#f1f5f9' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
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
            Password Recovery
          </p>
        </div>

        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          <h4 className="fw-bold mb-2 text-dark">Reset your password</h4>
          <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>
            Enter your registered staff email address to receive recovery instructions.
          </p>

          {message && (
            <div className="alert alert-success d-flex align-items-start gap-2 py-3 px-3 rounded-3 mb-4" style={{ fontSize: '0.875rem' }}>
              <MdCheckCircle size={20} className="mt-1 flex-shrink-0" />
              <div>{message}</div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 mb-4" style={{ fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {!message ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                  Registered Email Address
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

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary-custom w-100 justify-content-center py-2 mt-3"
              >
                {loading ? 'Processing...' : 'Send Recovery Instructions'}
              </button>
            </form>
          ) : (
            <div className="text-center mt-3">
              <Link to="/login" className="btn btn-primary-custom w-100 justify-content-center py-2">
                Back to Sign In
              </Link>
            </div>
          )}

          <div className="mt-4 pt-3 border-top text-center">
            <Link to="/login" className="d-inline-flex align-items-center gap-1 text-muted text-decoration-none" style={{ fontSize: '0.875rem' }}>
              <MdArrowBack /> Return to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
