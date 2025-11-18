const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', applicationController.uploadMiddleware, applicationController.submitApplication);
router.get('/', authMiddleware, applicationController.getAllApplications);
router.put('/:id', authMiddleware, applicationController.updateApplicationStatus);
router.delete('/:id', authMiddleware, applicationController.deleteApplication);

module.exports = router;