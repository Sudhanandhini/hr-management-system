// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

// auth middleware (default export)
const authMiddleware = require('../middleware/authMiddleware');

// Monthly attendance for employee: /api/attendance/monthly/:empId/:year/:month
router.get('/monthly/:empId/:year/:month', authMiddleware, attendanceController.getMonthlyAttendance);

// Update attendance (legacy endpoint)
router.post('/update', authMiddleware, attendanceController.updateAttendance);

// Mark attendance (preferred POST to /api/attendance)
router.post('/', authMiddleware, attendanceController.updateAttendance);

module.exports = router;
