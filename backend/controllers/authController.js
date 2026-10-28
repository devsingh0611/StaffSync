const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'staffsync_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, department, designation, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Auto-generate employee ID if not provided
    const userCount = await User.countDocuments();
    const employeeId = `EMP-${(userCount + 101).toString().padStart(4, '0')}`;

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role ? role.toLowerCase() : 'employee',
      department: department || 'General',
      designation: designation || (role === 'manager' ? 'Team Lead' : 'Associate'),
      employeeId,
      phone: phone || '',
      address: address || '',
      status: 'Active',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        employeeId: user.employeeId,
        phone: user.phone,
        status: user.status,
      },
      message: 'Account registered successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get JWT token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    // Check for user and include password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password').populate('managerId', 'name email');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.status === 'Inactive') {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact HR.' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        employeeId: user.employeeId,
        phone: user.phone,
        address: user.address,
        joiningDate: user.joiningDate,
        manager: user.managerId,
        status: user.status,
        avatar: user.avatar,
      },
      message: `Welcome back, ${user.name}!`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('managerId', 'name email department');
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, avatar } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (address !== undefined) fieldsToUpdate.address = address;
    if (avatar !== undefined) fieldsToUpdate.avatar = avatar;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).populate('managerId', 'name email');

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/auth/password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new passwords' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password handler (functional simulation)
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email address' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    // For demo purposes, we can provide a secure reset instruction response
    res.status(200).json({
      success: true,
      message: `Password reset link and temporary code sent to ${email}. Check your inbox or contact HR administrator.`,
    });
  } catch (error) {
    next(error);
  }
};
