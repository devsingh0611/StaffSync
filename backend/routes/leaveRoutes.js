const express = require('express');
const router = express.Router();
const {
  applyLeave,
  getLeaves,
  getMyLeaves,
  updateLeaveStatus,
  cancelLeave,
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getLeaves).post(applyLeave);
router.get('/my-leaves', getMyLeaves);
router.put('/:id/status', authorize('hr', 'manager'), updateLeaveStatus);
router.put('/:id/cancel', cancelLeave);

module.exports = router;
