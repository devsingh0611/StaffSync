const Training = require('../models/Training');

// @desc    Get all training programs
// @route   GET /api/trainings
// @access  Private
exports.getTrainings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    // If role is employee, only show programs assigned to them
    if (req.user.role === 'employee') {
      query.assignedEmployees = req.user.id;
    }

    const trainings = await Training.find(query)
      .populate('assignedEmployees', 'name email employeeId department designation')
      .populate('createdBy', 'name email role')
      .sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      count: trainings.length,
      trainings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single training program
// @route   GET /api/trainings/:id
// @access  Private
exports.getTrainingById = async (req, res, next) => {
  try {
    const training = await Training.findById(req.params.id)
      .populate('assignedEmployees', 'name email employeeId department designation')
      .populate('createdBy', 'name email role');

    if (!training) {
      return res.status(404).json({ success: false, message: 'Training program not found' });
    }

    res.status(200).json({ success: true, training });
  } catch (error) {
    next(error);
  }
};

// @desc    Create training program (Manager, HR)
// @route   POST /api/trainings
// @access  Private (Manager, HR)
exports.createTraining = async (req, res, next) => {
  try {
    const { title, description, trainer, startDate, endDate, assignedEmployees, status } = req.body;

    if (!title || !description || !trainer || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, trainer, start date, and end date',
      });
    }

    const training = await Training.create({
      title,
      description,
      trainer,
      startDate,
      endDate,
      assignedEmployees: assignedEmployees || [],
      status: status || 'Upcoming',
      createdBy: req.user.id,
    });

    const populated = await Training.findById(training._id)
      .populate('assignedEmployees', 'name email employeeId department')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      training: populated,
      message: 'Training program created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update training program (Manager, HR)
// @route   PUT /api/trainings/:id
// @access  Private (Manager, HR)
exports.updateTraining = async (req, res, next) => {
  try {
    const { title, description, trainer, startDate, endDate, assignedEmployees, status } = req.body;

    let training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ success: false, message: 'Training program not found' });
    }

    if (title) training.title = title;
    if (description) training.description = description;
    if (trainer) training.trainer = trainer;
    if (startDate) training.startDate = startDate;
    if (endDate) training.endDate = endDate;
    if (assignedEmployees !== undefined) training.assignedEmployees = assignedEmployees;
    if (status) training.status = status;

    await training.save();

    const updated = await Training.findById(training._id)
      .populate('assignedEmployees', 'name email employeeId department')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      training: updated,
      message: 'Training program updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete training program (Manager, HR)
// @route   DELETE /api/trainings/:id
// @access  Private (Manager, HR)
exports.deleteTraining = async (req, res, next) => {
  try {
    const training = await Training.findById(req.params.id);
    if (!training) {
      return res.status(404).json({ success: false, message: 'Training program not found' });
    }

    await Training.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Training program removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
