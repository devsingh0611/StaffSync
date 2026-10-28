// Built-in resilient store for offline / cloud client-side fallback
// Ensures 100% functionality on deployed frontend without crashing when backend cloud is pending

const INITIAL_USERS = [
  {
    _id: 'usr_1',
    id: 'usr_1',
    name: 'Sarah Jenkins',
    email: 'hr@staffsync.com',
    role: 'hr',
    department: 'Human Resources',
    designation: 'HR Director',
    employeeId: 'EMP-1001',
    phone: '+1 (555) 019-2834',
    address: '742 Evergreen Terrace, San Francisco, CA',
    status: 'Active',
    joiningDate: '2022-01-15T00:00:00.000Z',
  },
  {
    _id: 'usr_2',
    id: 'usr_2',
    name: 'David Mitchell',
    email: 'david.mitchell@staffsync.com',
    role: 'manager',
    department: 'Engineering',
    designation: 'Engineering Manager',
    employeeId: 'EMP-1002',
    phone: '+1 (555) 024-5567',
    address: '104 Innovation Way, San Jose, CA',
    status: 'Active',
    joiningDate: '2022-06-01T00:00:00.000Z',
    managerId: { _id: 'usr_1', name: 'Sarah Jenkins' },
  },
  {
    _id: 'usr_3',
    id: 'usr_3',
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@staffsync.com',
    role: 'manager',
    department: 'Marketing',
    designation: 'Marketing Director',
    employeeId: 'EMP-1003',
    phone: '+1 (555) 038-9912',
    address: '220 Market St, Oakland, CA',
    status: 'Active',
    joiningDate: '2022-09-10T00:00:00.000Z',
    managerId: { _id: 'usr_1', name: 'Sarah Jenkins' },
  },
  {
    _id: 'usr_4',
    id: 'usr_4',
    name: 'Alex Chen',
    email: 'employee@staffsync.com',
    role: 'employee',
    department: 'Engineering',
    designation: 'Senior Full-Stack Engineer',
    employeeId: 'EMP-1004',
    phone: '+1 (555) 041-3321',
    address: '500 Tech Blvd, Mountain View, CA',
    status: 'Active',
    joiningDate: '2023-02-01T00:00:00.000Z',
    managerId: { _id: 'usr_2', name: 'David Mitchell' },
  },
  {
    _id: 'usr_5',
    id: 'usr_5',
    name: 'Priya Sharma',
    email: 'priya.sharma@staffsync.com',
    role: 'employee',
    department: 'Engineering',
    designation: 'Frontend UI Engineer',
    employeeId: 'EMP-1005',
    phone: '+1 (555) 055-6677',
    address: '88 Palo Alto Way, Palo Alto, CA',
    status: 'Active',
    joiningDate: '2023-03-15T00:00:00.000Z',
    managerId: { _id: 'usr_2', name: 'David Mitchell' },
  },
  {
    _id: 'usr_6',
    id: 'usr_6',
    name: 'James Wilson',
    email: 'james.wilson@staffsync.com',
    role: 'employee',
    department: 'Engineering',
    designation: 'DevOps & Cloud Engineer',
    employeeId: 'EMP-1006',
    phone: '+1 (555) 062-8819',
    address: '12 Mission St, San Francisco, CA',
    status: 'Active',
    joiningDate: '2023-04-10T00:00:00.000Z',
    managerId: { _id: 'usr_2', name: 'David Mitchell' },
  },
  {
    _id: 'usr_7',
    id: 'usr_7',
    name: 'Marcus Vance',
    email: 'marcus.vance@staffsync.com',
    role: 'employee',
    department: 'Marketing',
    designation: 'Content & SEO Strategist',
    employeeId: 'EMP-1007',
    phone: '+1 (555) 073-4455',
    address: '304 Berkeley Ave, Berkeley, CA',
    status: 'Active',
    joiningDate: '2023-05-01T00:00:00.000Z',
    managerId: { _id: 'usr_3', name: 'Elena Rodriguez' },
  },
  {
    _id: 'usr_8',
    id: 'usr_8',
    name: 'Sophia Patel',
    email: 'sophia.patel@staffsync.com',
    role: 'employee',
    department: 'Marketing',
    designation: 'Growth Marketing Specialist',
    employeeId: 'EMP-1008',
    phone: '+1 (555) 084-2233',
    address: '412 Broadway, Oakland, CA',
    status: 'Active',
    joiningDate: '2023-06-12T00:00:00.000Z',
    managerId: { _id: 'usr_3', name: 'Elena Rodriguez' },
  },
  {
    _id: 'usr_9',
    id: 'usr_9',
    name: 'Michael Brown',
    email: 'michael.brown@staffsync.com',
    role: 'employee',
    department: 'Finance',
    designation: 'Senior Financial Analyst',
    employeeId: 'EMP-1009',
    phone: '+1 (555) 091-6644',
    address: '90 Montgomery St, San Francisco, CA',
    status: 'Active',
    joiningDate: '2023-07-01T00:00:00.000Z',
    managerId: { _id: 'usr_1', name: 'Sarah Jenkins' },
  },
  {
    _id: 'usr_10',
    id: 'usr_10',
    name: 'Emma Taylor',
    email: 'emma.taylor@staffsync.com',
    role: 'employee',
    department: 'Design',
    designation: 'Lead UI/UX Designer',
    employeeId: 'EMP-1010',
    phone: '+1 (555) 012-7788',
    address: '150 Castro St, Mountain View, CA',
    status: 'Active',
    joiningDate: '2023-08-15T00:00:00.000Z',
    managerId: { _id: 'usr_2', name: 'David Mitchell' },
  },
  {
    _id: 'usr_11',
    id: 'usr_11',
    name: 'Daniel Martinez',
    email: 'daniel.martinez@staffsync.com',
    role: 'employee',
    department: 'Sales',
    designation: 'Account Executive',
    employeeId: 'EMP-1011',
    phone: '+1 (555) 099-3322',
    address: '77 Fremont St, San Francisco, CA',
    status: 'Active',
    joiningDate: '2023-09-01T00:00:00.000Z',
    managerId: { _id: 'usr_3', name: 'Elena Rodriguez' },
  },
];

const INITIAL_LEAVES = [
  {
    _id: 'lv_1',
    employeeId: {
      _id: 'usr_4',
      name: 'Alex Chen',
      email: 'employee@staffsync.com',
      employeeId: 'EMP-1004',
      department: 'Engineering',
      managerId: 'usr_2',
    },
    leaveType: 'Annual Leave',
    startDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 8 * 86400000).toISOString(),
    reason: 'Family vacation and personal downtime.',
    status: 'Approved',
    appliedDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    remarks: 'Approved. Enjoy your vacation!',
  },
  {
    _id: 'lv_2',
    employeeId: {
      _id: 'usr_5',
      name: 'Priya Sharma',
      email: 'priya.sharma@staffsync.com',
      employeeId: 'EMP-1005',
      department: 'Engineering',
      managerId: 'usr_2',
    },
    leaveType: 'Sick Leave',
    startDate: new Date(Date.now() + 1 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    reason: 'Severe flu and viral fever, doctor recommended 2 days rest.',
    status: 'Pending',
    appliedDate: new Date().toISOString(),
    remarks: '',
  },
  {
    _id: 'lv_3',
    employeeId: {
      _id: 'usr_7',
      name: 'Marcus Vance',
      email: 'marcus.vance@staffsync.com',
      employeeId: 'EMP-1007',
      department: 'Marketing',
      managerId: 'usr_3',
    },
    leaveType: 'Casual Leave',
    startDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 5 * 86400000).toISOString(),
    reason: 'Attending cousin wedding ceremony.',
    status: 'Pending',
    appliedDate: new Date().toISOString(),
    remarks: '',
  },
  {
    _id: 'lv_4',
    employeeId: {
      _id: 'usr_8',
      name: 'Sophia Patel',
      email: 'sophia.patel@staffsync.com',
      employeeId: 'EMP-1008',
      department: 'Marketing',
      managerId: 'usr_3',
    },
    leaveType: 'Paid Leave',
    startDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    endDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    reason: 'Apartment shifting and personal relocation.',
    status: 'Approved',
    appliedDate: new Date(Date.now() - 10 * 86400000).toISOString(),
    remarks: 'Approved.',
  },
  {
    _id: 'lv_5',
    employeeId: {
      _id: 'usr_9',
      name: 'Michael Brown',
      email: 'michael.brown@staffsync.com',
      employeeId: 'EMP-1009',
      department: 'Finance',
      managerId: 'usr_1',
    },
    leaveType: 'Casual Leave',
    startDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    reason: 'Short trip over the weekend.',
    status: 'Rejected',
    appliedDate: new Date(Date.now() - 1 * 86400000).toISOString(),
    remarks: 'Critical quarterly financial closing scheduled on those dates.',
  },
];

const INITIAL_ANNOUNCEMENTS = [
  {
    _id: 'ann_1',
    title: 'StaffSync HRMS Platform Official Launch',
    description:
      'Welcome to the new StaffSync HR Portal! All staff members can now easily clock-in attendance, submit leave applications, and view training schedules directly through this unified dashboard.',
    priority: 'Urgent',
    department: 'All',
    createdDate: new Date().toISOString(),
    createdBy: { name: 'Sarah Jenkins', role: 'hr' },
  },
  {
    _id: 'ann_2',
    title: 'Annual Company All-Hands & Q4 Townhall Meeting',
    description:
      'Join us this coming Friday at 3:00 PM PST in Main Auditorium or via the company video link. Executive leadership will share Q4 roadmaps and celebrate employee milestones.',
    priority: 'High',
    department: 'All',
    createdDate: new Date(Date.now() - 24 * 3600000).toISOString(),
    createdBy: { name: 'Sarah Jenkins', role: 'hr' },
  },
  {
    _id: 'ann_3',
    title: 'Comprehensive Health & Wellness Policy Update',
    description:
      'HR has upgraded our company medical and dental coverage. Review the new insurance handbook in the employee resources section or contact HR for enrollment adjustments.',
    priority: 'Medium',
    department: 'Human Resources',
    createdDate: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
    createdBy: { name: 'Sarah Jenkins', role: 'hr' },
  },
  {
    _id: 'ann_4',
    title: 'Engineering Sprint Retrospective & Tech Sharing',
    description:
      'The Engineering division will hold their monthly architecture review and code sharing workshop this Thursday afternoon.',
    priority: 'Low',
    department: 'Engineering',
    createdDate: new Date(Date.now() - 4 * 24 * 3600000).toISOString(),
    createdBy: { name: 'David Mitchell', role: 'manager' },
  },
];

const INITIAL_TRAININGS = [
  {
    _id: 'tr_1',
    title: 'Modern Full-Stack Cloud Architecture & Microservices',
    description:
      'Hands-on workshop covering microservices architecture, Docker containerization, REST API optimization, and scalable cloud patterns.',
    trainer: 'David Mitchell (Engineering)',
    startDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 14 * 86400000).toISOString(),
    status: 'Upcoming',
    assignedEmployees: [
      { _id: 'usr_4', name: 'Alex Chen', department: 'Engineering' },
      { _id: 'usr_5', name: 'Priya Sharma', department: 'Engineering' },
      { _id: 'usr_6', name: 'James Wilson', department: 'Engineering' },
    ],
  },
  {
    _id: 'tr_2',
    title: 'High-Impact Leadership & Strategic Communication',
    description:
      'Essential management training covering agile delegation, employee mentorship, and constructive feedback cycles.',
    trainer: 'Executive Coach Dr. Rachel Adams',
    startDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 10 * 86400000).toISOString(),
    status: 'Ongoing',
    assignedEmployees: [
      { _id: 'usr_2', name: 'David Mitchell', department: 'Engineering' },
      { _id: 'usr_3', name: 'Elena Rodriguez', department: 'Marketing' },
    ],
  },
  {
    _id: 'tr_3',
    title: 'Modern Product Design Systems & Accessibility (a11y)',
    description:
      'Master Figma design tokens, WCAG 2.1 compliance, responsive design patterns, and cross-functional design-to-code handoffs.',
    trainer: 'Emma Taylor (Lead Designer)',
    startDate: new Date(Date.now() + 12 * 86400000).toISOString(),
    endDate: new Date(Date.now() + 20 * 86400000).toISOString(),
    status: 'Upcoming',
    assignedEmployees: [
      { _id: 'usr_4', name: 'Alex Chen', department: 'Engineering' },
      { _id: 'usr_10', name: 'Emma Taylor', department: 'Design' },
    ],
  },
];

// Helper to get or set localStorage data
const getStore = (key, initial) => {
  try {
    const data = localStorage.getItem(`staffsync_${key}`);
    if (data) return JSON.parse(data);
  } catch (e) {}
  localStorage.setItem(`staffsync_${key}`, JSON.stringify(initial));
  return initial;
};

const setStore = (key, data) => {
  try {
    localStorage.setItem(`staffsync_${key}`, JSON.stringify(data));
  } catch (e) {}
};

// State Accessors
export const getMockUsers = () => getStore('users', INITIAL_USERS);
export const saveMockUsers = (users) => setStore('users', users);

export const getMockLeaves = () => getStore('leaves', INITIAL_LEAVES);
export const saveMockLeaves = (leaves) => setStore('leaves', leaves);

export const getMockAnnouncements = () => getStore('announcements', INITIAL_ANNOUNCEMENTS);
export const saveMockAnnouncements = (a) => setStore('announcements', a);

export const getMockTrainings = () => getStore('trainings', INITIAL_TRAININGS);
export const saveMockTrainings = (t) => setStore('trainings', t);

export const getMockAttendance = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultAttendance = [
    {
      _id: 'att_1',
      employeeId: { _id: 'usr_1', name: 'Sarah Jenkins', employeeId: 'EMP-1001', department: 'Human Resources' },
      date: new Date(todayStr).toISOString(),
      checkIn: new Date(Date.now() - 4 * 3600000).toISOString(),
      checkOut: null,
      status: 'Present',
      totalWorkingHours: 4,
      notes: 'On-time check in',
    },
    {
      _id: 'att_2',
      employeeId: { _id: 'usr_2', name: 'David Mitchell', employeeId: 'EMP-1002', department: 'Engineering' },
      date: new Date(todayStr).toISOString(),
      checkIn: new Date(Date.now() - 3.8 * 3600000).toISOString(),
      checkOut: null,
      status: 'Present',
      totalWorkingHours: 3.8,
      notes: 'On-time check in',
    },
    {
      _id: 'att_3',
      employeeId: { _id: 'usr_4', name: 'Alex Chen', employeeId: 'EMP-1004', department: 'Engineering' },
      date: new Date(todayStr).toISOString(),
      checkIn: new Date(Date.now() - 3.5 * 3600000).toISOString(),
      checkOut: null,
      status: 'Present',
      totalWorkingHours: 3.5,
      notes: 'On-time check in',
    },
  ];
  return getStore('attendance', defaultAttendance);
};
export const saveMockAttendance = (att) => setStore('attendance', att);
