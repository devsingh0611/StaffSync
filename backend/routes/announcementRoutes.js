const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(getAnnouncements)
  .post(authorize('hr'), createAnnouncement);

router
  .route('/:id')
  .get(getAnnouncementById)
  .put(authorize('hr'), updateAnnouncement)
  .delete(authorize('hr'), deleteAnnouncement);

module.exports = router;
