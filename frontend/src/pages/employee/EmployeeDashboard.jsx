import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import {
  MdAccessTime,
  MdEventBusy,
  MdSchool,
  MdCampaign,
  MdCheckCircle,
  MdArrowForward,
  MdLogin,
  MdLogout,
  MdHourglassEmpty,
  MdTimer,
} from 'react-icons/md';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clockActionLoading, setClockActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchEmployeeStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/employee');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Error loading dashboard statistics' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeStats();
  }, []);

  // Handle Check-In
  const handleCheckIn = async () => {
    try {
      setClockActionLoading(true);
      const res = await api.post('/attendance/check-in', {});
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        fetchEmployeeStats();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Check-in failed. Please try again.',
      });
    } finally {
      setClockActionLoading(false);
    }
  };

  // Handle Check-Out
  const handleCheckOut = async () => {
    try {
      setClockActionLoading(true);
      const res = await api.post('/attendance/check-out', {});
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        fetchEmployeeStats();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Check-out failed. Please try again.',
      });
    } finally {
      setClockActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const isCheckedIn = stats?.isCheckedIn;
  const isCheckedOut = stats?.isCheckedOut;
  const todayAttendance = stats?.todayAttendance;

  return (
    <div>
      {/* Welcome Banner */}
      <div className="custom-card p-4 mb-4 border-0" style={{ background: 'linear-gradient(135deg, #1e40af, #2563eb)', color: '#ffffff' }}>
        <div className="row align-items-center">
          <div className="col-md-8">
            <span className="badge bg-white bg-opacity-20 text-white mb-2" style={{ fontSize: '0.75rem' }}>
              Employee Portal
            </span>
            <h3 className="fw-bold mb-1">
              Welcome back, {user?.name}! 👋
            </h3>
            <p className="mb-0 text-white text-opacity-75" style={{ fontSize: '0.9rem' }}>
              {user?.designation} • {user?.department} • ID: {user?.employeeId}
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <div className="bg-white bg-opacity-10 p-3 rounded-3 d-inline-block text-start">
              <small className="text-white text-opacity-75 d-block" style={{ fontSize: '0.75rem' }}>
                LIVE WORKPLACE TIME
              </small>
              <h4 className="fw-bold text-white mb-0 font-monospace">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} py-2 px-3 rounded-3 mb-4 d-flex justify-content-between align-items-center`}>
          <span>{message.text}</span>
          <button className="btn btn-sm btn-link text-dark p-0" onClick={() => setMessage({ type: '', text: '' })}>
            ×
          </button>
        </div>
      )}

      {/* Clock-In / Clock-Out Quick Action Widget */}
      <div className="custom-card p-4 mb-4">
        <div className="row align-items-center">
          <div className="col-md-7">
            <h5 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
              <MdTimer className="text-primary" size={24} /> Daily Timecard & Attendance
            </h5>
            <p className="text-muted mb-2 mb-md-0" style={{ fontSize: '0.875rem' }}>
              {!isCheckedIn
                ? 'You have not checked in for today yet. Clock in to mark your attendance.'
                : !isCheckedOut
                ? `You checked in at ${new Date(todayAttendance?.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Remember to clock out when wrapping up!`
                : `You clocked out at ${new Date(todayAttendance?.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Total logged: ${todayAttendance?.totalWorkingHours} hours.`}
            </p>
          </div>
          <div className="col-md-5 text-md-end d-flex gap-2 justify-content-md-end">
            {!isCheckedIn ? (
              <button
                className="btn btn-success py-2 px-4 d-flex align-items-center gap-2 fw-semibold"
                style={{ borderRadius: 8 }}
                onClick={handleCheckIn}
                disabled={clockActionLoading}
              >
                <MdLogin size={18} />
                {clockActionLoading ? 'Recording...' : 'Check In Now'}
              </button>
            ) : !isCheckedOut ? (
              <button
                className="btn btn-danger py-2 px-4 d-flex align-items-center gap-2 fw-semibold"
                style={{ borderRadius: 8 }}
                onClick={handleCheckOut}
                disabled={clockActionLoading}
              >
                <MdLogout size={18} />
                {clockActionLoading ? 'Recording...' : 'Check Out Now'}
              </button>
            ) : (
              <button className="btn btn-outline-secondary py-2 px-3 d-flex align-items-center gap-2" disabled>
                <MdCheckCircle size={18} className="text-success" /> Attendance Completed Today
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Present This Month"
            value={`${stats?.monthlyPresentDays || 0} Days`}
            icon={<MdAccessTime />}
            color="#10b981"
            bgLight="#dcfce7"
            subtext="Days checked in"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Leave Balance"
            value={`${stats?.leaveBalance || 0} Days`}
            icon={<MdEventBusy />}
            color="#2563eb"
            bgLight="#eff6ff"
            subtext="Available paid leaves"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Pending Requests"
            value={stats?.pendingLeaves || 0}
            icon={<MdHourglassEmpty />}
            color="#f59e0b"
            bgLight="#fef3c7"
            subtext="Awaiting manager/HR approval"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Assigned Trainings"
            value={stats?.trainings?.length || 0}
            icon={<MdSchool />}
            color="#8b5cf6"
            bgLight="#f3e8ff"
            subtext="Skill development programs"
          />
        </div>
      </div>

      {/* Recent Leaves & Announcements */}
      <div className="row g-4">
        {/* My Recent Leaves */}
        <div className="col-lg-7">
          <div className="custom-card mb-4">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                My Recent Leave Applications
              </h5>
              <Link to="/employee/leaves" className="d-flex align-items-center gap-1 text-primary text-decoration-none fw-semibold" style={{ fontSize: '0.85rem' }}>
                Apply & View All <MdArrowForward />
              </Link>
            </div>
            <div className="custom-card-body p-0">
              <div className="table-responsive">
                <table className="custom-table mb-0">
                  <thead>
                    <tr>
                      <th>Leave Type</th>
                      <th>Dates</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentLeaves && stats.recentLeaves.length > 0 ? (
                      stats.recentLeaves.map((l) => (
                        <tr key={l._id}>
                          <td>
                            <span className="fw-semibold text-dark">{l.leaveType}</span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {new Date(l.startDate).toLocaleDateString()} to {new Date(l.endDate).toLocaleDateString()}
                            </small>
                          </td>
                          <td style={{ maxWidth: '180px' }}>
                            <span className="text-truncate d-inline-block text-secondary" style={{ maxWidth: '180px' }} title={l.reason}>
                              {l.reason}
                            </span>
                          </td>
                          <td>
                            <span className={`badge-status badge-${l.status.toLowerCase()}`}>
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          You haven't submitted any leave requests yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Assigned Trainings */}
          <div className="custom-card">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                My Assigned Trainings
              </h5>
              <Link to="/employee/trainings" className="text-primary text-decoration-none fw-semibold" style={{ fontSize: '0.85rem' }}>
                View All
              </Link>
            </div>
            <div className="custom-card-body p-3">
              {stats?.trainings && stats.trainings.length > 0 ? (
                <div className="d-flex flex-column gap-2">
                  {stats.trainings.map((t) => (
                    <div key={t._id} className="p-3 border rounded-3 bg-light">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold text-dark">{t.title}</span>
                        <span className={`badge-status badge-${t.status.toLowerCase()}`}>{t.status}</span>
                      </div>
                      <small className="text-muted d-block">
                        Instructor: {t.trainer} • {new Date(t.startDate).toLocaleDateString()} to {new Date(t.endDate).toLocaleDateString()}
                      </small>
                      <p className="text-secondary mb-0 mt-1 text-truncate" style={{ fontSize: '0.825rem' }}>
                        {t.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-3 mb-0">No training programs assigned currently.</p>
              )}
            </div>
          </div>
        </div>

        {/* Company Announcements Feed */}
        <div className="col-lg-5">
          <div className="custom-card">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                Company News & Updates
              </h5>
              <Link to="/employee/announcements" className="text-primary text-decoration-none fw-semibold" style={{ fontSize: '0.85rem' }}>
                All Updates
              </Link>
            </div>
            <div className="custom-card-body p-3">
              {stats?.announcements && stats.announcements.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {stats.announcements.map((ann) => (
                    <div key={ann._id} className="p-3 rounded-3 border bg-light">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className={`badge badge-${ann.priority.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>
                          {ann.priority}
                        </span>
                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {new Date(ann.createdDate).toLocaleDateString()}
                        </small>
                      </div>
                      <h6 className="fw-semibold text-dark mb-1" style={{ fontSize: '0.9rem' }}>
                        {ann.title}
                      </h6>
                      <p className="text-secondary mb-0" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                        {ann.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4 mb-0">No company announcements currently.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
