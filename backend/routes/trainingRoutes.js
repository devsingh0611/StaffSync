const express = require('express');
const router = express.Router();
const {
  getTrainings,
  getTrainingById,
  createTraining,
  updateTraining,
  deleteTraining,
} = require('../controllers/trainingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(getTrainings)
  .post(authorize('manager', 'hr'), createTraining);

router
  .route('/:id')
  .get(getTrainingById)
  .put(authorize('manager', 'hr'), updateTraining)
  .delete(authorize('manager', 'hr'), deleteTraining);

module.exports = router;
