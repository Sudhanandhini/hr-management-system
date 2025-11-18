// const express = require('express');
// const router = express.Router();
// const jobController = require('../controllers/jobController');
// const authMiddleware = require('../middleware/authMiddleware');

// router.get('/active', jobController.getActiveJobs);
// router.get('/', authMiddleware, jobController.getAllJobs);
// router.get('/:id', jobController.getJobById);
// router.post('/', authMiddleware, jobController.createJob);
// router.put('/:id', authMiddleware, jobController.updateJob);
// router.delete('/:id', authMiddleware, jobController.deleteJob);

// module.exports = router;


// routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateToken } = require('../middleware/authMiddleware'); // ← destructure the named export

// Public
router.get('/active', jobController.getActiveJobs);
router.get('/:id', jobController.getJobById);

// Protected (requires auth)
router.get('/', authenticateToken, jobController.getAllJobs);
router.post('/', authenticateToken, jobController.createJob);
router.put('/:id', authenticateToken, jobController.updateJob);
router.delete('/:id', authenticateToken, jobController.deleteJob);

module.exports = router;
