import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import {
  MdPeople,
  MdHowToReg,
  MdPersonOff,
  MdEventBusy,
  MdSchool,
  MdArrowForward,
  MdCheck,
  MdClose,
  MdCheckCircle,
} from 'react-icons/md';

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchManagerStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/manager');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Failed to load manager dashboard statistics' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagerStats();
  }, []);

  const handleLeaveDecision = async (leaveId, status) => {
    try {
      const res = await api.put(`/leaves/${leaveId}/status`, {
        status,
        remarks: `Decision by Manager: ${status}`,
      });
      if (res.data.success) {
        setMessage({ type: 'success', text: `Team leave marked as ${status}` });
        fetchManagerStats();
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating leave request');
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Title */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Team Manager Dashboard</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Monitor your direct team members, approve leave requests, and coordinate trainings.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/manager/leaves" className="btn btn-primary-custom">
            <MdEventBusy size={18} /> Review Leaves
          </Link>
          <Link to="/manager/trainings" className="btn btn-secondary-custom">
            <MdSchool size={18} /> Programs
          </Link>
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

      {/* Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Team Size"
            value={stats?.totalTeamMembers || 0}
            icon={<MdPeople />}
            color="#2563eb"
            bgLight="#eff6ff"
            subtext="Assigned direct reports"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Team Present Today"
            value={stats?.teamPresentToday || 0}
            icon={<MdHowToReg />}
            color="#10b981"
            bgLight="#dcfce7"
            subtext={`${stats?.teamAbsentToday || 0} team members absent`}
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Pending Team Leaves"
            value={stats?.teamPendingLeaves || 0}
            icon={<MdEventBusy />}
            color="#f59e0b"
            bgLight="#fef3c7"
            subtext="Requires your review"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Active Trainings"
            value={stats?.trainings?.length || 0}
            icon={<MdSchool />}
            color="#8b5cf6"
            bgLight="#f3e8ff"
            subtext="Team skill programs"
          />
        </div>
      </div>

      {/* Team Members & Pending Approvals */}
      <div className="row g-4">
        {/* Pending Team Leaves */}
        <div className="col-lg-7">
          <div className="custom-card mb-4">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                Pending Team Leave Applications
              </h5>
              <Link to="/manager/leaves" className="d-flex align-items-center gap-1 text-primary text-decoration-none fw-semibold" style={{ fontSize: '0.85rem' }}>
                All Leaves <MdArrowForward />
              </Link>
            </div>
            <div className="custom-card-body p-0">
              <div className="table-responsive">
                <table className="custom-table mb-0">
                  <thead>
                    <tr>
                      <th>Team Member</th>
                      <th>Type</th>
                      <th>Dates</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.teamLeavesHistory && stats.teamLeavesHistory.length > 0 ? (
                      stats.teamLeavesHistory.map((leave) => (
                        <tr key={leave._id}>
                          <td>
                            <div className="fw-semibold text-dark">{leave.employeeId?.name}</div>
                            <small className="text-muted">{leave.employeeId?.employeeId}</small>
                          </td>
                          <td>{leave.leaveType}</td>
                          <td>
                            <small className="text-muted">
                              {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                            </small>
                          </td>
                          <td>
                            <span className={`badge-status badge-${leave.status.toLowerCase()}`}>
                              {leave.status}
                            </span>
                          </td>
                          <td className="text-end">
                            {leave.status === 'Pending' ? (
                              <div className="btn-group btn-group-sm">
                                <button
                                  className="btn btn-outline-success btn-sm py-1"
                                  onClick={() => handleLeaveDecision(leave._id, 'Approved')}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm py-1"
                                  onClick={() => handleLeaveDecision(leave._id, 'Rejected')}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-muted" style={{ fontSize: '0.8rem' }}>Resolved</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">
                          No pending leave requests from your team.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Training Programs */}
          <div className="custom-card">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                Team Training Programs
              </h5>
              <Link to="/manager/trainings" className="text-primary text-decoration-none fw-semibold" style={{ fontSize: '0.85rem' }}>
                Manage
              </Link>
            </div>
            <div className="custom-card-body p-3">
              {stats?.trainings && stats.trainings.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {stats.trainings.map((t) => (
                    <div key={t._id} className="p-3 border rounded-3 bg-light">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold text-dark">{t.title}</span>
                        <span className={`badge-status badge-${t.status.toLowerCase()}`}>
                          {t.status}
                        </span>
                      </div>
                      <small className="text-muted d-block mb-1">
                        Trainer: {t.trainer} • Starts: {new Date(t.startDate).toLocaleDateString()}
                      </small>
                      <p className="text-secondary mb-0 text-truncate" style={{ fontSize: '0.825rem' }}>
                        {t.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-3 mb-0">No active training programs.</p>
              )}
            </div>
          </div>
        </div>

        {/* Assigned Team Members Column */}
        <div className="col-lg-5">
          <div className="custom-card">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                My Team Members ({stats?.teamMembers?.length || 0})
              </h5>
              <Link to="/manager/team" className="text-primary text-decoration-none fw-semibold" style={{ fontSize: '0.85rem' }}>
                View Directory
              </Link>
            </div>
            <div className="custom-card-body p-3">
              {stats?.teamMembers && stats.teamMembers.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {stats.teamMembers.map((member) => (
                    <div key={member._id} className="d-flex align-items-center justify-content-between p-2 rounded-2 border">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center"
                          style={{ width: 40, height: 40, fontSize: '0.95rem' }}
                        >
                          {member.name[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>{member.name}</div>
                          <small className="text-muted d-block">{member.designation}</small>
                          <small className="text-primary" style={{ fontSize: '0.75rem' }}>{member.email}</small>
                        </div>
                      </div>
                      <span className="badge bg-light text-secondary border font-monospace" style={{ fontSize: '0.75rem' }}>
                        {member.employeeId}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4 mb-0">No team members assigned to you.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
