const db = require('../config/db');

exports.getAllEmployees = async (req, res) => {
    try {
        const [employees] = await db.query('SELECT * FROM employees ORDER BY created_at DESC');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees', error: error.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const [employees] = await db.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
        if (employees.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.json(employees[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employee', error: error.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const { emp_id, name, email, phone, address, department, designation, join_date, salary } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO employees (emp_id, name, email, phone, address, department, designation, join_date, salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [emp_id, name, email, phone, address, department, designation, join_date, salary]
        );
        
        res.status(201).json({ message: 'Employee created successfully', employeeId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Error creating employee', error: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { emp_id, name, email, phone, address, department, designation, join_date, salary, status } = req.body;
        
        await db.query(
            'UPDATE employees SET emp_id=?, name=?, email=?, phone=?, address=?, department=?, designation=?, join_date=?, salary=?, status=? WHERE id=?',
            [emp_id, name, email, phone, address, department, designation, join_date, salary, status, req.params.id]
        );
        
        res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating employee', error: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        await db.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error: error.message });
    }
};