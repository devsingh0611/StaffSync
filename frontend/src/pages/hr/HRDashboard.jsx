import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import {
  MdPeople,
  MdSupervisorAccount,
  MdHowToReg,
  MdPersonOff,
  MdEventBusy,
  MdCheckCircle,
  MdAdd,
  MdCampaign,
  MdAccessTime,
  MdArrowForward,
} from 'react-icons/md';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#10b981', '#f59e0b', '#8b5cf6'];

const HRDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/hr');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load HR dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleQuickLeaveAction = async (leaveId, status) => {
    try {
      const res = await api.put(`/leaves/${leaveId}/status`, {
        status,
        remarks: `Quick decision by HR Administrator: ${status}`,
      });
      if (res.data.success) {
        setActionSuccess(`Leave request marked as ${status}`);
        fetchDashboardStats();
        setTimeout(() => setActionSuccess(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating leave request');
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Dashboard...</span>
        </div>
      </div>
    );
  }

  const deptData = stats?.departmentDistribution || [
    { department: 'Engineering', count: 4 },
    { department: 'Marketing', count: 3 },
    { department: 'Human Resources', count: 2 },
    { department: 'Finance', count: 1 },
    { department: 'Design', count: 1 },
  ];

  return (
    <div>
      {/* Page Title & Quick Actions */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">HR Administration Dashboard</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Real-time organizational overview, employee metrics, and pending requests.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/hr/employees" className="btn btn-primary-custom">
            <MdAdd size={18} /> Add Employee
          </Link>
          <Link to="/hr/announcements" className="btn btn-secondary-custom">
            <MdCampaign size={18} /> Announcement
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="alert alert-success alert-dismissible fade show py-2 px-3 rounded-3 mb-4" role="alert">
          <MdCheckCircle className="me-2" /> {actionSuccess}
        </div>
      )}

      {error && (
        <div className="alert alert-danger py-2 px-3 rounded-3 mb-4">{error}</div>
      )}

      {/* Top Key Performance Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Total Staff"
            value={stats?.totalStaff || 0}
            icon={<MdPeople />}
            color="#2563eb"
            bgLight="#eff6ff"
            subtext={`${stats?.totalEmployees || 0} Employees, ${stats?.totalManagers || 0} Managers`}
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Present Today"
            value={stats?.presentToday || 0}
            icon={<MdHowToReg />}
            color="#10b981"
            bgLight="#dcfce7"
            trend={`${Math.round(((stats?.presentToday || 0) / Math.max(stats?.totalStaff || 1, 1)) * 100)}%`}
            subtext="attendance rate"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Absent Today"
            value={stats?.absentToday || 0}
            icon={<MdPersonOff />}
            color="#ef4444"
            bgLight="#fee2e2"
            subtext="Staff not checked in"
          />
        </div>
        <div className="col-sm-6 col-xl-3">
          <StatCard
            title="Pending Leaves"
            value={stats?.pendingLeaves || 0}
            icon={<MdEventBusy />}
            color="#f59e0b"
            bgLight="#fef3c7"
            subtext={`${stats?.approvedLeaves || 0} leaves approved`}
          />
        </div>
      </div>

      {/* Charts & Graphs Row */}
      <div className="row g-4 mb-4">
        {/* Department Distribution Bar Chart */}
        <div className="col-lg-7">
          <div className="custom-card h-100">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                Department-wise Staff Distribution
              </h5>
              <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                Active headcount
              </span>
            </div>
            <div className="custom-card-body" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <XAxis dataKey="department" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Attendance Breakdown Donut Chart */}
        <div className="col-lg-5">
          <div className="custom-card h-100">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                Today's Attendance Ratio
              </h5>
              <span className="badge bg-light text-secondary border">Live</span>
            </div>
            <div className="custom-card-body d-flex flex-column align-items-center justify-content-center" style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="80%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Present', value: stats?.presentToday || 1 },
                      { name: 'Absent / On Leave', value: stats?.absentToday || 0 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leaves & Announcements */}
      <div className="row g-4">
        {/* Recent Leave Requests */}
        <div className="col-lg-8">
          <div className="custom-card">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                Recent Leave Requests
              </h5>
              <Link to="/hr/leaves" className="d-flex align-items-center gap-1 text-primary text-decoration-none fw-semibold" style={{ fontSize: '0.85rem' }}>
                View All <MdArrowForward />
              </Link>
            </div>
            <div className="custom-card-body p-0">
              <div className="table-responsive">
                <table className="custom-table mb-0">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Type</th>
                      <th>Dates</th>
                      <th>Status</th>
                      <th className="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentLeaves && stats.recentLeaves.length > 0 ? (
                      stats.recentLeaves.map((leave) => (
                        <tr key={leave._id}>
                          <td>
                            <div className="fw-semibold text-dark">{leave.employeeId?.name || 'Staff Member'}</div>
                            <small className="text-muted">{leave.employeeId?.department}</small>
                          </td>
                          <td>
                            <span className="fw-medium text-secondary">{leave.leaveType}</span>
                          </td>
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
                                  onClick={() => handleQuickLeaveAction(leave._id, 'Approved')}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm py-1"
                                  onClick={() => handleQuickLeaveAction(leave._id, 'Rejected')}
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-muted" style={{ fontSize: '0.8rem' }}>Processed</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-muted">
                          No recent leave requests found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Company Announcements Feed */}
        <div className="col-lg-4">
          <div className="custom-card">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                Company Updates
              </h5>
              <Link to="/hr/announcements" className="text-primary text-decoration-none fw-semibold" style={{ fontSize: '0.85rem' }}>
                Manage
              </Link>
            </div>
            <div className="custom-card-body p-3">
              {stats?.recentAnnouncements && stats.recentAnnouncements.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {stats.recentAnnouncements.map((ann) => (
                    <div key={ann._id} className="p-3 rounded-3 border bg-light bg-opacity-50">
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
                      <p className="text-muted mb-0 text-truncate" style={{ fontSize: '0.8rem' }}>
                        {ann.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4 mb-0">No announcements posted yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
