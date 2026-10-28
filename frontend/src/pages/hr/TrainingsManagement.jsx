import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  MdSchool,
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdPerson,
  MdEvent,
} from 'react-icons/md';

const TrainingsManagement = () => {
  const [trainings, setTrainings] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    title: '',
    description: '',
    trainer: '',
    startDate: '',
    endDate: '',
    status: 'Upcoming',
    assignedEmployees: [],
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trainings');
      if (res.data.success) {
        setTrainings(res.data.trainings);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Error fetching trainings' });
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      if (res.data.success) {
        setEmployees(res.data.employees);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTrainings();
    fetchEmployees();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData(initialForm);
    setShowModal(true);
  };

  const openEditModal = (t) => {
    setIsEditing(true);
    setSelectedTraining(t);
    setFormData({
      title: t.title || '',
      description: t.description || '',
      trainer: t.trainer || '',
      startDate: t.startDate ? new Date(t.startDate).toISOString().split('T')[0] : '',
      endDate: t.endDate ? new Date(t.endDate).toISOString().split('T')[0] : '',
      status: t.status || 'Upcoming',
      assignedEmployees: t.assignedEmployees?.map((emp) => emp._id || emp) || [],
    });
    setShowModal(true);
  };

  const handleEmployeeToggle = (empId) => {
    const current = [...formData.assignedEmployees];
    const index = current.indexOf(empId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(empId);
    }
    setFormData({ ...formData, assignedEmployees: current });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      if (isEditing) {
        const res = await api.put(`/trainings/${selectedTraining._id}`, formData);
        if (res.data.success) {
          setMessage({ type: 'success', text: 'Training program updated successfully' });
          setShowModal(false);
          fetchTrainings();
        }
      } else {
        const res = await api.post('/trainings', formData);
        if (res.data.success) {
          setMessage({ type: 'success', text: 'New training program created' });
          setShowModal(false);
          fetchTrainings();
        }
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Error saving training program',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this training program?')) return;
    try {
      const res = await api.delete(`/trainings/${id}`);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Training program deleted' });
        fetchTrainings();
      }
    } catch (err) {
      setMessage({ type: 'danger', text: 'Error deleting program' });
    }
  };

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Training & Development Programs</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Coordinate corporate skill workshops, certifications, and employee participation.
          </p>
        </div>
        <button className="btn btn-primary-custom" onClick={openAddModal}>
          <MdAdd size={20} /> Create Training Program
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

      {/* Trainings Grid */}
      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading training programs...</p>
          </div>
        ) : trainings.length > 0 ? (
          trainings.map((t) => (
            <div key={t._id} className="col-md-6 col-xl-4">
              <div className="custom-card h-100 d-flex flex-column">
                <div className="custom-card-header">
                  <span className={`badge-status badge-${t.status.toLowerCase()}`}>
                    {t.status}
                  </span>
                  <div className="btn-group btn-group-sm">
                    <button className="btn btn-link text-secondary p-1" onClick={() => openEditModal(t)}>
                      <MdEdit size={16} />
                    </button>
                    <button className="btn btn-link text-danger p-1" onClick={() => handleDelete(t._id)}>
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
                <div className="custom-card-body flex-grow-1">
                  <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '1.05rem' }}>
                    {t.title}
                  </h5>
                  <p className="text-muted mb-3" style={{ fontSize: '0.85rem' }}>
                    {t.description}
                  </p>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <MdPerson className="text-primary" />
                    <small className="text-dark fw-medium">Trainer: {t.trainer}</small>
                  </div>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <MdEvent className="text-primary" />
                    <small className="text-muted">
                      {new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}
                    </small>
                  </div>

                  <div>
                    <small className="text-muted fw-semibold d-block mb-1">
                      Enrolled ({t.assignedEmployees?.length || 0} Staff):
                    </small>
                    <div className="d-flex gap-1 flex-wrap">
                      {t.assignedEmployees && t.assignedEmployees.length > 0 ? (
                        t.assignedEmployees.map((emp) => (
                          <span key={emp._id || emp} className="badge bg-light text-secondary border">
                            {emp.name || 'Employee'}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>None assigned yet</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="custom-card text-center py-5">
              <MdSchool size={48} className="text-muted mb-2" />
              <h5 className="fw-bold text-secondary">No Training Programs</h5>
              <p className="text-muted mb-3">Create workshops or skill enhancement courses for staff.</p>
              <button className="btn btn-primary-custom" onClick={openAddModal}>
                <MdAdd size={18} /> Add Program
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Training Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom px-4 py-3">
                <h5 className="modal-title fw-bold text-dark">
                  {isEditing ? 'Edit Training Program' : 'Create Training Program'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Program Title *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Trainer / Instructor Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.trainer}
                      onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-4">
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
                    <div className="col-md-4">
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
                    <div className="col-md-4">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Program Status
                      </label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Description & Learning Objectives *
                    </label>
                    <textarea
                      rows="3"
                      className="form-control"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Assign Employees to Program ({formData.assignedEmployees.length} selected)
                    </label>
                    <div
                      className="border rounded-3 p-3 bg-light overflow-auto"
                      style={{ maxHeight: '180px' }}
                    >
                      <div className="row g-2">
                        {employees.map((emp) => {
                          const isChecked = formData.assignedEmployees.includes(emp._id);
                          return (
                            <div key={emp._id} className="col-md-6">
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`emp-${emp._id}`}
                                  checked={isChecked}
                                  onChange={() => handleEmployeeToggle(emp._id)}
                                />
                                <label
                                  className="form-check-label text-truncate"
                                  htmlFor={`emp-${emp._id}`}
                                  style={{ fontSize: '0.85rem' }}
                                >
                                  {emp.name} ({emp.department})
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top px-4 py-3">
                  <button
                    type="button"
                    className="btn btn-secondary-custom"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary-custom"
                  >
                    {submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Program'}
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

export default TrainingsManagement;
