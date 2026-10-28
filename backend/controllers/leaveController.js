const Leave = require('../models/Leave');
const User = require('../models/User');

// @desc    Apply for a leave (Employee, Manager, HR)
// @route   POST /api/leaves
// @access  Private
exports.applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: 'Please provide leave type, start date, end date, and reason' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({ success: false, message: 'End date cannot be earlier than start date' });
    }

    const leave = await Leave.create({
      employeeId: req.user.id,
      leaveType,
      startDate: start,
      endDate: end,
      reason,
      status: 'Pending',
      appliedDate: Date.now(),
    });

    const populatedLeave = await Leave.findById(leave._id).populate('employeeId', 'name email employeeId department');

    res.status(201).json({
      success: true,
      leave: populatedLeave,
      message: 'Leave application submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaves based on role (HR = all, Manager = team, Employee = self)
// @route   GET /api/leaves
// @access  Private
exports.getLeaves = async (req, res, next) => {
  try {
    const { status, type, employeeId } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (type && type !== 'All') {
      query.leaveType = type;
    }

    // Role-based visibility logic
    if (req.user.role === 'employee') {
      // Employees only view their own leaves
      query.employeeId = req.user.id;
    } else if (req.user.role === 'manager') {
      // If manager specifically wants their own leaves
      if (req.query.myLeaves === 'true') {
        query.employeeId = req.user.id;
      } else {
        // Find team members reporting to this manager
        const teamMembers = await User.find({ managerId: req.user.id }).select('_id');
        const teamIds = teamMembers.map((m) => m._id);
        // Include self and team members
        query.employeeId = { $in: [...teamIds, req.user.id] };
      }
    } else if (req.user.role === 'hr') {
      // HR can filter by specific employee if requested
      if (employeeId) {
        query.employeeId = employeeId;
      }
    }

    const leaves = await Leave.find(query)
      .populate('employeeId', 'name email employeeId department designation')
      .populate('approvedBy', 'name email role')
      .sort({ appliedDate: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current employee's leaves
// @route   GET /api/leaves/my-leaves
// @access  Private
exports.getMyLeaves = async (req, res, next) => {
  try {
    const leaves = await Leave.find({ employeeId: req.user.id })
      .populate('approvedBy', 'name role')
      .sort({ appliedDate: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject leave request (HR or Manager)
// @route   PUT /api/leaves/:id/status
// @access  Private (HR, Manager)
exports.updateLeaveStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be either Approved or Rejected' });
    }

    const leave = await Leave.findById(req.params.id).populate('employeeId', 'name email managerId');

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    // Authorization: if Manager, verify employee belongs to manager's team
    if (req.user.role === 'manager') {
      const isTeamMember =
        leave.employeeId.managerId &&
        leave.employeeId.managerId.toString() === req.user.id.toString();

      if (!isTeamMember && leave.employeeId._id.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Managers can only approve or reject leaves for their assigned team members',
        });
      }
    }

    leave.status = status;
    leave.approvedBy = req.user.id;
    if (remarks !== undefined) leave.remarks = remarks;

    await leave.save();

    const updatedLeave = await Leave.findById(leave._id)
      .populate('employeeId', 'name email employeeId department')
      .populate('approvedBy', 'name email role');

    res.status(200).json({
      success: true,
      leave: updatedLeave,
      message: `Leave request has been marked as ${status}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel pending leave (Employee)
// @route   PUT /api/leaves/:id/cancel
// @access  Private
exports.cancelLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    if (leave.employeeId.toString() !== req.user.id.toString() && req.user.role !== 'hr') {
      return res.status(403).json({ success: false, message: 'You can only cancel your own leave requests' });
    }

    if (leave.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a leave application that has already been ${leave.status.toLowerCase()}`,
      });
    }

    leave.status = 'Cancelled';
    await leave.save();

    res.status(200).json({
      success: true,
      leave,
      message: 'Leave application cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
};
