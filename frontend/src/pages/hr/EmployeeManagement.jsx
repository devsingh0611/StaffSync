import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  MdAdd,
  MdSearch,
  MdEdit,
  MdDelete,
  MdVisibility,
  MdFilterList,
  MdClose,
  MdCheckCircle,
  MdPerson,
} from 'react-icons/md';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');

  // Modals state
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Form State
  const initialFormState = {
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: 'Engineering',
    designation: '',
    employeeId: '',
    phone: '',
    address: '',
    managerId: '',
    status: 'Active',
  };
  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (department !== 'All') params.department = department;
      if (roleFilter !== 'All') params.role = roleFilter;

      const res = await api.get('/employees', { params });
      if (res.data.success) {
        setEmployees(res.data.employees);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Failed to fetch employee records' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch managers list
  const fetchManagers = async () => {
    try {
      const res = await api.get('/employees/managers/list');
      if (res.data.success) {
        setManagers(res.data.managers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchManagers();
  }, [department, roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEmployees();
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData(initialFormState);
    setShowAddEditModal(true);
  };

  const openEditModal = (emp) => {
    setIsEditing(true);
    setSelectedEmployee(emp);
    setFormData({
      name: emp.name || '',
      email: emp.email || '',
      password: '', // Leave blank unless updating
      role: emp.role || 'employee',
      department: emp.department || 'Engineering',
      designation: emp.designation || '',
      employeeId: emp.employeeId || '',
      phone: emp.phone || '',
      address: emp.address || '',
      managerId: emp.managerId?._id || emp.managerId || '',
      status: emp.status || 'Active',
    });
    setShowAddEditModal(true);
  };

  const openProfileModal = async (emp) => {
    try {
      const res = await api.get(`/employees/${emp._id}`);
      if (res.data.success) {
        setSelectedEmployee(res.data);
        setShowProfileModal(true);
      }
    } catch (err) {
      setSelectedEmployee({ employee: emp });
      setShowProfileModal(true);
    }
  };

  const openDeleteModal = (emp) => {
    setSelectedEmployee(emp);
    setShowDeleteModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      if (isEditing) {
        const payload = { ...formData };
        if (!payload.password) delete payload.password; // Don't send empty password on update
        const res = await api.put(`/employees/${selectedEmployee._id}`, payload);
        if (res.data.success) {
          setMessage({ type: 'success', text: 'Employee details updated successfully' });
          setShowAddEditModal(false);
          fetchEmployees();
        }
      } else {
        const res = await api.post('/employees', formData);
        if (res.data.success) {
          setMessage({ type: 'success', text: 'New employee added successfully' });
          setShowAddEditModal(false);
          fetchEmployees();
        }
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Error saving employee details',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setSubmitting(true);
      const res = await api.delete(`/employees/${selectedEmployee._id}`);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Employee removed successfully' });
        setShowDeleteModal(false);
        fetchEmployees();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Error deleting employee',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header and Add Button */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Employee Management</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Manage staff directory, profile records, roles, and departmental assignments.
          </p>
        </div>
        <button className="btn btn-primary-custom" onClick={openAddModal}>
          <MdAdd size={20} /> Add New Employee
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} py-2 px-3 rounded-3 mb-4 d-flex align-items-center justify-content-between`}>
          <span>{message.text}</span>
          <button className="btn btn-sm btn-link text-dark p-0" onClick={() => setMessage({ type: '', text: '' })}>
            <MdClose />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="custom-card mb-4 p-3">
        <form onSubmit={handleSearchSubmit} className="row g-2 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <MdSearch size={18} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by name, ID (e.g. EMP-1001), or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-sm-6 col-md-3">
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
          <div className="col-sm-6 col-md-2">
            <select
              className="form-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="hr">HR Admin</option>
            </select>
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-primary-custom w-100 justify-content-center">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Employees Table Card */}
      <div className="custom-card">
        <div className="custom-card-header">
          <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
            Staff Directory ({employees.length})
          </h5>
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
            Showing active corporate staff
          </span>
        </div>
        <div className="custom-card-body p-0">
          <div className="table-responsive">
            <table className="custom-table mb-0">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>ID</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Reports To</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                      Loading employee directory...
                    </td>
                  </tr>
                ) : employees.length > 0 ? (
                  employees.map((emp) => (
                    <tr key={emp._id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center"
                            style={{ width: 34, height: 34, fontSize: '0.85rem' }}
                          >
                            {emp.name ? emp.name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="fw-semibold text-dark">{emp.name}</div>
                            <small className="text-muted">{emp.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-secondary border font-monospace">
                          {emp.employeeId || 'N/A'}
                        </span>
                      </td>
                      <td>{emp.department}</td>
                      <td>{emp.designation || 'Staff'}</td>
                      <td>
                        {emp.managerId ? (
                          <span className="text-dark fw-medium">{emp.managerId.name}</span>
                        ) : (
                          <span className="text-muted">Direct / Executive</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            emp.role === 'hr'
                              ? 'bg-danger-subtle text-danger'
                              : emp.role === 'manager'
                              ? 'bg-primary-subtle text-primary'
                              : 'bg-success-subtle text-success'
                          }`}
                        >
                          {emp.role?.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge-status ${
                            emp.status === 'Active' ? 'badge-present' : 'badge-rejected'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            title="View Profile Details"
                            onClick={() => openProfileModal(emp)}
                          >
                            <MdVisibility size={16} />
                          </button>
                          <button
                            className="btn btn-outline-primary"
                            title="Edit Employee"
                            onClick={() => openEditModal(emp)}
                          >
                            <MdEdit size={16} />
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            title="Delete Employee"
                            onClick={() => openDeleteModal(emp)}
                          >
                            <MdDelete size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      No employees match your search or filter parameters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Employee Modal */}
      {showAddEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom px-4 py-3">
                <h5 className="modal-title fw-bold text-dark">
                  {isEditing ? `Edit Employee: ${selectedEmployee?.name}` : 'Add New Employee'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Work Email *
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        {isEditing ? 'New Password (leave blank to keep current)' : 'Initial Password *'}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder={isEditing ? '••••••••' : 'Min 6 characters'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required={!isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Employee ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. EMP-1015 (Auto if blank)"
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Role *
                      </label>
                      <select
                        className="form-select"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                        <option value="hr">HR Administrator</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Department *
                      </label>
                      <select
                        className="form-select"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="Design">Design</option>
                        <option value="Sales">Sales</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Job Designation
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Senior Software Engineer"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Assign Manager
                      </label>
                      <select
                        className="form-select"
                        value={formData.managerId}
                        onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                      >
                        <option value="">No Manager / Executive</option>
                        {managers.map((m) => (
                          <option key={m._id} value={m._id}>
                            {m.name} ({m.department} - {m.designation})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Account Status
                      </label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Work / Home Address
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Street, City, State"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3">
                  <button
                    type="button"
                    className="btn btn-secondary-custom"
                    onClick={() => setShowAddEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary-custom"
                  >
                    {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Employee Profile Modal */}
      {showProfileModal && selectedEmployee && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom px-4 py-3">
                <h5 className="modal-title fw-bold text-dark">
                  Employee Profile: {selectedEmployee.employee?.name || selectedEmployee.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowProfileModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                {(() => {
                  const emp = selectedEmployee.employee || selectedEmployee;
                  return (
                    <div>
                      <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-4">
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: 56, height: 56, fontSize: '1.4rem' }}
                        >
                          {emp.name ? emp.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <h5 className="fw-bold mb-1 text-dark">{emp.name}</h5>
                          <div className="d-flex gap-2 align-items-center flex-wrap">
                            <span className="badge bg-primary-subtle text-primary">{emp.designation}</span>
                            <span className="badge bg-secondary-subtle text-secondary">{emp.department}</span>
                            <span className="badge bg-light text-dark border">{emp.employeeId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="row g-3 mb-4">
                        <div className="col-sm-6">
                          <small className="text-muted d-block">Work Email</small>
                          <span className="fw-semibold text-dark">{emp.email}</span>
                        </div>
                        <div className="col-sm-6">
                          <small className="text-muted d-block">Contact Phone</small>
                          <span className="fw-semibold text-dark">{emp.phone || 'Not provided'}</span>
                        </div>
                        <div className="col-sm-6">
                          <small className="text-muted d-block">Reporting Manager</small>
                          <span className="fw-semibold text-dark">
                            {emp.managerId?.name || 'Executive / None'}
                          </span>
                        </div>
                        <div className="col-sm-6">
                          <small className="text-muted d-block">Joining Date</small>
                          <span className="fw-semibold text-dark">
                            {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        <div className="col-12">
                          <small className="text-muted d-block">Address</small>
                          <span className="fw-semibold text-dark">{emp.address || 'Not provided'}</span>
                        </div>
                      </div>

                      {/* Recent Leaves */}
                      {selectedEmployee.stats?.recentLeaves && (
                        <div>
                          <h6 className="fw-bold text-dark mb-2">Leave History</h6>
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
                                {selectedEmployee.stats.recentLeaves.length > 0 ? (
                                  selectedEmployee.stats.recentLeaves.map((l) => (
                                    <tr key={l._id}>
                                      <td>{l.leaveType}</td>
                                      <td>
                                        {new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}
                                      </td>
                                      <td>{l.reason}</td>
                                      <td>
                                        <span className={`badge-status badge-${l.status.toLowerCase()}`}>
                                          {l.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="4" className="text-center py-2 text-muted">
                                      No leaves recorded.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              <div className="modal-footer border-top px-4 py-3">
                <button
                  type="button"
                  className="btn btn-secondary-custom"
                  onClick={() => setShowProfileModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEmployee && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom px-4 py-3">
                <h5 className="modal-title fw-bold text-danger">Delete Employee Account</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4 text-center">
                <div
                  className="rounded-circle bg-danger bg-opacity-10 text-danger d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: 64, height: 64 }}
                >
                  <MdDelete size={32} />
                </div>
                <h5 className="fw-bold text-dark mb-2">Are you sure?</h5>
                <p className="text-muted mb-0">
                  You are about to delete <strong>{selectedEmployee.name}</strong> ({selectedEmployee.employeeId}).
                  This action will permanently delete their account, attendance logs, and leave records.
                </p>
              </div>
              <div className="modal-footer border-top px-4 py-3">
                <button
                  type="button"
                  className="btn btn-secondary-custom"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                >
                  {submitting ? 'Deleting...' : 'Yes, Delete Employee'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
