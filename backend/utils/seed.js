const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');
const Announcement = require('../models/Announcement');
const Training = require('../models/Training');

dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/staffsync';

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log('[Seed]: Connected to MongoDB at', mongoURI);

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Leave.deleteMany({}),
      Attendance.deleteMany({}),
      Announcement.deleteMany({}),
      Training.deleteMany({}),
    ]);
    console.log('[Seed]: Cleared existing collections.');

    // 1. Create HR Administrator
    const hrAdmin = await User.create({
      name: 'Sarah Jenkins',
      email: 'hr@staffsync.com',
      password: 'password123',
      role: 'hr',
      department: 'Human Resources',
      designation: 'HR Director',
      employeeId: 'EMP-1001',
      phone: '+1 (555) 019-2834',
      address: '742 Evergreen Terrace, San Francisco, CA',
      status: 'Active',
      joiningDate: new Date('2022-01-15'),
    });

    // 2. Create 2 Managers
    const managerEngineering = await User.create({
      name: 'David Mitchell',
      email: 'david.mitchell@staffsync.com',
      password: 'password123',
      role: 'manager',
      department: 'Engineering',
      designation: 'Engineering Manager',
      employeeId: 'EMP-1002',
      phone: '+1 (555) 024-5567',
      address: '104 Innovation Way, San Jose, CA',
      managerId: hrAdmin._id,
      status: 'Active',
      joiningDate: new Date('2022-06-01'),
    });

    const managerMarketing = await User.create({
      name: 'Elena Rodriguez',
      email: 'elena.rodriguez@staffsync.com',
      password: 'password123',
      role: 'manager',
      department: 'Marketing',
      designation: 'Marketing Director',
      employeeId: 'EMP-1003',
      phone: '+1 (555) 038-9912',
      address: '220 Market St, Oakland, CA',
      managerId: hrAdmin._id,
      status: 'Active',
      joiningDate: new Date('2022-09-10'),
    });

    // 3. Create 8 Employees
    const employeeData = [
      {
        name: 'Alex Chen',
        email: 'employee@staffsync.com', // Primary demo employee
        password: 'password123',
        role: 'employee',
        department: 'Engineering',
        designation: 'Senior Full-Stack Engineer',
        employeeId: 'EMP-1004',
        phone: '+1 (555) 041-3321',
        address: '500 Tech Blvd, Mountain View, CA',
        managerId: managerEngineering._id,
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@staffsync.com',
        password: 'password123',
        role: 'employee',
        department: 'Engineering',
        designation: 'Frontend UI Engineer',
        employeeId: 'EMP-1005',
        phone: '+1 (555) 055-6677',
        address: '88 Palo Alto Way, Palo Alto, CA',
        managerId: managerEngineering._id,
      },
      {
        name: 'James Wilson',
        email: 'james.wilson@staffsync.com',
        password: 'password123',
        role: 'employee',
        department: 'Engineering',
        designation: 'DevOps & Cloud Engineer',
        employeeId: 'EMP-1006',
        phone: '+1 (555) 062-8819',
        address: '12 Mission St, San Francisco, CA',
        managerId: managerEngineering._id,
      },
      {
        name: 'Marcus Vance',
        email: 'marcus.vance@staffsync.com',
        password: 'password123',
        role: 'employee',
        department: 'Marketing',
        designation: 'Content & SEO Strategist',
        employeeId: 'EMP-1007',
        phone: '+1 (555) 073-4455',
        address: '304 Berkeley Ave, Berkeley, CA',
        managerId: managerMarketing._id,
      },
      {
        name: 'Sophia Patel',
        email: 'sophia.patel@staffsync.com',
        password: 'password123',
        role: 'employee',
        department: 'Marketing',
        designation: 'Growth Marketing Specialist',
        employeeId: 'EMP-1008',
        phone: '+1 (555) 084-2233',
        address: '412 Broadway, Oakland, CA',
        managerId: managerMarketing._id,
      },
      {
        name: 'Michael Brown',
        email: 'michael.brown@staffsync.com',
        password: 'password123',
        role: 'employee',
        department: 'Finance',
        designation: 'Senior Financial Analyst',
        employeeId: 'EMP-1009',
        phone: '+1 (555) 091-6644',
        address: '90 Montgomery St, San Francisco, CA',
        managerId: hrAdmin._id,
      },
      {
        name: 'Emma Taylor',
        email: 'emma.taylor@staffsync.com',
        password: 'password123',
        role: 'employee',
        department: 'Design',
        designation: 'Lead UI/UX Designer',
        employeeId: 'EMP-1010',
        phone: '+1 (555) 012-7788',
        address: '150 Castro St, Mountain View, CA',
        managerId: managerEngineering._id,
      },
      {
        name: 'Daniel Martinez',
        email: 'daniel.martinez@staffsync.com',
        password: 'password123',
        role: 'employee',
        department: 'Sales',
        designation: 'Account Executive',
        employeeId: 'EMP-1011',
        phone: '+1 (555) 099-3322',
        address: '77 Fremont St, San Francisco, CA',
        managerId: managerMarketing._id,
      },
    ];

    const employees = [];
    for (const emp of employeeData) {
      const created = await User.create({
        ...emp,
        status: 'Active',
        joiningDate: new Date('2023-02-01'),
      });
      employees.push(created);
    }

    console.log(`[Seed]: Created 1 HR Admin, 2 Managers, and 8 Employees.`);

    // 4. Create Leaves
    const now = new Date();
    await Leave.create([
      {
        employeeId: employees[0]._id, // Alex Chen
        leaveType: 'Annual Leave',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 8),
        reason: 'Family vacation and personal downtime.',
        status: 'Approved',
        appliedDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        approvedBy: managerEngineering._id,
        remarks: 'Approved. Enjoy your vacation!',
      },
      {
        employeeId: employees[1]._id, // Priya Sharma
        leaveType: 'Sick Leave',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
        reason: 'Severe flu and fever, doctor advised 2 days of bed rest.',
        status: 'Pending',
        appliedDate: now,
      },
      {
        employeeId: employees[3]._id, // Marcus Vance
        leaveType: 'Casual Leave',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
        reason: 'Attending cousin wedding in Seattle.',
        status: 'Pending',
        appliedDate: now,
      },
      {
        employeeId: employees[4]._id, // Sophia Patel
        leaveType: 'Paid Leave',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3),
        reason: 'Personal relocation and apartment shift.',
        status: 'Approved',
        appliedDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        approvedBy: managerMarketing._id,
        remarks: 'Approved.',
      },
      {
        employeeId: employees[5]._id, // Michael Brown
        leaveType: 'Casual Leave',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4),
        reason: 'Short trip over the weekend.',
        status: 'Rejected',
        appliedDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        approvedBy: hrAdmin._id,
        remarks: 'Critical financial quarterly close scheduled on those dates.',
      },
    ]);
    console.log('[Seed]: Created sample leave records.');

    // 5. Create Attendance for Today & Historical
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    const attendanceRecords = [];
    const allUsers = [hrAdmin, managerEngineering, managerMarketing, ...employees];

    // Mark check-ins for most users today
    allUsers.slice(0, 9).forEach((user, index) => {
      const checkInTime = new Date(todayMidnight);
      checkInTime.setHours(9, 0 + index * 4, 0); // 9:00, 9:04, 9:08...

      const record = {
        employeeId: user._id,
        date: todayMidnight,
        checkIn: checkInTime,
        status: index > 7 ? 'Late' : 'Present',
        totalWorkingHours: 0,
        notes: index > 7 ? 'Traffic delay on freeway' : 'On-time check in',
      };
      attendanceRecords.push(record);
    });

    // Add some past days records for Alex Chen (demo employee)
    for (let day = 1; day <= 10; day++) {
      const pastDate = new Date(todayMidnight);
      pastDate.setDate(pastDate.getDate() - day);
      if (pastDate.getDay() !== 0 && pastDate.getDay() !== 6) {
        // Weekdays only
        const checkIn = new Date(pastDate);
        checkIn.setHours(9, 5, 0);
        const checkOut = new Date(pastDate);
        checkOut.setHours(17, 30, 0);

        attendanceRecords.push({
          employeeId: employees[0]._id, // Alex Chen
          date: pastDate,
          checkIn,
          checkOut,
          status: 'Present',
          totalWorkingHours: 8.4,
          notes: 'Regular full working day',
        });
      }
    }

    await Attendance.insertMany(attendanceRecords);
    console.log(`[Seed]: Created ${attendanceRecords.length} attendance records.`);

    // 6. Create Announcements
    await Announcement.create([
      {
        title: 'StaffSync HRMS Platform Official Launch',
        description:
          'Welcome to the new StaffSync HR Portal! All staff members can now easily clock-in attendance, submit leave applications, and view training schedules directly through this unified dashboard.',
        priority: 'Urgent',
        department: 'All',
        createdBy: hrAdmin._id,
        createdDate: new Date(),
      },
      {
        title: 'Annual Company All-Hands & Q4 Townhall Meeting',
        description:
          'Join us this coming Friday at 3:00 PM PST in Main Auditorium or via the company video link. Executive leadership will share Q4 roadmaps and celebrate employee milestones.',
        priority: 'High',
        department: 'All',
        createdBy: hrAdmin._id,
        createdDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
      {
        title: 'Comprehensive Health & Wellness Policy Update',
        description:
          'HR has upgraded our company medical and dental coverage. Review the new insurance handbook in the employee resources section or contact HR for enrollment adjustments.',
        priority: 'Medium',
        department: 'Human Resources',
        createdBy: hrAdmin._id,
        createdDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Engineering Sprint Retrospective & Tech Sharing',
        description:
          'The Engineering division will hold their monthly architecture review and code sharing workshop this Thursday afternoon.',
        priority: 'Low',
        department: 'Engineering',
        createdBy: managerEngineering._id,
        createdDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log('[Seed]: Created announcements.');

    // 7. Create Training Programs
    await Training.create([
      {
        title: 'Modern Full-Stack Cloud Architecture & Microservices',
        description:
          'Hands-on workshop covering microservices architecture, Docker containerization, REST API optimization, and scalable cloud patterns.',
        trainer: 'David Mitchell (Engineering)',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14),
        assignedEmployees: [employees[0]._id, employees[1]._id, employees[2]._id, employees[6]._id],
        status: 'Upcoming',
        createdBy: managerEngineering._id,
      },
      {
        title: 'High-Impact Leadership & Strategic Communication',
        description:
          'Essential management training for managers and leads covering agile delegation, employee mentorship, and constructive feedback cycles.',
        trainer: 'Executive Coach Dr. Rachel Adams',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 10),
        assignedEmployees: [managerEngineering._id, managerMarketing._id],
        status: 'Ongoing',
        createdBy: hrAdmin._id,
      },
      {
        title: 'Modern Product Design Systems & Accessibility (a11y)',
        description:
          'Master Figma design tokens, WCAG 2.1 compliance, responsive design patterns, and cross-functional design-to-code handoffs.',
        trainer: 'Emma Taylor (Lead Designer)',
        startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 12),
        endDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 20),
        assignedEmployees: [employees[0]._id, employees[1]._id, employees[6]._id],
        status: 'Upcoming',
        createdBy: managerEngineering._id,
      },
    ]);
    console.log('[Seed]: Created training programs.');

    console.log('\n=============================================');
    console.log(' StaffSync Database Seeding Completed Successfully! ');
    console.log('=============================================');
    console.log('\nSample Credentials:');
    console.log('1. HR Administrator:');
    console.log('   Email:    hr@staffsync.com');
    console.log('   Password: password123');
    console.log('\n2. Manager:');
    console.log('   Email:    david.mitchell@staffsync.com (or elena.rodriguez@staffsync.com)');
    console.log('   Password: password123');
    console.log('\n3. Employee:');
    console.log('   Email:    employee@staffsync.com (Alex Chen)');
    console.log('   Password: password123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err.message);
    process.exit(1);
  }
};

seedDatabase();
