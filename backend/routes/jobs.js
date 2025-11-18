const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');

// Get all jobs (public)
router.get('/', async (req, res) => {
    try {
        const [jobs] = await db.query('SELECT * FROM jobs WHERE status = "active" ORDER BY created_at DESC');
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching jobs' });
    }
});

// Get all jobs (admin - includes inactive)
router.get('/admin', authenticateToken, async (req, res) => {
    try {
        const [jobs] = await db.query('SELECT * FROM jobs ORDER BY created_at DESC');
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching jobs' });
    }
});

// Get single job
router.get('/:id', async (req, res) => {
    try {
        const [jobs] = await db.query('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
        
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        
        res.json(jobs[0]);
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ message: 'Error fetching job' });
    }
});

// Create job
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, description, experience, domain, location, job_type, salary_range, requirements } = req.body;

        if (!title || !experience || !domain) {
            return res.status(400).json({ message: 'Title, experience, and domain are required' });
        }

        const [result] = await db.query(
            'INSERT INTO jobs (title, description, experience, domain, location, job_type, salary_range, requirements) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, experience, domain, location, job_type, salary_range, requirements]
        );

        res.status(201).json({
            message: 'Job created successfully',
            jobId: result.insertId
        });

    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Error creating job' });
    }
});

// Update job
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { title, description, experience, domain, location, job_type, salary_range, requirements, status } = req.body;
        const jobId = req.params.id;

        // Check if job exists
        const [existingJob] = await db.query('SELECT * FROM jobs WHERE id = ?', [jobId]);
        
        if (existingJob.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await db.query(
            'UPDATE jobs SET title = ?, description = ?, experience = ?, domain = ?, location = ?, job_type = ?, salary_range = ?, requirements = ?, status = ? WHERE id = ?',
            [title, description, experience, domain, location, job_type, salary_range, requirements, status || 'active', jobId]
        );

        res.json({ message: 'Job updated successfully' });

    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ message: 'Error updating job' });
    }
});

// Delete job
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const jobId = req.params.id;

        // Check if job exists
        const [existingJob] = await db.query('SELECT * FROM jobs WHERE id = ?', [jobId]);
        
        if (existingJob.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        await db.query('DELETE FROM jobs WHERE id = ?', [jobId]);

        res.json({ message: 'Job deleted successfully' });

    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Error deleting job' });
    }
});

module.exports = router;
