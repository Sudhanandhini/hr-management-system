const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');

// Get all employees
router.get('/', authenticateToken, async (req, res) => {
    try {
        const [employees] = await db.query('SELECT * FROM employees ORDER BY created_at DESC');
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Error fetching employees' });
    }
});

// Get active employees only
router.get('/active', authenticateToken, async (req, res) => {
    try {
        const [employees] = await db.query('SELECT * FROM employees WHERE status = "active" ORDER BY name ASC');
        res.json(employees);
    } catch (error) {
        console.error('Error fetching active employees:', error);
        res.status(500).json({ message: 'Error fetching active employees' });
    }
});

// Get single employee
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const [employees] = await db.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
        
        if (employees.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        
        res.json(employees[0]);
    } catch (error) {
        console.error('Error fetching employee:', error);
        res.status(500).json({ message: 'Error fetching employee' });
    }
});

// Create employee
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { emp_id, name, email, phone, address, designation, department, join_date, salary } = req.body;

        if (!emp_id || !name || !email || !phone || !join_date) {
            return res.status(400).json({ message: 'Employee ID, name, email, phone, and join date are required' });
        }

        // Check if emp_id or email already exists
        const [existing] = await db.query('SELECT * FROM employees WHERE emp_id = ? OR email = ?', [emp_id, email]);
        
        if (existing.length > 0) {
            return res.status(409).json({ message: 'Employee ID or email already exists' });
        }

        const [result] = await db.query(
            'INSERT INTO employees (emp_id, name, email, phone, address, designation, department, join_date, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [emp_id, name, email, phone, address, designation, department, join_date, salary]
        );

        res.status(201).json({
            message: 'Employee created successfully',
            employeeId: result.insertId
        });

    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ message: 'Error creating employee' });
    }
});

// Update employee
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { emp_id, name, email, phone, address, designation, department, join_date, salary, status } = req.body;
        const employeeId = req.params.id;

        // Check if employee exists
        const [existingEmployee] = await db.query('SELECT * FROM employees WHERE id = ?', [employeeId]);
        
        if (existingEmployee.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check if emp_id or email already exists for other employees
        const [duplicate] = await db.query(
            'SELECT * FROM employees WHERE (emp_id = ? OR email = ?) AND id != ?',
            [emp_id, email, employeeId]
        );
        
        if (duplicate.length > 0) {
            return res.status(409).json({ message: 'Employee ID or email already exists' });
        }

        await db.query(
            'UPDATE employees SET emp_id = ?, name = ?, email = ?, phone = ?, address = ?, designation = ?, department = ?, join_date = ?, salary = ?, status = ? WHERE id = ?',
            [emp_id, name, email, phone, address, designation, department, join_date, salary, status || 'active', employeeId]
        );

        res.json({ message: 'Employee updated successfully' });

    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Error updating employee' });
    }
});

// Delete employee
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const employeeId = req.params.id;

        // Check if employee exists
        const [existingEmployee] = await db.query('SELECT * FROM employees WHERE id = ?', [employeeId]);
        
        if (existingEmployee.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await db.query('DELETE FROM employees WHERE id = ?', [employeeId]);

        res.json({ message: 'Employee deleted successfully' });

    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Error deleting employee' });
    }
});

module.exports = router;
