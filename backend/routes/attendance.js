const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/auth');

// Helper function to get week number of month
function getWeekOfMonth(date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDay.getDay();
    const offsetDate = date.getDate() + firstDayOfWeek - 1;
    return Math.floor(offsetDate / 7) + 1;
}

// Helper function to check if date is a holiday
function isHoliday(date) {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Sunday is always holiday
    if (day === 0) {
        return true;
    }
    
    // Check for Saturday
    if (day === 6) {
        const weekOfMonth = getWeekOfMonth(date);
        // 1st and 3rd Saturday are holidays
        if (weekOfMonth === 1 || weekOfMonth === 3) {
            return true;
        }
    }
    
    return false;
}

// Helper function to check if date is working Saturday
function isWorkingSaturday(date) {
    const day = date.getDay();
    if (day === 6) {
        const weekOfMonth = getWeekOfMonth(date);
        // 2nd, 4th, and 5th Saturday are working days
        return weekOfMonth === 2 || weekOfMonth === 4 || weekOfMonth === 5;
    }
    return false;
}

// Get attendance for a specific month and employee
router.get('/monthly/:employeeId/:year/:month', authenticateToken, async (req, res) => {
    try {
        const { employeeId, year, month } = req.params;

        // Validate employee exists
        const [employee] = await db.query('SELECT * FROM employees WHERE id = ?', [employeeId]);
        
        if (employee.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Get all days in the month
        const daysInMonth = new Date(year, month, 0).getDate();
        const attendanceData = [];

        // Get existing attendance records for the month
        const [existingAttendance] = await db.query(
            'SELECT * FROM attendance WHERE employee_id = ? AND YEAR(date) = ? AND MONTH(date) = ?',
            [employeeId, year, month]
        );

        // Create a map of existing attendance
        const attendanceMap = {};
        existingAttendance.forEach(record => {
            const dateKey = new Date(record.date).toISOString().split('T')[0];
            attendanceMap[dateKey] = record;
        });

        // Generate attendance for each day
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const dateStr = date.toISOString().split('T')[0];
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
            
            const isHol = isHoliday(date);
            const isWorkSat = isWorkingSaturday(date);
            
            let dayType = 'working';
            if (isHol) {
                dayType = 'holiday';
            } else if (isWorkSat) {
                dayType = 'working_saturday';
            }

            attendanceData.push({
                date: dateStr,
                dayOfWeek,
                dayType,
                status: attendanceMap[dateStr] ? attendanceMap[dateStr].status : null,
                remarks: attendanceMap[dateStr] ? attendanceMap[dateStr].remarks : null,
                recordId: attendanceMap[dateStr] ? attendanceMap[dateStr].id : null
            });
        }

        res.json({
            employee: employee[0],
            month: month,
            year: year,
            attendance: attendanceData
        });

    } catch (error) {
        console.error('Error fetching monthly attendance:', error);
        res.status(500).json({ message: 'Error fetching monthly attendance' });
    }
});

// Mark attendance for a specific day
router.post('/mark', authenticateToken, async (req, res) => {
    try {
        const { employee_id, date, status, remarks } = req.body;

        if (!employee_id || !date || !status) {
            return res.status(400).json({ message: 'Employee ID, date, and status are required' });
        }

        if (!['present', 'work_on_holiday', 'leave', 'holiday'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Validate employee exists
        const [employee] = await db.query('SELECT * FROM employees WHERE id = ?', [employee_id]);
        
        if (employee.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check if attendance already exists for this date
        const [existing] = await db.query(
            'SELECT * FROM attendance WHERE employee_id = ? AND date = ?',
            [employee_id, date]
        );

        if (existing.length > 0) {
            // Update existing attendance
            await db.query(
                'UPDATE attendance SET status = ?, remarks = ? WHERE employee_id = ? AND date = ?',
                [status, remarks, employee_id, date]
            );
            res.json({ message: 'Attendance updated successfully' });
        } else {
            // Insert new attendance
            const [result] = await db.query(
                'INSERT INTO attendance (employee_id, date, status, remarks) VALUES (?, ?, ?, ?)',
                [employee_id, date, status, remarks]
            );
            res.status(201).json({
                message: 'Attendance marked successfully',
                attendanceId: result.insertId
            });
        }

    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ message: 'Error marking attendance' });
    }
});

// Mark bulk attendance (for multiple days)
router.post('/mark-bulk', authenticateToken, async (req, res) => {
    try {
        const { attendance_records } = req.body;

        if (!attendance_records || !Array.isArray(attendance_records) || attendance_records.length === 0) {
            return res.status(400).json({ message: 'Attendance records array is required' });
        }

        const results = [];
        
        for (const record of attendance_records) {
            const { employee_id, date, status, remarks } = record;
            
            if (!employee_id || !date || !status) {
                continue;
            }

            try {
                // Check if attendance already exists
                const [existing] = await db.query(
                    'SELECT * FROM attendance WHERE employee_id = ? AND date = ?',
                    [employee_id, date]
                );

                if (existing.length > 0) {
                    await db.query(
                        'UPDATE attendance SET status = ?, remarks = ? WHERE employee_id = ? AND date = ?',
                        [status, remarks, employee_id, date]
                    );
                } else {
                    await db.query(
                        'INSERT INTO attendance (employee_id, date, status, remarks) VALUES (?, ?, ?, ?)',
                        [employee_id, date, status, remarks]
                    );
                }
                
                results.push({ success: true, date });
            } catch (err) {
                results.push({ success: false, date, error: err.message });
            }
        }

        res.json({
            message: 'Bulk attendance processing completed',
            results
        });

    } catch (error) {
        console.error('Error marking bulk attendance:', error);
        res.status(500).json({ message: 'Error marking bulk attendance' });
    }
});

// Get attendance summary for an employee
router.get('/summary/:employeeId/:year/:month', authenticateToken, async (req, res) => {
    try {
        const { employeeId, year, month } = req.params;

        const [attendance] = await db.query(
            `SELECT 
                COUNT(*) as total_days,
                SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days,
                SUM(CASE WHEN status = 'work_on_holiday' THEN 1 ELSE 0 END) as work_on_holiday_days,
                SUM(CASE WHEN status = 'leave' THEN 1 ELSE 0 END) as leave_days,
                SUM(CASE WHEN status = 'holiday' THEN 1 ELSE 0 END) as holidays
            FROM attendance 
            WHERE employee_id = ? AND YEAR(date) = ? AND MONTH(date) = ?`,
            [employeeId, year, month]
        );

        res.json(attendance[0]);

    } catch (error) {
        console.error('Error fetching attendance summary:', error);
        res.status(500).json({ message: 'Error fetching attendance summary' });
    }
});

// Get all employees with attendance count for current month
router.get('/employees-summary', authenticateToken, async (req, res) => {
    try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        const [employees] = await db.query(`
            SELECT 
                e.id,
                e.emp_id,
                e.name,
                e.designation,
                e.department,
                COUNT(a.id) as marked_days,
                SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_days,
                SUM(CASE WHEN a.status = 'leave' THEN 1 ELSE 0 END) as leave_days
            FROM employees e
            LEFT JOIN attendance a ON e.id = a.employee_id 
                AND YEAR(a.date) = ? AND MONTH(a.date) = ?
            WHERE e.status = 'active'
            GROUP BY e.id
            ORDER BY e.name ASC
        `, [year, month]);

        res.json({
            year,
            month,
            employees
        });

    } catch (error) {
        console.error('Error fetching employees summary:', error);
        res.status(500).json({ message: 'Error fetching employees summary' });
    }
});

// Delete attendance record
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const attendanceId = req.params.id;

        const [existing] = await db.query('SELECT * FROM attendance WHERE id = ?', [attendanceId]);
        
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }

        await db.query('DELETE FROM attendance WHERE id = ?', [attendanceId]);

        res.json({ message: 'Attendance record deleted successfully' });

    } catch (error) {
        console.error('Error deleting attendance:', error);
        res.status(500).json({ message: 'Error deleting attendance' });
    }
});

module.exports = router;
