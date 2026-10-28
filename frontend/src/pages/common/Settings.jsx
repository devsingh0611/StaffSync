import React, { useState } from 'react';
import { MdSettings, MdNotifications, MdSecurity, MdPalette, MdCheckCircle } from 'react-icons/md';

const Settings = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [leaveAlerts, setLeaveAlerts] = useState(true);
  const [trainingAlerts, setTrainingAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">System & User Settings</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Configure application preferences, notification thresholds, and security parameters.
          </p>
        </div>
      </div>

      {saved && (
        <div className="alert alert-success py-2 px-3 rounded-3 mb-4 d-flex align-items-center gap-2">
          <MdCheckCircle size={20} /> Settings preferences saved successfully!
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Notification Preferences */}
          <div className="custom-card mb-4">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                <MdNotifications className="text-primary me-2" size={20} /> Notification Preferences
              </h5>
            </div>
            <div className="custom-card-body">
              <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                  <h6 className="fw-semibold text-dark mb-1">Company Announcements</h6>
                  <small className="text-muted">Receive email digests for company-wide news and bulletins</small>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                  <h6 className="fw-semibold text-dark mb-1">Leave Application Status Alerts</h6>
                  <small className="text-muted">Instant alert when leaves are submitted, approved, or rejected</small>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={leaveAlerts}
                    onChange={(e) => setLeaveAlerts(e.target.checked)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center py-2">
                <div>
                  <h6 className="fw-semibold text-dark mb-1">Training Program Updates</h6>
                  <small className="text-muted">Reminders for upcoming workshops and certification deadlines</small>
                </div>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={trainingAlerts}
                    onChange={(e) => setTrainingAlerts(e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* System & Architecture Info */}
          <div className="custom-card">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                <MdSecurity className="text-primary me-2" size={20} /> Application Architecture & Deployment Info
              </h5>
            </div>
            <div className="custom-card-body">
              <div className="row g-3">
                <div className="col-sm-6">
                  <small className="text-muted d-block">Platform Name</small>
                  <span className="fw-semibold text-dark">StaffSync HRMS Enterprise</span>
                </div>
                <div className="col-sm-6">
                  <small className="text-muted d-block">Software Version</small>
                  <span className="fw-semibold text-dark">v1.0.0 (Production Release)</span>
                </div>
                <div className="col-sm-6">
                  <small className="text-muted d-block">Frontend Architecture</small>
                  <span className="fw-semibold text-dark">React.js, Vite, Bootstrap 5, Axios, Recharts</span>
                </div>
                <div className="col-sm-6">
                  <small className="text-muted d-block">Backend Architecture</small>
                  <span className="fw-semibold text-dark">Node.js, Express.js REST APIs, JWT, bcrypt.js</span>
                </div>
                <div className="col-sm-6">
                  <small className="text-muted d-block">Database Engine</small>
                  <span className="fw-semibold text-dark">MongoDB / Mongoose ODM</span>
                </div>
                <div className="col-sm-6">
                  <small className="text-muted d-block">Authentication Protocol</small>
                  <span className="fw-semibold text-dark">Stateless JSON Web Tokens (Bearer Auth)</span>
                </div>
              </div>

              <div className="mt-4 text-end">
                <button className="btn btn-primary-custom" onClick={handleSave}>
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
