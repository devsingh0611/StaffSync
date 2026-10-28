import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  MdAccessTime,
  MdToday,
  MdFilterList,
  MdAdd,
  MdCheckCircle,
  MdClose,
  MdSchedule,
} from 'react-icons/md';

const AttendanceManagement = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [department, setDepartment] = useState('All');
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showManualModal, setShowManualModal] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [manualForm, setManualForm] = useState({
    employeeId: '',
    date: todayStr,
    status: 'Present',
    checkIn: '09:00',
    checkOut: '17:30',
    totalWorkingHours: 8.5,
    notes: 'HR manual adjustment',
  });

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = { date: selectedDate };
      if (department !== 'All') params.department = department;

      const res = await api.get('/attendance', { params });
      if (res.data.success) {
        setRecords(res.data.records);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Error fetching attendance records' });
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeesList = async () => {
    try {
      const res = await api.get('/employees');
      if (res.data.success) {
        setEmployees(res.data.employees);
        if (res.data.employees.length > 0 && !manualForm.employeeId) {
          setManualForm((prev) => ({ ...prev, employeeId: res.data.employees[0]._id }));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, department]);

  useEffect(() => {
    fetchEmployeesList();
  }, []);

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    try {
      // Build ISO date strings from time inputs
      const checkInDateTime = new Date(`${manualForm.date}T${manualForm.checkIn}:00`);
      const checkOutDateTime = new Date(`${manualForm.date}T${manualForm.checkOut}:00`);

      const payload = {
        employeeId: manualForm.employeeId,
        date: manualForm.date,
        status: manualForm.status,
        checkIn: checkInDateTime,
        checkOut: checkOutDateTime,
        totalWorkingHours: Number(manualForm.totalWorkingHours) || 8,
        notes: manualForm.notes,
      };

      const res = await api.post('/attendance/manual', payload);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Attendance record updated successfully!' });
        setShowManualModal(false);
        fetchAttendance();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Error recording manual attendance',
      });
    }
  };

  // Metrics calculation
  const presentCount = records.filter((r) => r.status === 'Present' || r.status === 'Late').length;
  const lateCount = records.filter((r) => r.status === 'Late').length;
  const halfDayCount = records.filter((r) => r.status === 'Half Day').length;

  return (
    <div>
      {/* Title & Manual Mark Trigger */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Attendance Management</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Daily check-in monitoring, biometric logs, and working hours analytics.
          </p>
        </div>
        <button className="btn btn-primary-custom" onClick={() => setShowManualModal(true)}>
          <MdAdd size={20} /> Manual Attendance Entry
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} py-2 px-3 rounded-3 mb-4 d-flex justify-content-between align-items-center`}>
          <span>{message.text}</span>
          <button className="btn btn-sm btn-link text-dark p-0" onClick={() => setMessage({ type: '', text: '' })}>
            <MdClose />
          </button>
        </div>
      )}

      {/* Date & Department Filter Bar */}
      <div className="custom-card p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <label className="form-label text-muted fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>
              SELECT DATE
            </label>
            <input
              type="date"
              className="form-control"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label text-muted fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>
              FILTER DEPARTMENT
            </label>
            <select
              className="form-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Design">Design</option>
              <option value="Sales">Sales</option>
            </select>
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button
              className="btn btn-secondary-custom w-100"
              onClick={() => setSelectedDate(todayStr)}
            >
              <MdToday className="me-1" /> Jump to Today
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="row g-3 mb-4">
        <div className="col-sm-4">
          <div className="p-3 rounded-3 bg-white border d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>TOTAL CHECKED IN</span>
              <h4 className="fw-bold text-success mb-0">{presentCount}</h4>
            </div>
            <span className="badge bg-success-subtle text-success p-2 rounded-3">Present</span>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="p-3 rounded-3 bg-white border d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>LATE ARRIVALS</span>
              <h4 className="fw-bold text-warning mb-0">{lateCount}</h4>
            </div>
            <span className="badge bg-warning-subtle text-warning p-2 rounded-3">Late</span>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="p-3 rounded-3 bg-white border d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem' }}>HALF DAYS</span>
              <h4 className="fw-bold text-info mb-0">{halfDayCount}</h4>
            </div>
            <span className="badge bg-info-subtle text-info p-2 rounded-3">&lt; 4.5 hrs</span>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="custom-card">
        <div className="custom-card-header">
          <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
            Attendance Logs for {new Date(selectedDate).toLocaleDateString()} ({records.length})
          </h5>
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
            Daily timecard records
          </span>
        </div>
        <div className="custom-card-body p-0">
          <div className="table-responsive">
            <table className="custom-table mb-0">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Check-In Time</th>
                  <th>Check-Out Time</th>
                  <th>Total Working Hours</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      Loading attendance records...
                    </td>
                  </tr>
                ) : records.length > 0 ? (
                  records.map((r) => (
                    <tr key={r._id}>
                      <td>
                        <div className="fw-semibold text-dark">{r.employeeId?.name || 'Staff Member'}</div>
                        <small className="text-muted">{r.employeeId?.employeeId}</small>
                      </td>
                      <td>{r.employeeId?.department}</td>
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
                      No attendance logged for {new Date(selectedDate).toLocaleDateString()}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Attendance Modal */}
      {showManualModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom px-4 py-3">
                <h5 className="modal-title fw-bold text-dark">Manual Attendance Override</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowManualModal(false)}
                ></button>
              </div>
              <form onSubmit={handleManualSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Select Employee *
                    </label>
                    <select
                      className="form-select"
                      value={manualForm.employeeId}
                      onChange={(e) => setManualForm({ ...manualForm, employeeId: e.target.value })}
                      required
                    >
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.employeeId} - {emp.department})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Date *
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={manualForm.date}
                        onChange={(e) => setManualForm({ ...manualForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Status *
                      </label>
                      <select
                        className="form-select"
                        value={manualForm.status}
                        onChange={(e) => setManualForm({ ...manualForm, status: e.target.value })}
                      >
                        <option value="Present">Present</option>
                        <option value="Late">Late</option>
                        <option value="Half Day">Half Day</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Check In Time
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        value={manualForm.checkIn}
                        onChange={(e) => setManualForm({ ...manualForm, checkIn: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Check Out Time
                      </label>
                      <input
                        type="time"
                        className="form-control"
                        value={manualForm.checkOut}
                        onChange={(e) => setManualForm({ ...manualForm, checkOut: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Working Hours Logged
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={manualForm.totalWorkingHours}
                      onChange={(e) => setManualForm({ ...manualForm, totalWorkingHours: e.target.value })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Admin Notes / Reason
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={manualForm.notes}
                      onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                      placeholder="e.g. Card scanner failure / manual verification"
                    />
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3">
                  <button
                    type="button"
                    className="btn btn-secondary-custom"
                    onClick={() => setShowManualModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-custom">
                    Save Attendance
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

export default AttendanceManagement;
