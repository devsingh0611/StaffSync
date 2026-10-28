import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdSchool, MdPerson, MdEvent, MdCheckCircle } from 'react-icons/md';

const MyTrainings = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setLoading(true);
        const res = await api.get('/trainings');
        if (res.data.success) {
          setTrainings(res.data.trainings);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">My Assigned Trainings</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Workshops, skill development, and compliance courses assigned to you.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading training programs...</p>
          </div>
        ) : trainings.length > 0 ? (
          trainings.map((t) => (
            <div key={t._id} className="col-md-6">
              <div className="custom-card h-100 p-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className={`badge-status badge-${t.status.toLowerCase()}`}>
                      {t.status}
                    </span>
                    <small className="text-muted">
                      {new Date(t.startDate).toLocaleDateString()} - {new Date(t.endDate).toLocaleDateString()}
                    </small>
                  </div>

                  <h5 className="fw-bold text-dark mb-2">{t.title}</h5>
                  <p className="text-secondary mb-3" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {t.description}
                  </p>

                  <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-2 mb-3">
                    <MdPerson className="text-primary" size={20} />
                    <span className="text-dark fw-semibold" style={{ fontSize: '0.85rem' }}>
                      Instructor: {t.trainer}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                    Status: <strong className="text-dark">{t.status}</strong>
                  </span>
                  {t.status === 'Completed' ? (
                    <span className="badge bg-success-subtle text-success p-2 d-flex align-items-center gap-1">
                      <MdCheckCircle /> Certificate Eligible
                    </span>
                  ) : (
                    <span className="badge bg-primary-subtle text-primary p-2">In Progress</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="custom-card text-center py-5">
              <MdSchool size={48} className="text-muted mb-2" />
              <h5 className="fw-bold text-secondary">No Assigned Trainings</h5>
              <p className="text-muted mb-0">You currently have no pending workshops or courses.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTrainings;
