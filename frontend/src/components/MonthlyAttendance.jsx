import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import AttendanceRow from './AttendanceRow';

const API_URL = import.meta.env.VITE_API_URL;

function MonthlyAttendance({ onLogout }) {
  const { empId, year, month } = useParams();
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [days, setDays] = useState([]);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    generateDays();
    fetchMonthlyAttendance();
  }, [empId, year, month]);

  const generateDays = () => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const daysArray = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay();
      const weekOfMonth = Math.ceil(day / 7);
      
      let dayType = 'working';
      if (dayOfWeek === 0) {
        dayType = 'sunday';
      } else if (dayOfWeek === 6 && (weekOfMonth === 1 || weekOfMonth === 3)) {
        dayType = 'holiday_saturday';
      }
      
      daysArray.push({
        date: day,
        fullDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek],
        dayType
      });
    }
    
    setDays(daysArray);
  };

  const fetchMonthlyAttendance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/attendance/monthly/${empId}/${year}/${month}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEmployee(response.data.employee);
      setSummary(response.data.summary);
      
      const attendanceMap = {};
      response.data.attendance.forEach(record => {
        const dateKey = record.attendance_date.split('T')[0];
        attendanceMap[dateKey] = {
          status: record.status,
          leaveType: record.leave_type || 'none'
        };
      });
      setAttendance(attendanceMap);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleUpdate = () => {
    fetchMonthlyAttendance();
  };

  if (!employee || !summary) return <div className="p-8 text-center">Loading...</div>;

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin/attendance" className="hover:underline">← Back</Link>
            <h1 className="text-2xl font-bold">Monthly Attendance - {monthName} {year}</h1>
          </div>
          <button onClick={onLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        {/* Employee Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {employee.name} - {employee.emp_id}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span className="font-semibold">Department:</span> {employee.department}</div>
            <div><span className="font-semibold">Designation:</span> {employee.designation}</div>
            <div><span className="font-semibold">Month:</span> {monthName} {year}</div>
          </div>
        </div>

        {/* Monthly Report */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Monthly Attendance Report</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Month Statistics */}
            <div>
              <h4 className="font-bold mb-3 text-blue-600">Month Statistics</h4>
              <table className="w-full text-sm border">
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-semibold">Total Month Days</td>
                    <td className="p-2 text-right">{summary.totalDays}</td>
                  </tr>
                  <tr className="border-b bg-yellow-50">
                    <td className="p-2">Sunday</td>
                    <td className="p-2 text-right">{summary.sundays}</td>
                  </tr>
                  <tr className="border-b bg-yellow-50">
                    <td className="p-2">Saturday (Holiday)</td>
                    <td className="p-2 text-right">{summary.holidaySaturdays}</td>
                  </tr>
                  <tr className="border-b bg-green-50">
                    <td className="p-2">Saturday (Working)</td>
                    <td className="p-2 text-right">{summary.workingSaturdays}</td>
                  </tr>
                  <tr className="border-b font-bold">
                    <td className="p-2">Total Working Days</td>
                    <td className="p-2 text-right bg-blue-100">{summary.workingDays}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Attendance Statistics */}
            <div>
              <h4 className="font-bold mb-3 text-green-600">Attendance Statistics</h4>
              <table className="w-full text-sm border">
                <tbody>
                  <tr className="border-b bg-green-50">
                    <td className="p-2 font-semibold">Present Days</td>
                    <td className="p-2 text-right font-bold">{summary.present_days || 0}</td>
                  </tr>
                  <tr className="border-b bg-orange-50">
                    <td className="p-2">Holiday</td>
                    <td className="p-2 text-right">{summary.holiday_days || 0}</td>
                  </tr>
                  <tr className="border-b bg-blue-50">
                    <td className="p-2 font-semibold">Work on Holiday</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 pl-6">Earned</td>
                    <td className="p-2 text-right">{summary.work_on_holiday_earned || 0}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 pl-6">Used</td>
                    <td className="p-2 text-right">{summary.work_on_holiday_used || 0}</td>
                  </tr>
                  <tr className="border-b bg-green-50">
                    <td className="p-2 pl-6 font-semibold">Balance</td>
                    <td className="p-2 text-right font-bold">{summary.work_on_holiday_balance || 0}</td>
                  </tr>
                  <tr className="border-b bg-yellow-50">
                    <td className="p-2 font-semibold">Total Leave Taken</td>
                    <td className="p-2 text-right">{summary.leave_days || 0}</td>
                  </tr>
                  <tr className="border-b pl-4">
                    <td className="p-2 pl-6">├─ CL Taken</td>
                    <td className="p-2 text-right">{summary.cl_taken || 0}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 pl-6">└─ EL Taken</td>
                    <td className="p-2 text-right">{summary.el_taken || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Leave Balance */}
            <div>
              <h4 className="font-bold mb-3 text-purple-600">Leave Balance</h4>
              <table className="w-full text-sm border">
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-semibold" colSpan="2">Casual Leave (CL)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 pl-6">Allocated</td>
                    <td className="p-2 text-right">{summary.clAllocated || 1}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 pl-6">Used</td>
                    <td className="p-2 text-right">{summary.clUsed || 0}</td>
                  </tr>
                  <tr className="border-b bg-green-50">
                    <td className="p-2 pl-6 font-semibold">Balance</td>
                    <td className="p-2 text-right font-bold">{summary.clBalance || 1}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold pt-4" colSpan="2">Earned Leave (EL)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 pl-6">Carry Forward</td>
                    <td className="p-2 text-right">{summary.elCarryForward || 0}</td>
                  </tr>
                  <tr className="border-b bg-blue-50">
                    <td className="p-2 pl-6">Earned this Month</td>
                    <td className="p-2 text-right font-semibold">{summary.elEarned || 0}</td>
                  </tr>
                  {summary.elEarnDate && (
                    <tr className="border-b">
                      <td className="p-2 pl-6 text-xs">EL Earn Date</td>
                      <td className="p-2 text-right text-xs">{new Date(summary.elEarnDate).toLocaleDateString()}</td>
                    </tr>
                  )}
                  <tr className="border-b">
                    <td className="p-2 pl-6">Used</td>
                    <td className="p-2 text-right">{summary.elUsed || 0}</td>
                  </tr>
                  <tr className="border-b bg-green-50">
                    <td className="p-2 pl-6 font-semibold">Balance</td>
                    <td className="p-2 text-right font-bold">{summary.elBalance || 0}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Leave Rules */}
          <div className="mt-6 p-4 bg-blue-50 rounded">
            <h4 className="font-bold text-blue-800 mb-2">📌 Attendance Options & Rules</h4>
            <ul className="text-sm space-y-1 text-blue-900">
              <li>• <strong>Present:</strong> Regular working day</li>
              <li>• <strong>Leave (CL):</strong> Casual Leave - 1 per month allocated</li>
              <li>• <strong>Leave (EL):</strong> Earned Leave - 1.25 earned after 20+ present days</li>
              <li>• <strong>Leave (Work on Holiday):</strong> Use your Work on Holiday credit to take leave</li>
              <li>• <strong>Holiday:</strong> Company/National holiday (automatic on Sundays & 1st/3rd Saturdays)</li>
              <li>• <strong>Work on Holiday:</strong> Worked on weekend/holiday - earns you a credit</li>
            </ul>
            <div className="mt-3 p-3 bg-yellow-50 rounded border border-yellow-200">
              <p className="text-sm font-semibold text-yellow-900">💡 How it works:</p>
              <p className="text-xs text-yellow-800 mt-1">
                If you work on Oct 1st (Sunday/Holiday), you earn 1 "Work on Holiday" credit. 
                Later, you can use this credit to take leave on Oct 22nd by selecting "Leave" with type "Work on Holiday". 
                Your balance will then show: Earned: 1, Used: 1, Balance: 0
              </p>
            </div>
          </div>
        </div>

        {/* Daily Attendance Calendar */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b">
            <h3 className="text-lg font-bold">Daily Attendance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Day</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {days.map((dayInfo) => (
                  <AttendanceRow
                    key={dayInfo.fullDate}
                    dayInfo={dayInfo}
                    initialRecord={attendance[dayInfo.fullDate]}
                    empId={empId}
                    onUpdate={handleUpdate}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonthlyAttendance;