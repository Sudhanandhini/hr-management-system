const db = require('../config/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/resumes/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and DOC files allowed'));
        }
    }
}).single('resume');

exports.uploadMiddleware = upload;

exports.submitApplication = async (req, res) => {
    try {
        const { job_id, name, email, phone, experience, domain } = req.body;
        const resume_path = req.file ? req.file.path : null;
        
        const [result] = await db.query(
            'INSERT INTO job_applications (job_id, name, email, phone, experience, domain, resume_path) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [job_id, name, email, phone, experience, domain, resume_path]
        );
        
        res.status(201).json({ message: 'Application submitted successfully', applicationId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting application', error: error.message });
    }
};

exports.getAllApplications = async (req, res) => {
    try {
        const [applications] = await db.query(`
            SELECT ja.*, jv.job_title, jv.department 
            FROM job_applications ja 
            LEFT JOIN job_vacancies jv ON ja.job_id = jv.id 
            ORDER BY ja.applied_date DESC
        `);
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error: error.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        const { application_status } = req.body;
        await db.query('UPDATE job_applications SET application_status = ? WHERE id = ?', [application_status, req.params.id]);
        res.json({ message: 'Application status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error: error.message });
    }
};

exports.deleteApplication = async (req, res) => {
    try {
        await db.query('DELETE FROM job_applications WHERE id = ?', [req.params.id]);
        res.json({ message: 'Application deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting application', error: error.message });
    }
};