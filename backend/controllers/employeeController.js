const User = require('../models/User');
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');

// @desc    Get all employees with search and department filter
// @route   GET /api/employees
// @access  Private (HR, Manager)
exports.getEmployees = async (req, res, next) => {
  try {
    const { search, department, role, status } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }

    if (department && department !== 'All') {
      query.department = department;
    }

    if (role && role !== 'All') {
      query.role = role.toLowerCase();
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    // If manager, they can optionally view their team or all employees based on query
    if (req.user.role === 'manager' && req.query.teamOnly === 'true') {
      query.managerId = req.user.id;
    }

    const employees = await User.find(query)
      .populate('managerId', 'name email designation')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: employees.length,
      employees,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee details by ID
// @route   GET /api/employees/:id
// @access  Private
exports.getEmployeeById = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id).populate('managerId', 'name email designation department');

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Fetch employee leave history & attendance stats
    const leaves = await Leave.find({ employeeId: employee._id }).sort({ appliedDate: -1 }).limit(10);
    const attendance = await Attendance.find({ employeeId: employee._id }).sort({ date: -1 }).limit(30);

    res.status(200).json({
      success: true,
      employee,
      stats: {
        totalLeaves: leaves.length,
        recentLeaves: leaves,
        recentAttendance: attendance,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new employee (HR only)
// @route   POST /api/employees
// @access  Private (HR)
exports.createEmployee = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      department,
      designation,
      employeeId,
      phone,
      address,
      managerId,
      status,
      joiningDate,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Auto-generate employee ID if not provided
    let empId = employeeId;
    if (!empId) {
      const count = await User.countDocuments();
      empId = `EMP-${(count + 101).toString().padStart(4, '0')}`;
    }

    const employee = await User.create({
      name,
      email: email.toLowerCase(),
      password: password || 'StaffSync@123',
      role: role ? role.toLowerCase() : 'employee',
      department: department || 'Engineering',
      designation: designation || 'Associate Software Engineer',
      employeeId: empId,
      phone: phone || '',
      address: address || '',
      managerId: managerId || null,
      status: status || 'Active',
      joiningDate: joiningDate || Date.now(),
    });

    res.status(201).json({
      success: true,
      employee,
      message: 'Employee created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee information (HR only)
// @route   PUT /api/employees/:id
// @access  Private (HR)
exports.updateEmployee = async (req, res, next) => {
  try {
    const {
      name,
      email,
      role,
      department,
      designation,
      employeeId,
      phone,
      address,
      managerId,
      status,
      joiningDate,
    } = req.body;

    let employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Check if email changed and already exists
    if (email && email.toLowerCase() !== employee.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email already in use by another user' });
      }
      employee.email = email.toLowerCase();
    }

    if (name) employee.name = name;
    if (role) employee.role = role.toLowerCase();
    if (department) employee.department = department;
    if (designation) employee.designation = designation;
    if (employeeId) employee.employeeId = employeeId;
    if (phone !== undefined) employee.phone = phone;
    if (address !== undefined) employee.address = address;
    if (managerId !== undefined) employee.managerId = managerId || null;
    if (status) employee.status = status;
    if (joiningDate) employee.joiningDate = joiningDate;

    await employee.save();

    const updatedEmployee = await User.findById(employee._id).populate('managerId', 'name email designation');

    res.status(200).json({
      success: true,
      employee: updatedEmployee,
      message: 'Employee updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee (HR only)
// @route   DELETE /api/employees/:id
// @access  Private (HR)
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Prevent HR from deleting themselves
    if (employee._id.toString() === req.user.id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own administrator account' });
    }

    // Delete associated leaves and attendance
    await Leave.deleteMany({ employeeId: employee._id });
    await Attendance.deleteMany({ employeeId: employee._id });
    await User.findByIdAndDelete(employee._id);

    res.status(200).json({
      success: true,
      message: 'Employee and associated records removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all managers (for assignment dropdown)
// @route   GET /api/employees/managers/list
// @access  Private
exports.getManagersList = async (req, res, next) => {
  try {
    const managers = await User.find({ role: { $in: ['manager', 'hr'] } }).select('name email department designation');
    res.status(200).json({
      success: true,
      managers,
    });
  } catch (error) {
    next(error);
  }
};
