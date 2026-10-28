import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  MdAccessTime,
  MdLogin,
  MdLogout,
  MdCheckCircle,
  MdSchedule,
  MdToday,
  MdClose,
} from 'react-icons/md';

const MyAttendance = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const [historyRes, todayRes] = await Promise.all([
        api.get('/attendance/my-history'),
        api.get('/attendance/today'),
      ]);

      if (historyRes.data.success) {
        setAttendanceData(historyRes.data);
      }
      if (todayRes.data.success) {
        setTodayStatus(todayRes.data);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Error loading attendance details' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      setActionLoading(true);
      const res = await api.post('/attendance/check-in', {});
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        fetchAttendance();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Check-in failed',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setActionLoading(true);
      const res = await api.post('/attendance/check-out', {});
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        fetchAttendance();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Check-out failed',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const isCheckedIn = todayStatus?.isCheckedIn;
  const isCheckedOut = todayStatus?.isCheckedOut;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">My Attendance & Timecard</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Daily check-in / check-out and monthly working hours log.
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

      {/* Clock In / Out Banner */}
      <div className="custom-card p-4 mb-4">
        <div className="row align-items-center">
          <div className="col-md-7">
            <span className="badge bg-light text-secondary border mb-2">Today's Shift</span>
            <h4 className="fw-bold text-dark mb-1">
              {!isCheckedIn
                ? 'Ready to start your workday?'
                : !isCheckedOut
                ? 'Work session in progress...'
                : 'Work session ended for today.'}
            </h4>
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
              {todayStatus?.attendance?.checkIn && (
                <>Checked In: <strong>{new Date(todayStatus.attendance.checkIn).toLocaleTimeString()}</strong> • </>
              )}
              {todayStatus?.attendance?.checkOut && (
                <>Checked Out: <strong>{new Date(todayStatus.attendance.checkOut).toLocaleTimeString()}</strong> • </>
              )}
              Status: <span className="fw-semibold text-primary">{todayStatus?.attendance?.status || 'Not Checked In'}</span>
            </p>
          </div>
          <div className="col-md-5 text-md-end mt-3 mt-md-0 d-flex gap-2 justify-content-md-end">
            {!isCheckedIn ? (
              <button
                className="btn btn-success py-2 px-4 d-flex align-items-center gap-2 fw-semibold"
                onClick={handleCheckIn}
                disabled={actionLoading}
              >
                <MdLogin size={18} />
                {actionLoading ? 'Recording...' : 'Check In'}
              </button>
            ) : !isCheckedOut ? (
              <button
                className="btn btn-danger py-2 px-4 d-flex align-items-center gap-2 fw-semibold"
                onClick={handleCheckOut}
                disabled={actionLoading}
              >
                <MdLogout size={18} />
                {actionLoading ? 'Recording...' : 'Check Out'}
              </button>
            ) : (
              <span className="badge bg-success-subtle text-success p-2 d-inline-flex align-items-center gap-1">
                <MdCheckCircle size={18} /> Shift Completed ({todayStatus.attendance.totalWorkingHours} hrs)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="row g-3 mb-4">
        <div className="col-sm-4">
          <div className="p-3 rounded-3 bg-white border d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>DAYS LOGGED</span>
              <h4 className="fw-bold text-dark mb-0">{attendanceData?.stats?.presentDays || 0} Days</h4>
            </div>
            <span className="badge bg-success-subtle text-success p-2">Present</span>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="p-3 rounded-3 bg-white border d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>TOTAL HOURS LOGGED</span>
              <h4 className="fw-bold text-primary mb-0">{attendanceData?.stats?.totalHours || 0} hrs</h4>
            </div>
            <span className="badge bg-primary-subtle text-primary p-2">Cumulative</span>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="p-3 rounded-3 bg-white border d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>AVERAGE DAILY HOURS</span>
              <h4 className="fw-bold text-info mb-0">{attendanceData?.stats?.averageHours || 0} hrs</h4>
            </div>
            <span className="badge bg-info-subtle text-info p-2">Daily Avg</span>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="custom-card">
        <div className="custom-card-header">
          <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
            Attendance History ({attendanceData?.records?.length || 0} Days)
          </h5>
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>Your personal timecard</span>
        </div>
        <div className="custom-card-body p-0">
          <div className="table-responsive">
            <table className="custom-table mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      Loading your timecard history...
                    </td>
                  </tr>
                ) : attendanceData?.records?.length > 0 ? (
                  attendanceData.records.map((r) => (
                    <tr key={r._id}>
                      <td className="fw-semibold text-dark">
                        {new Date(r.date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td>
                        {r.checkIn ? new Date(r.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td>
                        {r.checkOut ? new Date(r.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                      </td>
                      <td>
                        <span className="badge bg-light text-dark border">
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
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No attendance records found.
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

export default MyAttendance;
