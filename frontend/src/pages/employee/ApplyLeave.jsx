import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  MdEventBusy,
  MdAdd,
  MdCancel,
  MdCheckCircle,
  MdClose,
  MdInfo,
} from 'react-icons/md';

const ApplyLeave = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const initialForm = {
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchMyLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leaves/my-leaves');
      if (res.data.success) {
        setLeaves(res.data.leaves);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Error fetching your leaves' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setMessage({ type: 'danger', text: 'End date cannot be earlier than start date.' });
      setSubmitting(false);
      return;
    }

    try {
      const res = await api.post('/leaves', formData);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Leave application submitted successfully for review!' });
        setFormData(initialForm);
        fetchMyLeaves();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Error submitting leave application',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelLeave = async (leaveId) => {
    if (!window.confirm('Are you sure you want to cancel this pending leave request?')) return;
    try {
      const res = await api.put(`/leaves/${leaveId}/cancel`);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Leave request has been cancelled' });
        fetchMyLeaves();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Error cancelling leave request',
      });
    }
  };

  const approvedCount = leaves.filter((l) => l.status === 'Approved').length;
  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;
  const remainingBalance = Math.max(0, 18 - approvedCount);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Leave Management</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Submit time-off requests and track your approval status.
          </p>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} py-2 px-3 rounded-3 mb-4 d-flex justify-content-between align-items-center`}>
          <span>{message.text}</span>
          <button className="btn btn-sm btn-link text-dark p-0" onClick={() => setMessage({ type: '', text: '' })}>
            <MdClose />
          </button>
        </div>
      )}

      {/* Quota Highlights */}
      <div className="row g-3 mb-4">
        <div className="col-sm-4">
          <div className="p-3 rounded-3 bg-white border d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>ANNUAL QUOTA</span>
              <h4 className="fw-bold text-dark mb-0">18 Days</h4>
            </div>
            <span className="badge bg-primary-subtle text-primary p-2">Standard</span>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="p-3 rounded-3 bg-white border d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>REMAINING BALANCE</span>
              <h4 className="fw-bold text-success mb-0">{remainingBalance} Days</h4>
            </div>
            <span className="badge bg-success-subtle text-success p-2">Available</span>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="p-3 rounded-3 bg-white border d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>PENDING DECISIONS</span>
              <h4 className="fw-bold text-warning mb-0">{pendingCount} Requests</h4>
            </div>
            <span className="badge bg-warning-subtle text-warning p-2">In Review</span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Application Form */}
        <div className="col-lg-5">
          <div className="custom-card">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                Apply for Time Off
              </h5>
            </div>
            <div className="custom-card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                    Leave Type *
                  </label>
                  <select
                    className="form-select"
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  >
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Paid Leave">Paid Leave</option>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Maternity/Paternity">Maternity/Paternity</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Start Date *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      End Date *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                    Reason for Leave *
                  </label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="Provide detailed reason for absence..."
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary-custom w-100 justify-content-center py-2"
                >
                  {submitting ? 'Submitting...' : 'Submit Leave Request'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Leave History Table */}
        <div className="col-lg-7">
          <div className="custom-card">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                My Leave History ({leaves.length})
              </h5>
              <span className="text-muted" style={{ fontSize: '0.85rem' }}>Applications record</span>
            </div>
            <div className="custom-card-body p-0">
              <div className="table-responsive">
                <table className="custom-table mb-0">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Dates</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Reviewed By</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                          Loading your records...
                        </td>
                      </tr>
                    ) : leaves.length > 0 ? (
                      leaves.map((l) => (
                        <tr key={l._id}>
                          <td>
                            <span className="fw-semibold text-dark">{l.leaveType}</span>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark" style={{ fontSize: '0.825rem' }}>
                              {new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}
                            </div>
                            <small className="text-muted">
                              {Math.max(
                                1,
                                Math.round((new Date(l.endDate) - new Date(l.startDate)) / (1000 * 60 * 60 * 24)) + 1
                              )}{' '}
                              Day(s)
                            </small>
                          </td>
                          <td style={{ maxWidth: '140px' }}>
                            <span className="text-truncate d-inline-block text-secondary" style={{ maxWidth: '140px' }} title={l.reason}>
                              {l.reason}
                            </span>
                          </td>
                          <td>
                            <span className={`badge-status badge-${l.status.toLowerCase()}`}>
                              {l.status}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {l.approvedBy ? `${l.approvedBy.name} (${l.approvedBy.role})` : 'Pending'}
                            </small>
                          </td>
                          <td className="text-end">
                            {l.status === 'Pending' ? (
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleCancelLeave(l._id)}
                              >
                                Cancel
                              </button>
                            ) : (
                              <span className="text-muted" style={{ fontSize: '0.75rem' }}>Locked</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          You have no leave history yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
