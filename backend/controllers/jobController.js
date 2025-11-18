// const db = require('../config/db');

// exports.getAllJobs = async (req, res) => {
//     try {
//         const [jobs] = await db.query('SELECT * FROM job_vacancies ORDER BY created_at DESC');
//         res.json(jobs);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching jobs', error: error.message });
//     }
// };

// exports.getActiveJobs = async (req, res) => {
//     try {
//         const [jobs] = await db.query('SELECT * FROM job_vacancies WHERE status = "active" ORDER BY created_at DESC');
//         res.json(jobs);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching jobs', error: error.message });
//     }
// };

// exports.getJobById = async (req, res) => {
//     try {
//         const [jobs] = await db.query('SELECT * FROM job_vacancies WHERE id = ?', [req.params.id]);
//         if (jobs.length === 0) {
//             return res.status(404).json({ message: 'Job not found' });
//         }
//         res.json(jobs[0]);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching job', error: error.message });
//     }
// };

// exports.createJob = async (req, res) => {
//     try {
//         const { job_title, department, location, experience_required, job_description, requirements, salary_range, job_type, posted_date } = req.body;
        
//         const [result] = await db.query(
//             'INSERT INTO job_vacancies (job_title, department, location, experience_required, job_description, requirements, salary_range, job_type, posted_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
//             [job_title, department, location, experience_required, job_description, requirements, salary_range, job_type, posted_date]
//         );
        
//         res.status(201).json({ message: 'Job created successfully', jobId: result.insertId });
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating job', error: error.message });
//     }
// };

// exports.updateJob = async (req, res) => {
//     try {
//         const { job_title, department, location, experience_required, job_description, requirements, salary_range, job_type, posted_date, status } = req.body;
        
//         await db.query(
//             'UPDATE job_vacancies SET job_title=?, department=?, location=?, experience_required=?, job_description=?, requirements=?, salary_range=?, job_type=?, posted_date=?, status=? WHERE id=?',
//             [job_title, department, location, experience_required, job_description, requirements, salary_range, job_type, posted_date, status, req.params.id]
//         );
        
//         res.json({ message: 'Job updated successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating job', error: error.message });
//     }
// };

// exports.deleteJob = async (req, res) => {
//     try {
//         await db.query('DELETE FROM job_vacancies WHERE id = ?', [req.params.id]);
//         res.json({ message: 'Job deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting job', error: error.message });
//     }
// };


// controllers/jobController.js
const db = require('../config/db');

exports.getAllJobs = async (req, res) => {
    try {
        const [jobs] = await db.query('SELECT * FROM job_vacancies ORDER BY created_at DESC');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error: error.message });
    }
};

exports.getActiveJobs = async (req, res) => {
    try {
        const [jobs] = await db.query('SELECT * FROM job_vacancies WHERE status = "active" ORDER BY created_at DESC');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error: error.message });
    }
};

exports.getJobById = async (req, res) => {
    try {
        const [jobs] = await db.query('SELECT * FROM job_vacancies WHERE id = ?', [req.params.id]);
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(jobs[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching job', error: error.message });
    }
};

exports.createJob = async (req, res) => {
    try {
        const { job_title, department, location, experience_required, job_description, requirements, salary_range, job_type, posted_date } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO job_vacancies (job_title, department, location, experience_required, job_description, requirements, salary_range, job_type, posted_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [job_title, department, location, experience_required, job_description, requirements, salary_range, job_type, posted_date]
        );
        
        res.status(201).json({ message: 'Job created successfully', jobId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating job', error: error.message });
    }
};

exports.updateJob = async (req, res) => {
    try {
        const { job_title, department, location, experience_required, job_description, requirements, salary_range, job_type, posted_date, status } = req.body;
        
        await db.query(
            'UPDATE job_vacancies SET job_title=?, department=?, location=?, experience_required=?, job_description=?, requirements=?, salary_range=?, job_type=?, posted_date=?, status=? WHERE id=?',
            [job_title, department, location, experience_required, job_description, requirements, salary_range, job_type, posted_date, status, req.params.id]
        );
        
        res.json({ message: 'Job updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating job', error: error.message });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        await db.query('DELETE FROM job_vacancies WHERE id = ?', [req.params.id]);
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting job', error: error.message });
    }
};
