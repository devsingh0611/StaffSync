const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Private (All authenticated roles)
exports.getAnnouncements = async (req, res, next) => {
  try {
    const { priority } = req.query;
    const query = {};

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdDate: -1 });

    res.status(200).json({
      success: true,
      count: announcements.length,
      announcements,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Private
exports.getAnnouncementById = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate('createdBy', 'name email role');
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }
    res.status(200).json({ success: true, announcement });
  } catch (error) {
    next(error);
  }
};

// @desc    Create announcement (HR only)
// @route   POST /api/announcements
// @access  Private (HR)
exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, description, priority, department } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const announcement = await Announcement.create({
      title,
      description,
      priority: priority || 'Medium',
      department: department || 'All',
      createdBy: req.user.id,
      createdDate: Date.now(),
    });

    const populated = await Announcement.findById(announcement._id).populate('createdBy', 'name email role');

    res.status(201).json({
      success: true,
      announcement: populated,
      message: 'Announcement published successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update announcement (HR only)
// @route   PUT /api/announcements/:id
// @access  Private (HR)
exports.updateAnnouncement = async (req, res, next) => {
  try {
    const { title, description, priority, department } = req.body;

    let announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    if (title) announcement.title = title;
    if (description) announcement.description = description;
    if (priority) announcement.priority = priority;
    if (department) announcement.department = department;

    await announcement.save();

    const updated = await Announcement.findById(announcement._id).populate('createdBy', 'name email role');

    res.status(200).json({
      success: true,
      announcement: updated,
      message: 'Announcement updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete announcement (HR only)
// @route   DELETE /api/announcements/:id
// @access  Private (HR)
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    await Announcement.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
