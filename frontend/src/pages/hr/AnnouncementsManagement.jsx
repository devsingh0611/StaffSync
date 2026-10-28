import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  MdCampaign,
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdCheckCircle,
} from 'react-icons/md';

const AnnouncementsManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  const initialForm = {
    title: '',
    description: '',
    priority: 'Medium',
    department: 'All',
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/announcements');
      if (res.data.success) {
        setAnnouncements(res.data.announcements);
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'danger', text: 'Error fetching announcements' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData(initialForm);
    setShowModal(true);
  };

  const openEditModal = (ann) => {
    setIsEditing(true);
    setSelectedAnnouncement(ann);
    setFormData({
      title: ann.title || '',
      description: ann.description || '',
      priority: ann.priority || 'Medium',
      department: ann.department || 'All',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      if (isEditing) {
        const res = await api.put(`/announcements/${selectedAnnouncement._id}`, formData);
        if (res.data.success) {
          setMessage({ type: 'success', text: 'Announcement updated successfully' });
          setShowModal(false);
          fetchAnnouncements();
        }
      } else {
        const res = await api.post('/announcements', formData);
        if (res.data.success) {
          setMessage({ type: 'success', text: 'Announcement published to staff' });
          setShowModal(false);
          fetchAnnouncements();
        }
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Error saving announcement',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this announcement?')) return;
    try {
      const res = await api.delete(`/announcements/${id}`);
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Announcement removed' });
        fetchAnnouncements();
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Error removing announcement',
      });
    }
  };

  return (
    <div>
      {/* Title & Create Button */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Company Announcements</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Publish corporate news, policy changes, and events to all employees.
          </p>
        </div>
        <button className="btn btn-primary-custom" onClick={openAddModal}>
          <MdAdd size={20} /> New Announcement
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

      {/* Announcements List */}
      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading announcements...</p>
          </div>
        ) : announcements.length > 0 ? (
          announcements.map((ann) => (
            <div key={ann._id} className="col-md-6 col-xl-4">
              <div className="custom-card h-100 d-flex flex-column">
                <div className="custom-card-header">
                  <span className={`badge badge-${ann.priority.toLowerCase()}`} style={{ fontSize: '0.72rem' }}>
                    {ann.priority} Priority
                  </span>
                  <div className="btn-group btn-group-sm">
                    <button
                      className="btn btn-link text-secondary p-1"
                      title="Edit"
                      onClick={() => openEditModal(ann)}
                    >
                      <MdEdit size={16} />
                    </button>
                    <button
                      className="btn btn-link text-danger p-1"
                      title="Delete"
                      onClick={() => handleDelete(ann._id)}
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
                <div className="custom-card-body flex-grow-1">
                  <h5 className="fw-bold text-dark mb-2" style={{ fontSize: '1.05rem' }}>
                    {ann.title}
                  </h5>
                  <p className="text-secondary mb-3" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {ann.description}
                  </p>
                </div>
                <div className="px-4 py-3 bg-light border-top d-flex justify-content-between align-items-center rounded-bottom">
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Target: <strong>{ann.department}</strong>
                  </small>
                  <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {new Date(ann.createdDate).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="custom-card text-center py-5">
              <MdCampaign size={48} className="text-muted mb-2" />
              <h5 className="fw-bold text-secondary">No Announcements Published</h5>
              <p className="text-muted mb-3">Keep employees informed by publishing the first company announcement.</p>
              <button className="btn btn-primary-custom" onClick={openAddModal}>
                <MdAdd size={18} /> Create Announcement
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Announcement Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom px-4 py-3">
                <h5 className="modal-title fw-bold text-dark">
                  {isEditing ? 'Edit Announcement' : 'Publish Announcement'}
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
                      Announcement Title *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Q4 Company All-Hands Meeting"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Priority Level
                      </label>
                      <select
                        className="form-select"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                        Target Audience
                      </label>
                      <select
                        className="form-select"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Detailed Content *
                    </label>
                    <textarea
                      rows="4"
                      className="form-control"
                      placeholder="Write message content for employees..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    ></textarea>
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
                    {submitting ? 'Publishing...' : isEditing ? 'Update Announcement' : 'Publish Announcement'}
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

export default AnnouncementsManagement;
