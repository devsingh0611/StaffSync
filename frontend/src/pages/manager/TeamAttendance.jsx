import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdAccessTime, MdToday, MdSchedule, MdHowToReg } from 'react-icons/md';

const TeamAttendance = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await api.get('/attendance', { params: { date: selectedDate } });
      if (res.data.success) {
        setRecords(res.data.records);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Team Attendance Monitor</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Daily check-ins and hours tracking for your assigned team members.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button className="btn btn-secondary-custom" onClick={() => setSelectedDate(todayStr)}>
            <MdToday /> Today
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="custom-card">
        <div className="custom-card-header">
          <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
            Team Check-ins for {new Date(selectedDate).toLocaleDateString()} ({records.length})
          </h5>
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>Daily attendance logs</span>
        </div>
        <div className="custom-card-body p-0">
          <div className="table-responsive">
            <table className="custom-table mb-0">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Designation</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Hours Logged</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      Loading team attendance...
                    </td>
                  </tr>
                ) : records.length > 0 ? (
                  records.map((r) => (
                    <tr key={r._id}>
                      <td>
                        <div className="fw-semibold text-dark">{r.employeeId?.name || 'Team Member'}</div>
                        <small className="text-muted">{r.employeeId?.employeeId}</small>
                      </td>
                      <td>{r.employeeId?.designation}</td>
                      <td>
                        <span className="fw-semibold text-dark">
                          {r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </span>
                      </td>
                      <td>
                        <span className="fw-semibold text-dark">
                          {r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'In Progress'}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border fw-medium">
                          {r.totalWorkingHours ? `${r.totalWorkingHours} hrs` : '—'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge-status badge-${r.status.toLowerCase()}`}>
                          {r.status}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">{r.notes || '—'}</small>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      No team members checked in on this date.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamAttendance;
