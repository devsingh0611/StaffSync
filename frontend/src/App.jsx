import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// HR Pages
import HRDashboard from './pages/hr/HRDashboard';
import EmployeeManagement from './pages/hr/EmployeeManagement';
import LeaveManagement from './pages/hr/LeaveManagement';
import AttendanceManagement from './pages/hr/AttendanceManagement';
import AnnouncementsManagement from './pages/hr/AnnouncementsManagement';
import TrainingsManagement from './pages/hr/TrainingsManagement';

// Manager Pages
import ManagerDashboard from './pages/manager/ManagerDashboard';
import TeamMembers from './pages/manager/TeamMembers';
import TeamLeaves from './pages/manager/TeamLeaves';
import TeamAttendance from './pages/manager/TeamAttendance';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import ApplyLeave from './pages/employee/ApplyLeave';
import MyAttendance from './pages/employee/MyAttendance';
import MyTrainings from './pages/employee/MyTrainings';
import AnnouncementsView from './pages/employee/AnnouncementsView';

// Common Pages
import MyProfile from './pages/common/MyProfile';
import Settings from './pages/common/Settings';
import NotFound from './pages/NotFound';

// Root Redirect Component
const RootRedirect = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'hr') return <Navigate to="/hr/dashboard" replace />;
  if (role === 'manager') return <Navigate to="/manager/dashboard" replace />;
  return <Navigate to="/employee/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Root Redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Protected Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* HR Routes */}
            <Route
              path="/hr/dashboard"
              element={
                <ProtectedRoute allowedRoles={['hr']}>
                  <HRDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/employees"
              element={
                <ProtectedRoute allowedRoles={['hr']}>
                  <EmployeeManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/leaves"
              element={
                <ProtectedRoute allowedRoles={['hr']}>
                  <LeaveManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/attendance"
              element={
                <ProtectedRoute allowedRoles={['hr']}>
                  <AttendanceManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/announcements"
              element={
                <ProtectedRoute allowedRoles={['hr']}>
                  <AnnouncementsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hr/trainings"
              element={
                <ProtectedRoute allowedRoles={['hr']}>
                  <TrainingsManagement />
                </ProtectedRoute>
              }
            />

            {/* Manager Routes */}
            <Route
              path="/manager/dashboard"
              element={
                <ProtectedRoute allowedRoles={['manager', 'hr']}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/team"
              element={
                <ProtectedRoute allowedRoles={['manager', 'hr']}>
                  <TeamMembers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/leaves"
              element={
                <ProtectedRoute allowedRoles={['manager', 'hr']}>
                  <TeamLeaves />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/attendance"
              element={
                <ProtectedRoute allowedRoles={['manager', 'hr']}>
                  <TeamAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager/trainings"
              element={
                <ProtectedRoute allowedRoles={['manager', 'hr']}>
                  <TrainingsManagement />
                </ProtectedRoute>
              }
            />

            {/* Employee Routes */}
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute allowedRoles={['employee', 'manager', 'hr']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/leaves"
              element={
                <ProtectedRoute allowedRoles={['employee', 'manager', 'hr']}>
                  <ApplyLeave />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/attendance"
              element={
                <ProtectedRoute allowedRoles={['employee', 'manager', 'hr']}>
                  <MyAttendance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/trainings"
              element={
                <ProtectedRoute allowedRoles={['employee', 'manager', 'hr']}>
                  <MyTrainings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/announcements"
              element={
                <ProtectedRoute allowedRoles={['employee', 'manager', 'hr']}>
                  <AnnouncementsView />
                </ProtectedRoute>
              }
            />

            {/* Shared Profile & Settings */}
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
