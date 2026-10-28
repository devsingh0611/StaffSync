import {
  getMockUsers,
  saveMockUsers,
  getMockLeaves,
  saveMockLeaves,
  getMockAnnouncements,
  saveMockAnnouncements,
  getMockTrainings,
  saveMockTrainings,
  getMockAttendance,
  saveMockAttendance,
} from './mockStore';

export const handleMockRequest = async (config) => {
  const url = (config.url || '').replace(/^\/api/, '');
  const method = (config.method || 'get').toLowerCase();
  let data = {};
  try {
    data = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
  } catch (e) {}

  const params = config.params || {};

  // Get current logged-in user from localStorage
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem('user'));
  } catch (e) {}

  // 1. Auth Handlers
  if (url === '/auth/login' && method === 'post') {
    const users = getMockUsers();
    const user = users.find((u) => u.email.toLowerCase() === (data.email || '').toLowerCase());
    if (!user) {
      return { data: { success: false, message: 'Invalid email or password' }, status: 401 };
    }
    const token = 'mock_jwt_token_' + user._id + '_' + Date.now();
    return {
      data: {
        success: true,
        token,
        user,
        message: `Welcome back, ${user.name}!`,
      },
      status: 200,
    };
  }

  if (url === '/auth/register' && method === 'post') {
    const users = getMockUsers();
    const newEmpId = `EMP-${(users.length + 101).toString().padStart(4, '0')}`;
    const newUser = {
      _id: 'usr_' + Date.now(),
      id: 'usr_' + Date.now(),
      name: data.name,
      email: data.email,
      role: data.role || 'employee',
      department: data.department || 'Engineering',
      designation: data.designation || 'Associate',
      employeeId: newEmpId,
      phone: data.phone || '',
      status: 'Active',
      joiningDate: new Date().toISOString(),
    };
    users.unshift(newUser);
    saveMockUsers(users);
    const token = 'mock_jwt_token_' + newUser._id;
    return {
      data: {
        success: true,
        token,
        user: newUser,
        message: 'Account registered successfully',
      },
      status: 201,
    };
  }

  if (url === '/auth/me') {
    return { data: { success: true, user: currentUser }, status: 200 };
  }

  if (url === '/auth/profile' && method === 'put') {
    const users = getMockUsers();
    const idx = users.findIndex((u) => u._id === currentUser?._id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      saveMockUsers(users);
      currentUser = users[idx];
    }
    return { data: { success: true, user: currentUser, message: 'Profile updated' }, status: 200 };
  }

  if (url === '/auth/password' && method === 'put') {
    return { data: { success: true, message: 'Password changed successfully' }, status: 200 };
  }

  if (url === '/auth/forgot-password') {
    return {
      data: {
        success: true,
        message: `Password reset link sent to ${data.email}. Check your inbox.`,
      },
      status: 200,
    };
  }

  // 2. Dashboard Handlers
  if (url === '/dashboard/hr') {
    const users = getMockUsers();
    const leaves = getMockLeaves();
    const announcements = getMockAnnouncements();
    const attendance = getMockAttendance();

    const totalStaff = users.length;
    const totalEmployees = users.filter((u) => u.role === 'employee').length;
    const totalManagers = users.filter((u) => u.role === 'manager').length;
    const presentToday = attendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
    const pendingLeaves = leaves.filter((l) => l.status === 'Pending').length;
    const approvedLeaves = leaves.filter((l) => l.status === 'Approved').length;

    // Dept distribution
    const deptCounts = {};
    users.forEach((u) => {
      deptCounts[u.department] = (deptCounts[u.department] || 0) + 1;
    });
    const departmentDistribution = Object.keys(deptCounts).map((dept) => ({
      department: dept,
      count: deptCounts[dept],
    }));

    return {
      data: {
        success: true,
        stats: {
          totalStaff,
          totalEmployees,
          totalManagers,
          presentToday,
          absentToday: Math.max(0, totalStaff - presentToday),
          pendingLeaves,
          approvedLeaves,
          departmentDistribution,
          recentLeaves: leaves.slice(0, 5),
          recentAnnouncements: announcements.slice(0, 4),
        },
      },
      status: 200,
    };
  }

  if (url === '/dashboard/manager') {
    const users = getMockUsers();
    const leaves = getMockLeaves();
    const trainings = getMockTrainings();
    const announcements = getMockAnnouncements();

    const teamMembers = users.filter((u) => u.role === 'employee' && u.department === (currentUser?.department || 'Engineering'));
    const teamIds = teamMembers.map((m) => m._id);
    const teamLeavesHistory = leaves.filter((l) => teamIds.includes(l.employeeId?._id));
    const teamPendingLeaves = teamLeavesHistory.filter((l) => l.status === 'Pending').length;

    return {
      data: {
        success: true,
        stats: {
          totalTeamMembers: teamMembers.length,
          teamPresentToday: Math.max(1, teamMembers.length - 1),
          teamAbsentToday: 1,
          teamPendingLeaves,
          teamMembers,
          teamLeavesHistory,
          trainings,
          announcements: announcements.slice(0, 3),
        },
      },
      status: 200,
    };
  }

  if (url === '/dashboard/employee') {
    const leaves = getMockLeaves().filter((l) => l.employeeId?._id === currentUser?._id);
    const trainings = getMockTrainings();
    const announcements = getMockAnnouncements();
    const attendance = getMockAttendance();

    const todayAtt = attendance.find((a) => a.employeeId?._id === currentUser?._id);
    const approvedLeaves = leaves.filter((l) => l.status === 'Approved').length;

    return {
      data: {
        success: true,
        stats: {
          todayAttendance: todayAtt || null,
          isCheckedIn: !!(todayAtt && todayAtt.checkIn),
          isCheckedOut: !!(todayAtt && todayAtt.checkOut),
          monthlyPresentDays: 14,
          pendingLeaves: leaves.filter((l) => l.status === 'Pending').length,
          approvedLeaves,
          leaveBalance: Math.max(0, 18 - approvedLeaves),
          recentLeaves: leaves,
          trainings: trainings.slice(0, 2),
          announcements: announcements.slice(0, 4),
        },
      },
      status: 200,
    };
  }

  // 3. Employees Handlers
  if (url === '/employees/managers/list') {
    const users = getMockUsers();
    const managers = users.filter((u) => u.role === 'manager' || u.role === 'hr');
    return { data: { success: true, managers }, status: 200 };
  }

  if (url.startsWith('/employees') && method === 'get' && !url.includes('/employees/')) {
    let users = getMockUsers();
    if (params.teamOnly === 'true' && currentUser) {
      users = users.filter((u) => u.department === currentUser.department && u.role === 'employee');
    }
    if (params.department && params.department !== 'All') {
      users = users.filter((u) => u.department === params.department);
    }
    if (params.role && params.role !== 'All') {
      users = users.filter((u) => u.role === params.role);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.employeeId && u.employeeId.toLowerCase().includes(q))
      );
    }
    return { data: { success: true, count: users.length, employees: users }, status: 200 };
  }

  if (url.startsWith('/employees/') && method === 'get') {
    const id = url.split('/')[2];
    const users = getMockUsers();
    const emp = users.find((u) => u._id === id || u.id === id);
    return { data: { success: true, employee: emp || users[0], stats: { recentLeaves: [] } }, status: 200 };
  }

  if (url === '/employees' && method === 'post') {
    const users = getMockUsers();
    const emp = {
      _id: 'usr_' + Date.now(),
      id: 'usr_' + Date.now(),
      ...data,
      employeeId: data.employeeId || `EMP-${(users.length + 101).toString().padStart(4, '0')}`,
      status: data.status || 'Active',
      joiningDate: new Date().toISOString(),
    };
    users.unshift(emp);
    saveMockUsers(users);
    return { data: { success: true, employee: emp, message: 'Employee added' }, status: 201 };
  }

  if (url.startsWith('/employees/') && method === 'put') {
    const id = url.split('/')[2];
    const users = getMockUsers();
    const idx = users.findIndex((u) => u._id === id || u.id === id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data };
      saveMockUsers(users);
      return { data: { success: true, employee: users[idx], message: 'Employee updated' }, status: 200 };
    }
  }

  if (url.startsWith('/employees/') && method === 'delete') {
    const id = url.split('/')[2];
    let users = getMockUsers();
    users = users.filter((u) => u._id !== id && u.id !== id);
    saveMockUsers(users);
    return { data: { success: true, message: 'Employee deleted' }, status: 200 };
  }

  // 4. Leaves Handlers
  if (url === '/leaves/my-leaves') {
    const leaves = getMockLeaves().filter((l) => l.employeeId?._id === currentUser?._id);
    return { data: { success: true, count: leaves.length, leaves }, status: 200 };
  }

  if (url.startsWith('/leaves') && method === 'get') {
    let leaves = getMockLeaves();
    if (params.status && params.status !== 'All') {
      leaves = leaves.filter((l) => l.status === params.status);
    }
    return { data: { success: true, count: leaves.length, leaves }, status: 200 };
  }

  if (url === '/leaves' && method === 'post') {
    const leaves = getMockLeaves();
    const newLeave = {
      _id: 'lv_' + Date.now(),
      employeeId: currentUser || { name: 'Staff Member', employeeId: 'EMP-1004' },
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      status: 'Pending',
      appliedDate: new Date().toISOString(),
      remarks: '',
    };
    leaves.unshift(newLeave);
    saveMockLeaves(leaves);
    return { data: { success: true, leave: newLeave, message: 'Leave submitted' }, status: 201 };
  }

  if (url.includes('/status') && method === 'put') {
    const id = url.split('/')[2];
    const leaves = getMockLeaves();
    const idx = leaves.findIndex((l) => l._id === id);
    if (idx !== -1) {
      leaves[idx].status = data.status;
      leaves[idx].remarks = data.remarks || '';
      saveMockLeaves(leaves);
      return { data: { success: true, leave: leaves[idx], message: `Leave ${data.status}` }, status: 200 };
    }
  }

  if (url.includes('/cancel') && method === 'put') {
    const id = url.split('/')[2];
    const leaves = getMockLeaves();
    const idx = leaves.findIndex((l) => l._id === id);
    if (idx !== -1) {
      leaves[idx].status = 'Cancelled';
      saveMockLeaves(leaves);
      return { data: { success: true, message: 'Leave cancelled' }, status: 200 };
    }
  }

  // 5. Attendance Handlers
  if (url === '/attendance/today') {
    const att = getMockAttendance();
    const userAtt = att.find((a) => a.employeeId?._id === currentUser?._id);
    return {
      data: {
        success: true,
        attendance: userAtt || null,
        isCheckedIn: !!(userAtt && userAtt.checkIn),
        isCheckedOut: !!(userAtt && userAtt.checkOut),
      },
      status: 200,
    };
  }

  if (url === '/attendance/my-history') {
    const att = getMockAttendance().filter((a) => a.employeeId?._id === currentUser?._id);
    return {
      data: {
        success: true,
        stats: { presentDays: att.length || 1, totalHours: 8.5, averageHours: 8.5 },
        records: att,
      },
      status: 200,
    };
  }

  if (url === '/attendance/check-in' && method === 'post') {
    const att = getMockAttendance();
    const todayStr = new Date().toISOString().split('T')[0];
    const newRecord = {
      _id: 'att_' + Date.now(),
      employeeId: currentUser || { name: 'Staff Member', employeeId: 'EMP-1004' },
      date: new Date(todayStr).toISOString(),
      checkIn: new Date().toISOString(),
      checkOut: null,
      status: 'Present',
      totalWorkingHours: 0,
      notes: 'On-time check in',
    };
    att.unshift(newRecord);
    saveMockAttendance(att);
    return { data: { success: true, attendance: newRecord, message: 'Check-in successful!' }, status: 200 };
  }

  if (url === '/attendance/check-out' && method === 'post') {
    const att = getMockAttendance();
    const userAtt = att.find((a) => a.employeeId?._id === currentUser?._id && !a.checkOut);
    if (userAtt) {
      userAtt.checkOut = new Date().toISOString();
      userAtt.totalWorkingHours = 8.2;
      saveMockAttendance(att);
    }
    return { data: { success: true, message: 'Check-out successful! Total: 8.2 hrs' }, status: 200 };
  }

  if (url.startsWith('/attendance') && method === 'get') {
    const att = getMockAttendance();
    return { data: { success: true, records: att }, status: 200 };
  }

  if (url === '/attendance/manual' && method === 'post') {
    const att = getMockAttendance();
    const users = getMockUsers();
    const emp = users.find((u) => u._id === data.employeeId) || { name: 'Employee' };
    const rec = {
      _id: 'att_' + Date.now(),
      employeeId: emp,
      date: new Date(data.date).toISOString(),
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: data.status || 'Present',
      totalWorkingHours: data.totalWorkingHours || 8,
      notes: data.notes || 'Admin adjustment',
    };
    att.unshift(rec);
    saveMockAttendance(att);
    return { data: { success: true, message: 'Attendance updated' }, status: 200 };
  }

  // 6. Announcements Handlers
  if (url.startsWith('/announcements') && method === 'get') {
    const ann = getMockAnnouncements();
    return { data: { success: true, count: ann.length, announcements: ann }, status: 200 };
  }

  if (url === '/announcements' && method === 'post') {
    const ann = getMockAnnouncements();
    const item = {
      _id: 'ann_' + Date.now(),
      title: data.title,
      description: data.description,
      priority: data.priority || 'Medium',
      department: data.department || 'All',
      createdDate: new Date().toISOString(),
      createdBy: currentUser || { name: 'HR Admin', role: 'hr' },
    };
    ann.unshift(item);
    saveMockAnnouncements(ann);
    return { data: { success: true, announcement: item, message: 'Announcement published' }, status: 201 };
  }

  if (url.startsWith('/announcements/') && method === 'put') {
    const id = url.split('/')[2];
    const ann = getMockAnnouncements();
    const idx = ann.findIndex((a) => a._id === id);
    if (idx !== -1) {
      ann[idx] = { ...ann[idx], ...data };
      saveMockAnnouncements(ann);
      return { data: { success: true, announcement: ann[idx], message: 'Announcement updated' }, status: 200 };
    }
  }

  if (url.startsWith('/announcements/') && method === 'delete') {
    const id = url.split('/')[2];
    let ann = getMockAnnouncements();
    ann = ann.filter((a) => a._id !== id);
    saveMockAnnouncements(ann);
    return { data: { success: true, message: 'Announcement deleted' }, status: 200 };
  }

  // 7. Trainings Handlers
  if (url.startsWith('/trainings') && method === 'get') {
    const tr = getMockTrainings();
    return { data: { success: true, count: tr.length, trainings: tr }, status: 200 };
  }

  if (url === '/trainings' && method === 'post') {
    const tr = getMockTrainings();
    const item = {
      _id: 'tr_' + Date.now(),
      title: data.title,
      description: data.description,
      trainer: data.trainer,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status || 'Upcoming',
      assignedEmployees: [],
    };
    tr.unshift(item);
    saveMockTrainings(tr);
    return { data: { success: true, training: item, message: 'Training created' }, status: 201 };
  }

  if (url.startsWith('/trainings/') && method === 'put') {
    const id = url.split('/')[2];
    const tr = getMockTrainings();
    const idx = tr.findIndex((t) => t._id === id);
    if (idx !== -1) {
      tr[idx] = { ...tr[idx], ...data };
      saveMockTrainings(tr);
      return { data: { success: true, training: tr[idx], message: 'Training updated' }, status: 200 };
    }
  }

  if (url.startsWith('/trainings/') && method === 'delete') {
    const id = url.split('/')[2];
    let tr = getMockTrainings();
    tr = tr.filter((t) => t._id !== id);
    saveMockTrainings(tr);
    return { data: { success: true, message: 'Training deleted' }, status: 200 };
  }

  return { data: { success: true }, status: 200 };
};
