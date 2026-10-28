import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdCampaign, MdPriorityHigh, MdInfo } from 'react-icons/md';

const AnnouncementsView = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const res = await api.get('/announcements');
        if (res.data.success) {
          setAnnouncements(res.data.announcements);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Company Announcements</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Official notices, operational bulletins, and company-wide news.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading announcements...</p>
          </div>
        ) : announcements.length > 0 ? (
          announcements.map((ann) => (
            <div key={ann._id} className="col-md-6">
              <div className="custom-card h-100 p-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className={`badge badge-${ann.priority.toLowerCase()}`} style={{ fontSize: '0.72rem' }}>
                      {ann.priority} Priority
                    </span>
                    <small className="text-muted">
                      {new Date(ann.createdDate).toLocaleDateString()}
                    </small>
                  </div>

                  <h5 className="fw-bold text-dark mb-2">{ann.title}</h5>
                  <p className="text-secondary mb-3" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {ann.description}
                  </p>
                </div>

                <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    Published by: <strong>{ann.createdBy?.name || 'HR Management'}</strong>
                  </small>
                  <span className="badge bg-light text-secondary border">
                    Dept: {ann.department}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="custom-card text-center py-5">
              <MdCampaign size={48} className="text-muted mb-2" />
              <h5 className="fw-bold text-secondary">No Announcements</h5>
              <p className="text-muted mb-0">No new company announcements at this time.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsView;
