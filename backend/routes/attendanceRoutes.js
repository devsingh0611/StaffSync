const express = require('express');
const router = express.Router();
const {
  checkIn,
  checkOut,
  getTodayStatus,
  getMyAttendance,
  getAllAttendance,
  manualMarkAttendance,
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/today', getTodayStatus);
router.get('/my-history', getMyAttendance);

router.get('/', authorize('hr', 'manager'), getAllAttendance);
router.post('/manual', authorize('hr'), manualMarkAttendance);

module.exports = router;
