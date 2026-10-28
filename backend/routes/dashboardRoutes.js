const express = require('express');
const router = express.Router();
const {
  getHRStats,
  getManagerStats,
  getEmployeeStats,
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/hr', authorize('hr'), getHRStats);
router.get('/manager', authorize('manager', 'hr'), getManagerStats);
router.get('/employee', getEmployeeStats);

module.exports = router;
