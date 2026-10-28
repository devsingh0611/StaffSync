import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MdPerson, MdEmail, MdLock, MdWork, MdPhone, MdAssignmentInd } from 'react-icons/md';
import { HiOutlineSparkles } from 'react-icons/hi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
    department: 'Engineering',
    designation: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      const res = await register(formData);
      if (res.success) {
        if (formData.role === 'hr') navigate('/hr/dashboard');
        else if (formData.role === 'manager') navigate('/manager/dashboard');
        else navigate('/employee/dashboard');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ backgroundColor: '#f1f5f9' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
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
            Create Your StaffSync Account
          </p>
        </div>

        {/* Register Card */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          <h4 className="fw-bold mb-3 text-dark">Employee Registration</h4>
          <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
            Fill in the details below to register on the HRMS portal.
          </p>

          {error && (
            <div className="alert alert-danger py-2 px-3 rounded-3 mb-4" style={{ fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                  Full Name *
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <MdPerson size={18} />
                  </span>
                  <input
                    type="text"
                    name="name"
                    className="form-control border-start-0 ps-0"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                  Work Email *
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <MdEmail size={18} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    className="form-control border-start-0 ps-0"
                    placeholder="john@staffsync.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                  Phone Number
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <MdPhone size={18} />
                  </span>
                  <input
                    type="text"
                    name="phone"
                    className="form-control border-start-0 ps-0"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                  User Role *
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <MdAssignmentInd size={18} />
                  </span>
                  <select
                    name="role"
                    className="form-select border-start-0 ps-0"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="hr">HR Administrator</option>
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                  Department *
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <MdWork size={18} />
                  </span>
                  <select
                    name="department"
                    className="form-select border-start-0 ps-0"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Design">Design</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                  Job Designation
                </label>
                <input
                  type="text"
                  name="designation"
                  className="form-control"
                  placeholder="e.g. Software Engineer / Operations Specialist"
                  value={formData.designation}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                  Password *
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <MdLock size={18} />
                  </span>
                  <input
                    type="password"
                    name="password"
                    className="form-control border-start-0 ps-0"
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                  Confirm Password *
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <MdLock size={18} />
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control border-start-0 ps-0"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary-custom w-100 justify-content-center py-2 mt-4"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                'Complete Registration'
              )}
            </button>
          </form>

          <div className="mt-4 pt-3 border-top text-center">
            <span className="text-muted" style={{ fontSize: '0.875rem' }}>
              Already registered?{' '}
            </span>
            <Link to="/login" className="fw-semibold" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '0.875rem' }}>
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
