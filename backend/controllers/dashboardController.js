const User = require('../models/User');
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');
const Announcement = require('../models/Announcement');
const Training = require('../models/Training');

// Helper for today's midnight date
const getTodayMidnight = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// @desc    Get HR Administrator dashboard statistics
// @route   GET /api/dashboard/hr
// @access  Private (HR)
exports.getHRStats = async (req, res, next) => {
  try {
    const today = getTodayMidnight();

    const [
      totalEmployees,
      totalManagers,
      presentTodayCount,
      pendingLeavesCount,
      approvedLeavesCount,
      departmentDistribution,
      recentLeaves,
      recentAnnouncements,
    ] = await Promise.all([
      User.countDocuments({ role: 'employee' }),
      User.countDocuments({ role: 'manager' }),
      Attendance.countDocuments({ date: today, status: { $in: ['Present', 'Late'] } }),
      Leave.countDocuments({ status: 'Pending' }),
      Leave.countDocuments({ status: 'Approved' }),
      User.aggregate([
        { $match: { role: { $in: ['employee', 'manager'] } } },
        { $group: { _id: '$department', count: { $sum: 1 } } },
        { $project: { department: '$_id', count: 1, _id: 0 } },
      ]),
      Leave.find().populate('employeeId', 'name email employeeId department').sort({ appliedDate: -1 }).limit(5),
      Announcement.find().sort({ createdDate: -1 }).limit(4),
    ]);

    const totalStaff = totalEmployees + totalManagers;
    const absentToday = Math.max(0, totalStaff - presentTodayCount);

    res.status(200).json({
      success: true,
      stats: {
        totalStaff,
        totalEmployees,
        totalManagers,
        presentToday: presentTodayCount,
        absentToday,
        pendingLeaves: pendingLeavesCount,
        approvedLeaves: approvedLeavesCount,
        departmentDistribution,
        recentLeaves,
        recentAnnouncements,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Manager dashboard statistics
// @route   GET /api/dashboard/manager
// @access  Private (Manager)
exports.getManagerStats = async (req, res, next) => {
  try {
    const today = getTodayMidnight();

    // Find team members assigned to this manager
    const teamMembers = await User.find({ managerId: req.user.id });
    const teamIds = teamMembers.map((m) => m._id);

    const [teamPresentToday, teamPendingLeaves, teamLeavesHistory, trainings, announcements] =
      await Promise.all([
        Attendance.countDocuments({
          employeeId: { $in: teamIds },
          date: today,
          status: { $in: ['Present', 'Late'] },
        }),
        Leave.countDocuments({
          employeeId: { $in: teamIds },
          status: 'Pending',
        }),
        Leave.find({ employeeId: { $in: teamIds } })
          .populate('employeeId', 'name email employeeId department')
          .sort({ appliedDate: -1 })
          .limit(5),
        Training.find({
          $or: [{ createdBy: req.user.id }, { assignedEmployees: { $in: teamIds } }],
        }).limit(5),
        Announcement.find().sort({ createdDate: -1 }).limit(3),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        totalTeamMembers: teamMembers.length,
        teamPresentToday,
        teamAbsentToday: Math.max(0, teamMembers.length - teamPresentToday),
        teamPendingLeaves,
        teamMembers,
        teamLeavesHistory,
        trainings,
        announcements,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Employee dashboard statistics
// @route   GET /api/dashboard/employee
// @access  Private (Employee)
exports.getEmployeeStats = async (req, res, next) => {
  try {
    const today = getTodayMidnight();

    const [todayAttendance, monthlyAttendance, myLeaves, assignedTrainings, announcements] =
      await Promise.all([
        Attendance.findOne({ employeeId: req.user.id, date: today }),
        Attendance.find({
          employeeId: req.user.id,
          date: {
            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        }),
        Leave.find({ employeeId: req.user.id }).sort({ appliedDate: -1 }).limit(5),
        Training.find({ assignedEmployees: req.user.id }).sort({ startDate: 1 }),
        Announcement.find().sort({ createdDate: -1 }).limit(4),
      ]);

    const presentDays = monthlyAttendance.filter((a) => a.status === 'Present' || a.status === 'Late').length;
    const pendingLeaves = myLeaves.filter((l) => l.status === 'Pending').length;
    const approvedLeaves = myLeaves.filter((l) => l.status === 'Approved').length;

    res.status(200).json({
      success: true,
      stats: {
        todayAttendance,
        isCheckedIn: !!(todayAttendance && todayAttendance.checkIn),
        isCheckedOut: !!(todayAttendance && todayAttendance.checkOut),
        monthlyPresentDays: presentDays,
        pendingLeaves,
        approvedLeaves,
        leaveBalance: Math.max(0, 18 - approvedLeaves), // 18 standard annual leave quota
        recentLeaves: myLeaves,
        trainings: assignedTrainings,
        announcements,
      },
    });
  } catch (error) {
    next(error);
  }
};
