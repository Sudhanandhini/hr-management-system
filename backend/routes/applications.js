const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resumes/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
        }
    }
});

// Submit application
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const { job_id, name, email, phone, experience, domain, cover_letter } = req.body;

        if (!job_id || !name || !email || !phone || !experience || !domain) {
            return res.status(400).json({ message: 'All required fields must be filled' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Resume is required' });
        }

        // Check if job exists
        const [jobs] = await db.query('SELECT * FROM jobs WHERE id = ? AND status = "active"', [job_id]);
        
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'Job not found or no longer active' });
        }

        const resumePath = req.file.filename;

        const [result] = await db.query(
            'INSERT INTO applications (job_id, name, email, phone, experience, domain, resume, cover_letter) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [job_id, name, email, phone, experience, domain, resumePath, cover_letter]
        );

        res.status(201).json({
            message: 'Application submitted successfully',
            applicationId: result.insertId
        });

    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ message: 'Error submitting application' });
    }
});

// Get all applications (admin)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [applications] = await db.query(`
            SELECT a.*, j.title as job_title 
            FROM applications a
            LEFT JOIN jobs j ON a.job_id = j.id
            ORDER BY a.applied_at DESC
        `);
        
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Error fetching applications' });
    }
});

// Get applications by job ID (admin)
router.get('/job/:jobId', authenticateToken, async (req, res) => {
    try {
        const [applications] = await db.query(
            'SELECT * FROM applications WHERE job_id = ? ORDER BY applied_at DESC',
            [req.params.jobId]
        );
        
        res.json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Error fetching applications' });
    }
});

// Get single application (admin)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const [applications] = await db.query(
            'SELECT a.*, j.title as job_title FROM applications a LEFT JOIN jobs j ON a.job_id = j.id WHERE a.id = ?',
            [req.params.id]
        );
        
        if (applications.length === 0) {
            return res.status(404).json({ message: 'Application not found' });
        }
        
        res.json(applications[0]);
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({ message: 'Error fetching application' });
    }
});

// Update application status (admin)
router.patch('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;

        if (!['pending', 'reviewed', 'shortlisted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Check if application exists
        const [existingApp] = await db.query('SELECT * FROM applications WHERE id = ?', [applicationId]);
        
        if (existingApp.length === 0) {
            return res.status(404).json({ message: 'Application not found' });
        }

        await db.query('UPDATE applications SET status = ? WHERE id = ?', [status, applicationId]);

        res.json({ message: 'Application status updated successfully' });

    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ message: 'Error updating application status' });
    }
});

// Delete application (admin)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const applicationId = req.params.id;

        // Check if application exists
        const [existingApp] = await db.query('SELECT * FROM applications WHERE id = ?', [applicationId]);
        
        if (existingApp.length === 0) {
            return res.status(404).json({ message: 'Application not found' });
        }

        await db.query('DELETE FROM applications WHERE id = ?', [applicationId]);

        res.json({ message: 'Application deleted successfully' });

    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ message: 'Error deleting application' });
    }
});

module.exports = router;
