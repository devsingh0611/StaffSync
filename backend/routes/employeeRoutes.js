const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getManagersList,
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/managers/list', getManagersList);

router
  .route('/')
  .get(authorize('hr', 'manager'), getEmployees)
  .post(authorize('hr'), createEmployee);

router
  .route('/:id')
  .get(getEmployeeById)
  .put(authorize('hr'), updateEmployee)
  .delete(authorize('hr'), deleteEmployee);

module.exports = router;
