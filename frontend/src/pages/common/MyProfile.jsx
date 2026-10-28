import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdWork,
  MdDateRange,
  MdLock,
  MdCheckCircle,
  MdClose,
} from 'react-icons/md';

const MyProfile = () => {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    designation: '',
    employeeId: '',
    joiningDate: '',
    manager: null,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        department: user.department || '',
        designation: user.designation || '',
        employeeId: user.employeeId || '',
        joiningDate: user.joiningDate || '',
        manager: user.manager || user.managerId || null,
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
      });
      if (res.success) {
        setMessage({ type: 'success', text: 'Profile information updated successfully!' });
      } else {
        setMessage({ type: 'danger', text: res.message || 'Error updating profile' });
      }
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Error updating profile details',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({ type: 'danger', text: 'New passwords do not match' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({ type: 'danger', text: 'New password must be at least 6 characters' });
      return;
    }

    try {
      setSavingPassword(true);
      const res = await api.put('/auth/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (res.data.success) {
        setPasswordMessage({ type: 'success', text: 'Password successfully changed!' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPasswordMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Error changing password. Verify current password.',
      });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">My Staff Profile</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            View your employee credentials, update contact information, and manage security.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Profile Card */}
        <div className="col-lg-4">
          <div className="custom-card p-4 text-center mb-4">
            <div
              className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center fw-bold shadow-sm mb-3"
              style={{ width: 84, height: 84, fontSize: '2rem' }}
            >
              {profileData.name ? profileData.name[0].toUpperCase() : 'U'}
            </div>
            <h4 className="fw-bold text-dark mb-1">{profileData.name}</h4>
            <p className="text-primary fw-semibold mb-2" style={{ fontSize: '0.9rem' }}>
              {profileData.designation}
            </p>
            <div className="d-flex justify-content-center gap-2 mb-3">
              <span className="badge bg-secondary-subtle text-secondary">{profileData.department}</span>
              <span className="badge bg-light text-dark border font-monospace">{profileData.employeeId}</span>
            </div>

            <div className="p-3 bg-light rounded-3 text-start mt-3">
              <small className="text-muted d-block mb-1">Reports To:</small>
              <span className="fw-semibold text-dark d-block">
                {profileData.manager?.name || 'HR Executive Direct'}
              </span>
              <small className="text-muted d-block mt-2 mb-1">Date Joined:</small>
              <span className="fw-semibold text-dark d-block">
                {profileData.joiningDate ? new Date(profileData.joiningDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Update Profile & Change Password Tabs */}
        <div className="col-lg-8">
          {/* Contact Details Card */}
          <div className="custom-card mb-4">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                Contact & Personal Information
              </h5>
            </div>
            <div className="custom-card-body">
              {message.text && (
                <div className={`alert alert-${message.type} py-2 px-3 rounded-3 mb-3 d-flex justify-content-between align-items-center`}>
                  <span>{message.text}</span>
                  <button className="btn btn-sm btn-link text-dark p-0" onClick={() => setMessage({ type: '', text: '' })}>
                    <MdClose />
                  </button>
                </div>
              )}

              <form onSubmit={handleProfileSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Work Email (Read Only)
                    </label>
                    <input
                      type="email"
                      className="form-control bg-light"
                      value={profileData.email}
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="+1 (555) 000-0000"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Residential Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Street, City, State"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mt-4 text-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn btn-primary-custom"
                  >
                    {savingProfile ? 'Saving...' : 'Update Profile Info'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="custom-card">
            <div className="custom-card-header">
              <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1rem' }}>
                Account Security & Password
              </h5>
            </div>
            <div className="custom-card-body">
              {passwordMessage.text && (
                <div className={`alert alert-${passwordMessage.type} py-2 px-3 rounded-3 mb-3 d-flex justify-content-between align-items-center`}>
                  <span>{passwordMessage.text}</span>
                  <button className="btn btn-sm btn-link text-dark p-0" onClick={() => setPasswordMessage({ type: '', text: '' })}>
                    <MdClose />
                  </button>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-secondary" style={{ fontSize: '0.85rem' }}>
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mt-4 text-end">
                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="btn btn-secondary-custom"
                  >
                    {savingPassword ? 'Updating...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
