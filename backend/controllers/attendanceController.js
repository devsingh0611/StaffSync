const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Helper to get normalized midnight Date object for today
const getTodayMidnight = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// @desc    Check in attendance for today
// @route   POST /api/attendance/check-in
// @access  Private
exports.checkIn = async (req, res, next) => {
  try {
    const today = getTodayMidnight();
    const now = new Date();

    let attendance = await Attendance.findOne({
      employeeId: req.user.id,
      date: today,
    });

    if (attendance && attendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked in today at ' + new Date(attendance.checkIn).toLocaleTimeString(),
        attendance,
      });
    }

    if (!attendance) {
      // Determine if Late (e.g. after 9:30 AM)
      const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);

      attendance = await Attendance.create({
        employeeId: req.user.id,
        date: today,
        checkIn: now,
        status: isLate ? 'Late' : 'Present',
        notes: req.body.notes || (isLate ? 'Late arrival' : 'On-time arrival'),
      });
    } else {
      attendance.checkIn = now;
      await attendance.save();
    }

    res.status(200).json({
      success: true,
      attendance,
      message: 'Check-in successful at ' + now.toLocaleTimeString(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check out attendance for today
// @route   POST /api/attendance/check-out
// @access  Private
exports.checkOut = async (req, res, next) => {
  try {
    const today = getTodayMidnight();
    const now = new Date();

    const attendance = await Attendance.findOne({
      employeeId: req.user.id,
      date: today,
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({
        success: false,
        message: 'You must check in before checking out',
      });
    }

    if (attendance.checkOut) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked out today at ' + new Date(attendance.checkOut).toLocaleTimeString(),
        attendance,
      });
    }

    attendance.checkOut = now;

    // Calculate working hours (difference in hours, rounded to 2 decimal places)
    const diffMs = now - new Date(attendance.checkIn);
    const hours = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
    attendance.totalWorkingHours = hours;

    if (hours < 4.5 && attendance.status !== 'Late') {
      attendance.status = 'Half Day';
    }

    await attendance.save();

    res.status(200).json({
      success: true,
      attendance,
      message: `Check-out successful. Total hours today: ${hours} hrs`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's today attendance status
// @route   GET /api/attendance/today
// @access  Private
exports.getTodayStatus = async (req, res, next) => {
  try {
    const today = getTodayMidnight();
    const attendance = await Attendance.findOne({
      employeeId: req.user.id,
      date: today,
    });

    res.status(200).json({
      success: true,
      attendance: attendance || null,
      isCheckedIn: !!(attendance && attendance.checkIn),
      isCheckedOut: !!(attendance && attendance.checkOut),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's attendance history
// @route   GET /api/attendance/my-history
// @access  Private
exports.getMyAttendance = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const query = { employeeId: req.user.id };

    if (month && year) {
      const startDate = new Date(year, parseInt(month) - 1, 1);
      const endDate = new Date(year, parseInt(month), 0, 23, 59, 59);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const records = await Attendance.find(query).sort({ date: -1 });

    // Summary calculations
    const presentCount = records.filter((r) => r.status === 'Present' || r.status === 'Late').length;
    const totalHours = records.reduce((sum, r) => sum + (r.totalWorkingHours || 0), 0);

    res.status(200).json({
      success: true,
      count: records.length,
      stats: {
        presentDays: presentCount,
        totalHours: Math.round(totalHours * 10) / 10,
        averageHours: records.length > 0 ? Math.round((totalHours / records.length) * 10) / 10 : 0,
      },
      records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance records (HR = all, Manager = team)
// @route   GET /api/attendance
// @access  Private (HR, Manager)
exports.getAllAttendance = async (req, res, next) => {
  try {
    const { date, department, employeeId } = req.query;
    let targetDate = date ? new Date(date) : getTodayMidnight();
    targetDate.setHours(0, 0, 0, 0);

    const query = { date: targetDate };

    if (req.user.role === 'manager') {
      const team = await User.find({ managerId: req.user.id }).select('_id');
      const teamIds = team.map((t) => t._id);
      query.employeeId = { $in: [...teamIds, req.user.id] };
    } else if (employeeId) {
      query.employeeId = employeeId;
    }

    let records = await Attendance.find(query)
      .populate('employeeId', 'name email employeeId department designation')
      .sort({ createdAt: -1 });

    if (department && department !== 'All') {
      records = records.filter((r) => r.employeeId && r.employeeId.department === department);
    }

    res.status(200).json({
      success: true,
      date: targetDate,
      count: records.length,
      records,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    HR manual attendance mark/update
// @route   POST /api/attendance/manual
// @access  Private (HR only)
exports.manualMarkAttendance = async (req, res, next) => {
  try {
    const { employeeId, date, status, checkIn, checkOut, totalWorkingHours, notes } = req.body;

    if (!employeeId || !date) {
      return res.status(400).json({ success: false, message: 'Employee ID and date are required' });
    }

    const recordDate = new Date(date);
    recordDate.setHours(0, 0, 0, 0);

    const updated = await Attendance.findOneAndUpdate(
      { employeeId, date: recordDate },
      {
        employeeId,
        date: recordDate,
        status: status || 'Present',
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
        totalWorkingHours: totalWorkingHours || 8,
        notes: notes || 'Admin adjusted record',
      },
      { upsert: true, new: true, runValidators: true }
    ).populate('employeeId', 'name email employeeId department');

    res.status(200).json({
      success: true,
      record: updated,
      message: 'Attendance record updated successfully',
    });
  } catch (error) {
    next(error);
  }
};
