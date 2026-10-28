import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { MdPeople, MdEmail, MdPhone, MdLocationOn, MdDateRange, MdVisibility, MdClose } from 'react-icons/md';

const TeamMembers = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res = await api.get('/employees?teamOnly=true');
      if (res.data.success) {
        setTeam(res.data.employees);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openMemberProfile = async (member) => {
    try {
      const res = await api.get(`/employees/${member._id}`);
      if (res.data.success) {
        setSelectedMember(res.data);
      } else {
        setSelectedMember({ employee: member });
      }
    } catch (err) {
      setSelectedMember({ employee: member });
    }
    setShowProfile(!showProfile);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-1">Assigned Team Members</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Direct reports assigned under your supervision and management.
          </p>
        </div>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p className="text-muted mt-2">Loading team members...</p>
          </div>
        ) : team.length > 0 ? (
          team.map((member) => (
            <div key={member._id} className="col-md-6 col-xl-4">
              <div className="custom-card h-100 p-4 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div
                      className="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center"
                      style={{ width: 48, height: 48, fontSize: '1.1rem' }}
                    >
                      {member.name ? member.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="badge bg-light text-secondary border font-monospace">
                      {member.employeeId}
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-1">{member.name}</h5>
                  <p className="text-primary fw-semibold mb-3" style={{ fontSize: '0.85rem' }}>
                    {member.designation} • {member.department}
                  </p>

                  <div className="d-flex flex-column gap-2 mb-3">
                    <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.825rem' }}>
                      <MdEmail /> <span className="text-truncate">{member.email}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.825rem' }}>
                      <MdPhone /> <span>{member.phone || 'No phone provided'}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.825rem' }}>
                      <MdDateRange /> <span>Joined {new Date(member.joiningDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-secondary-custom w-100 justify-content-center mt-2"
                  onClick={() => openMemberProfile(member)}
                >
                  <MdVisibility className="me-1" /> View Full Profile
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="custom-card text-center py-5">
              <MdPeople size={48} className="text-muted mb-2" />
              <h5 className="fw-bold text-secondary">No Team Members Assigned</h5>
              <p className="text-muted mb-0">Ask your HR Administrator to assign employees to your team.</p>
            </div>
          </div>
        )}
      </div>

      {/* Member Profile Modal */}
      {showProfile && selectedMember && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-bottom px-4 py-3">
                <h5 className="modal-title fw-bold text-dark">
                  Team Member: {selectedMember.employee?.name || selectedMember.name}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowProfile(false)}></button>
              </div>
              <div className="modal-body p-4">
                {(() => {
                  const emp = selectedMember.employee || selectedMember;
                  return (
                    <div>
                      <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-3 mb-4">
                        <div
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: 50, height: 50, fontSize: '1.25rem' }}
                        >
                          {emp.name[0].toUpperCase()}
                        </div>
                        <div>
                          <h5 className="fw-bold mb-1 text-dark">{emp.name}</h5>
                          <span className="badge bg-primary-subtle text-primary me-2">{emp.designation}</span>
                          <span className="badge bg-light text-dark border">{emp.employeeId}</span>
                        </div>
                      </div>

                      <div className="row g-3 mb-4">
                        <div className="col-sm-6">
                          <small className="text-muted d-block">Work Email</small>
                          <span className="fw-semibold text-dark">{emp.email}</span>
                        </div>
                        <div className="col-sm-6">
                          <small className="text-muted d-block">Phone Number</small>
                          <span className="fw-semibold text-dark">{emp.phone || 'N/A'}</span>
                        </div>
                        <div className="col-sm-6">
                          <small className="text-muted d-block">Department</small>
                          <span className="fw-semibold text-dark">{emp.department}</span>
                        </div>
                        <div className="col-sm-6">
                          <small className="text-muted d-block">Joining Date</small>
                          <span className="fw-semibold text-dark">
                            {new Date(emp.joiningDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="col-12">
                          <small className="text-muted d-block">Address</small>
                          <span className="fw-semibold text-dark">{emp.address || 'N/A'}</span>
                        </div>
                      </div>

                      {selectedMember.stats?.recentLeaves && (
                        <div>
                          <h6 className="fw-bold text-dark mb-2">Recent Leave Applications</h6>
                          <div className="table-responsive">
                            <table className="custom-table mb-0">
                              <thead>
                                <tr>
                                  <th>Type</th>
                                  <th>Dates</th>
                                  <th>Reason</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedMember.stats.recentLeaves.map((l) => (
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
                                ))}
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
                <button className="btn btn-secondary-custom" onClick={() => setShowProfile(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
