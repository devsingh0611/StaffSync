import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdDashboard,
  MdPeople,
  MdEventBusy,
  MdAccessTime,
  MdCampaign,
  MdSchool,
  MdPerson,
  MdSettings,
  MdExitToApp,
  MdMenu,
  MdClose,
  MdCheckCircle,
} from 'react-icons/md';
import { HiOutlineSparkles } from 'react-icons/hi';

const DashboardLayout = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Build navigation items based on user role
  const getNavLinks = () => {
    if (role === 'hr') {
      return [
        { to: '/hr/dashboard', label: 'HR Dashboard', icon: <MdDashboard size={20} /> },
        { to: '/hr/employees', label: 'Employees', icon: <MdPeople size={20} /> },
        { to: '/hr/leaves', label: 'Leave Requests', icon: <MdEventBusy size={20} /> },
        { to: '/hr/attendance', label: 'Attendance Monitor', icon: <MdAccessTime size={20} /> },
        { to: '/hr/announcements', label: 'Announcements', icon: <MdCampaign size={20} /> },
        { to: '/hr/trainings', label: 'Trainings', icon: <MdSchool size={20} /> },
      ];
    } else if (role === 'manager') {
      return [
        { to: '/manager/dashboard', label: 'Manager Dashboard', icon: <MdDashboard size={20} /> },
        { to: '/manager/team', label: 'Team Members', icon: <MdPeople size={20} /> },
        { to: '/manager/leaves', label: 'Team Leaves', icon: <MdEventBusy size={20} /> },
        { to: '/manager/attendance', label: 'Team Attendance', icon: <MdAccessTime size={20} /> },
        { to: '/manager/trainings', label: 'Training Programs', icon: <MdSchool size={20} /> },
      ];
    } else {
      return [
        { to: '/employee/dashboard', label: 'My Dashboard', icon: <MdDashboard size={20} /> },
        { to: '/employee/leaves', label: 'Apply Leave', icon: <MdEventBusy size={20} /> },
        { to: '/employee/attendance', label: 'My Attendance', icon: <MdAccessTime size={20} /> },
        { to: '/employee/trainings', label: 'My Trainings', icon: <MdSchool size={20} /> },
        { to: '/employee/announcements', label: 'Announcements', icon: <MdCampaign size={20} /> },
      ];
    }
  };

  const navLinks = getNavLinks();

  const getRoleBadgeClass = () => {
    if (role === 'hr') return 'bg-danger-subtle text-danger border border-danger-subtle';
    if (role === 'manager') return 'bg-primary-subtle text-primary border border-primary-subtle';
    return 'bg-success-subtle text-success border border-success-subtle';
  };

  const getRoleDisplayName = () => {
    if (role === 'hr') return 'HR Administrator';
    if (role === 'manager') return 'Team Manager';
    return 'Employee';
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar Overlay for Mobile */}
      {mobileOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-lg-none"
          style={{ zIndex: 998 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center text-white"
            style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)' }}
          >
            <HiOutlineSparkles size={22} />
          </div>
          <div>
            <span className="d-block text-white" style={{ fontSize: '1.15rem', lineHeight: 1.2 }}>
              Staff<span style={{ color: '#60a5fa' }}>Sync</span>
            </span>
            <small className="text-secondary text-uppercase fw-semibold" style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}>
              HRMS Platform
            </small>
          </div>
          <button
            className="btn btn-sm btn-link text-white ms-auto d-lg-none"
            onClick={() => setMobileOpen(false)}
          >
            <MdClose size={22} />
          </button>
        </div>

        {/* Current User Role Pill */}
        <div className="px-3 py-2 border-bottom border-dark border-opacity-50">
          <div className="d-flex align-items-center justify-content-between p-2 rounded-2" style={{ backgroundColor: '#1e293b' }}>
            <div className="d-flex align-items-center gap-2 overflow-hidden">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                style={{ width: 28, height: 28, fontSize: '0.8rem', backgroundColor: '#3b82f6' }}
              >
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <span className="d-block text-white text-truncate fw-semibold" style={{ fontSize: '0.825rem' }}>
                  {user?.name}
                </span>
                <span className="text-muted d-block text-truncate" style={{ fontSize: '0.7rem' }}>
                  {getRoleDisplayName()}
                </span>
              </div>
            </div>
            <span className={`badge ${getRoleBadgeClass()}`} style={{ fontSize: '0.65rem' }}>
              {role?.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="sidebar-menu">
          <div className="px-3 pb-2 text-uppercase text-secondary fw-semibold" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
            Main Menu
          </div>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}

          <div className="px-3 pt-3 pb-2 text-uppercase text-secondary fw-semibold" style={{ fontSize: '0.68rem', letterSpacing: '0.08em' }}>
            User Settings
          </div>
          <NavLink
            to="/profile"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <MdPerson size={20} />
            <span>My Profile</span>
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <MdSettings size={20} />
            <span>Settings</span>
          </NavLink>
        </div>

        {/* Logout bottom button */}
        <div className="p-3 border-top border-dark border-opacity-50">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2"
            style={{ borderRadius: 8, fontSize: '0.875rem' }}
          >
            <MdExitToApp size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="main-wrapper flex-grow-1">
        {/* Top Navbar */}
        <header className="top-navbar">
          <div className="d-flex align-items-center gap-3">
            <button
              className="btn btn-link text-dark p-0 d-lg-none"
              onClick={() => setMobileOpen(true)}
            >
              <MdMenu size={26} />
            </button>
            <div>
              <span className="text-muted d-none d-sm-inline" style={{ fontSize: '0.8rem' }}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-md-flex align-items-center gap-2 bg-light px-3 py-1 rounded-pill border">
              <span className="badge rounded-circle bg-success p-1"></span>
              <small className="text-secondary fw-medium">
                {user?.department} • {user?.employeeId || 'Staff'}
              </small>
            </div>

            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: 36, height: 36, fontSize: '0.9rem' }}
              >
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="d-none d-md-block text-start">
                <span className="d-block fw-semibold" style={{ fontSize: '0.875rem', lineHeight: 1.2 }}>
                  {user?.name}
                </span>
                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                  {user?.designation || getRoleDisplayName()}
                </small>
              </div>
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="content-container">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="px-4 py-3 bg-white border-top text-center text-muted" style={{ fontSize: '0.8rem' }}>
          <span>StaffSync © {new Date().getFullYear()} – Modern Human Resource Management System. All rights reserved.</span>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
