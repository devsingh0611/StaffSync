const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide training program title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide training program description'],
      trim: true,
    },
    trainer: {
      type: String,
      required: [true, 'Please provide trainer name or department'],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    assignedEmployees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed'],
      default: 'Upcoming',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Training', trainingSchema);
