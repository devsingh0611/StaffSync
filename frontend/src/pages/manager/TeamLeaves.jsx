import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdCheck, MdClose, MdEventBusy, MdCheckCircle } from 'react-icons/md';

const TeamLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [decisionType, setDecisionType] = useState('Approved');
  const [remarks, setRemarks] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchTeamLeaves = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeTab !== 'All') params.status = activeTab;

      const res = await api.get('/leaves', { params });
      if (res.data.success) {
        setLeaves(res.data.leaves);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Error fetching team leave requests' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamLeaves();
  }, [activeTab]);

  const openDecisionModal = (leave, type) => {
    setSelectedLeave(leave);
    setDecisionType(type);
    setRemarks('');
    setShowModal(true);
  };

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLeave) return;

    try {
      setSubmitting(true);
      const res = await api.put(`/leaves/${selectedLeave._id}/status`, {
        status: decisionType,
        remarks: remarks || `Team leave ${decisionType.toLowerCase()} by manager`,
      });

      if (res.data.success) {
        setMessage({
          type: 'success',
          text: `Leave request for ${selectedLeave.employeeId?.name} has been marked as ${decisionType}.`,
        });
        setShowModal(false);
        fetchTeamLeaves();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Error updating team leave request',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Team Leave Requests</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Review, approve, or decline time-off applications from your team members.
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

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {['All', 'Pending', 'Approved', 'Rejected'].map((tab) => (
          <button
            key={tab}
            className={`btn btn-sm ${
              activeTab === tab ? 'btn-primary-custom' : 'btn-secondary-custom'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'All' ? 'All Team Leaves' : tab}
          </button>
        ))}
      </div>

      {/* Leaves Table */}
      <div className="custom-card">
        <div className="custom-card-header">
          <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
            Team Requests ({leaves.length})
          </h5>
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
            Status: {activeTab}
          </span>
        </div>
        <div className="custom-card-body p-0">
          <div className="table-responsive">
            <table className="custom-table mb-0">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Leave Type</th>
                  <th>Date Range</th>
                  <th>Reason</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      Loading team leaves...
                    </td>
                  </tr>
                ) : leaves.length > 0 ? (
                  leaves.map((l) => (
                    <tr key={l._id}>
                      <td>
                        <div className="fw-semibold text-dark">{l.employeeId?.name || 'Team Member'}</div>
                        <small className="text-muted">{l.employeeId?.employeeId}</small>
                      </td>
                      <td>
                        <span className="fw-medium text-dark">{l.leaveType}</span>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>
                          {new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td style={{ maxWidth: '200px' }}>
                        <span className="text-truncate d-inline-block text-secondary" style={{ maxWidth: '200px' }} title={l.reason}>
                          {l.reason}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {l.appliedDate ? new Date(l.appliedDate).toLocaleDateString() : 'N/A'}
                        </small>
                      </td>
                      <td>
                        <span className={`badge-status badge-${l.status.toLowerCase()}`}>
                          {l.status}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">{l.remarks || '—'}</small>
                      </td>
                      <td className="text-end">
                        {l.status === 'Pending' ? (
                          <div className="btn-group btn-group-sm">
                            <button
                              className="btn btn-outline-success"
                              onClick={() => openDecisionModal(l, 'Approved')}
                            >
                              <MdCheck size={16} /> Approve
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => openDecisionModal(l, 'Rejected')}
                            >
                              <MdClose size={16} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="badge bg-light text-secondary border">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      No team leave applications in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Decision Modal */}
      {showModal && selectedLeave && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom px-4 py-3">
                <h5 className="modal-title fw-bold text-dark">
                  {decisionType} Leave Request
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleDecisionSubmit}>
                <div className="modal-body p-4">
                  <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                    Confirm {decisionType.toLowerCase()}ing <strong>{selectedLeave.leaveType}</strong> for{' '}
                    <strong>{selectedLeave.employeeId?.name}</strong>.
                  </p>
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Manager Remarks
                    </label>
                    <textarea
                      rows="3"
                      className="form-control"
                      placeholder={`Enter notes for ${selectedLeave.employeeId?.name}...`}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3">
                  <button type="button" className="btn btn-secondary-custom" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`btn ${decisionType === 'Approved' ? 'btn-success' : 'btn-danger'}`}
                  >
                    {submitting ? 'Updating...' : `Confirm ${decisionType}`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamLeaves;
