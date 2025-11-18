// controllers/attendanceController.js
const db = require('../config/db');

// Get monthly attendance for an employee
const getMonthlyAttendance = async (req, res) => {
  try {
    const { empId, year, month } = req.params;
    const parsedYear = parseInt(year, 10);
    const parsedMonth = parseInt(month, 10);

    if (!empId || isNaN(parsedYear) || isNaN(parsedMonth)) {
      return res.status(400).json({ message: 'Invalid parameters' });
    }

    // Get employee details (lookup by numeric id)
    const [employees] = await db.query(
      'SELECT * FROM employees WHERE id = ?',
      [empId]
    );

    if (employees.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const employee = employees[0];

    // Get attendance records for the month
    const [attendance] = await db.query(
      `SELECT * FROM attendance 
       WHERE emp_id = ? 
       AND YEAR(attendance_date) = ? 
       AND MONTH(attendance_date) = ?
       ORDER BY attendance_date`,
      [empId, parsedYear, parsedMonth]
    );

    // Calculate month statistics
    const daysInMonth = new Date(parsedYear, parsedMonth, 0).getDate();
    let sundays = 0;
    let holidaySaturdays = 0;
    let workingSaturdays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(parsedYear, parsedMonth - 1, day);
      const dayOfWeek = date.getDay();
      const weekOfMonth = Math.ceil(day / 7);

      if (dayOfWeek === 0) {
        sundays++;
      } else if (dayOfWeek === 6) {
        if (weekOfMonth === 1 || weekOfMonth === 3) {
          holidaySaturdays++;
        } else {
          workingSaturdays++;
        }
      }
    }

    const totalDays = daysInMonth;
    const workingDays = totalDays - sundays - holidaySaturdays;

    // Calculate attendance statistics
    let presentDays = 0;
    let holidayDays = 0;
    let workOnHolidayEarned = 0;
    let leaveDays = 0;
    let clTaken = 0;
    let elTaken = 0;
    let workOnHolidayUsed = 0;

    attendance.forEach(record => {
      if (record.status === 'present') {
        presentDays++;
      } else if (record.status === 'holiday') {
        holidayDays++;
      } else if (record.status === 'work_on_holiday') {
        workOnHolidayEarned++;
        presentDays++;
      } else if (record.status === 'leave') {
        leaveDays++;
        if (record.leave_type === 'cl') {
          clTaken++;
        } else if (record.leave_type === 'el') {
          elTaken++;
        } else if (record.leave_type === 'work_on_holiday') {
          workOnHolidayUsed++;
        }
      }
    });

    // Get employee leave balance from employee_leaves table
    const [leaveRecords] = await db.query(
      `SELECT * FROM employee_leaves 
       WHERE emp_id = ? AND year = ? AND month = ?
       ORDER BY id DESC LIMIT 1`,
      [empId, parsedYear, parsedMonth]
    );

    let leaveData = {
      clAllocated: 1,
      clUsed: clTaken,
      clBalance: 1 - clTaken,
      elCarryForward: 0,
      elEarned: 0,
      elUsed: elTaken,
      elBalance: 0 - elTaken,
      elEarnDate: null
    };

    if (leaveRecords.length > 0) {
      const record = leaveRecords[0];
      leaveData = {
        clAllocated: record.cl_allocated || 1,
        clUsed: clTaken,
        clBalance: (record.cl_allocated || 1) - clTaken,
        elCarryForward: record.el_carry_forward || 0,
        elEarned: record.el_earned || 0,
        elUsed: elTaken,
        elBalance: (record.el_carry_forward || 0) + (record.el_earned || 0) - elTaken,
        elEarnDate: record.el_earn_date
      };
    }

    const summary = {
      totalDays,
      sundays,
      holidaySaturdays,
      workingSaturdays,
      workingDays,
      present_days: presentDays,
      holiday_days: holidayDays,
      work_on_holiday_earned: workOnHolidayEarned,
      work_on_holiday_used: workOnHolidayUsed,
      work_on_holiday_balance: workOnHolidayEarned - workOnHolidayUsed,
      leave_days: leaveDays,
      cl_taken: clTaken,
      el_taken: elTaken,
      ...leaveData
    };

    res.json({
      employee,
      attendance,
      summary
    });
  } catch (error) {
    console.error('Error fetching monthly attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update attendance for a specific day
const updateAttendance = async (req, res) => {
  try {
    const { empId, date, status, leaveType } = req.body;
    if (!empId || !date || !status) {
      return res.status(400).json({ message: 'empId, date and status are required' });
    }

    // Check if record exists
    const [existing] = await db.query(
      'SELECT * FROM attendance WHERE emp_id = ? AND attendance_date = ?',
      [empId, date]
    );

    if (existing.length > 0) {
      // Update existing record
      await db.query(
        `UPDATE attendance 
         SET status = ?, leave_type = ?, updated_at = NOW()
         WHERE emp_id = ? AND attendance_date = ?`,
        [status, leaveType || null, empId, date]
      );
    } else {
      // Insert new record
      await db.query(
        `INSERT INTO attendance (emp_id, attendance_date, status, leave_type, created_at, updated_at)
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [empId, date, status, leaveType || null]
      );
    }

    // Update employee_leaves table
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth() + 1;
    await updateEmployeeLeaves(empId, year, month);

    res.json({ message: 'Attendance updated successfully' });
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to update employee_leaves table
const updateEmployeeLeaves = async (empId, year, month) => {
  try {
    // Get all attendance for the month
    const [attendance] = await db.query(
      `SELECT * FROM attendance 
       WHERE emp_id = ? 
       AND YEAR(attendance_date) = ? 
       AND MONTH(attendance_date) = ?`,
      [empId, year, month]
    );

    let clUsed = 0;
    let elUsed = 0;
    let workOnHolidayEarned = 0;
    let workOnHolidayUsed = 0;
    let totalPresentDays = 0;
    let totalWorkingDays = 0;

    // Calculate working days in month
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      const weekOfMonth = Math.ceil(day / 7);

      if (dayOfWeek !== 0 && !(dayOfWeek === 6 && (weekOfMonth === 1 || weekOfMonth === 3))) {
        totalWorkingDays++;
      }
    }

    attendance.forEach(record => {
      if (record.status === 'present') {
        totalPresentDays++;
      } else if (record.status === 'work_on_holiday') {
        workOnHolidayEarned++;
        totalPresentDays++;
      } else if (record.status === 'leave') {
        if (record.leave_type === 'cl') {
          clUsed++;
        } else if (record.leave_type === 'el') {
          elUsed++;
        } else if (record.leave_type === 'work_on_holiday') {
          workOnHolidayUsed++;
        }
      }
    });

    // Get previous month's data for carry forward
    let elCarryForward = 0;
    const prevMonth = month === 1 ? 12 : month - 1;
    const prevYear = month === 1 ? year - 1 : year;

    const [prevRecord] = await db.query(
      `SELECT el_balance FROM employee_leaves 
       WHERE emp_id = ? AND year = ? AND month = ?
       ORDER BY id DESC LIMIT 1`,
      [empId, prevYear, prevMonth]
    );

    if (prevRecord.length > 0) {
      elCarryForward = prevRecord[0].el_balance || 0;
    }

    // Calculate EL earned (1.25 per month if present >= 20 days)
    let elEarned = 0;
    let elEarnDate = null;
    if (totalPresentDays >= 20) {
      elEarned = 1.25;
      elEarnDate = new Date(year, month - 1, totalPresentDays);
    }

    // Calculate balances
    const clAllocated = 1;
    const clBalance = clAllocated - clUsed;
    const elBalance = elCarryForward + elEarned - elUsed;

    // Check if record exists for this month
    const [existingLeave] = await db.query(
      `SELECT * FROM employee_leaves 
       WHERE emp_id = ? AND year = ? AND month = ?`,
      [empId, year, month]
    );

    if (existingLeave.length > 0) {
      // Update existing record
      await db.query(
        `UPDATE employee_leaves 
         SET cl_allocated = ?, cl_used = ?, cl_balance = ?,
             el_carry_forward = ?, el_earned = ?, el_used = ?, el_balance = ?,
             el_earn_date = ?, total_present_days = ?, total_working_days = ?,
             updated_at = NOW()
         WHERE emp_id = ? AND year = ? AND month = ?`,
        [
          clAllocated, clUsed, clBalance,
          elCarryForward, elEarned, elUsed, elBalance,
          elEarnDate, totalPresentDays, totalWorkingDays,
          empId, year, month
        ]
      );
    } else {
      // Insert new record
      await db.query(
        `INSERT INTO employee_leaves 
         (emp_id, year, month, cl_allocated, cl_used, cl_balance,
          el_carry_forward, el_earned, el_used, el_balance, el_earn_date,
          total_present_days, total_working_days, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          empId, year, month, clAllocated, clUsed, clBalance,
          elCarryForward, elEarned, elUsed, elBalance, elEarnDate,
          totalPresentDays, totalWorkingDays
        ]
      );
    }
  } catch (error) {
    console.error('Error updating employee leaves:', error);
    throw error;
  }
};

module.exports = {
  getMonthlyAttendance,
  updateAttendance
};
