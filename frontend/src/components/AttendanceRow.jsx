import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function AttendanceRow({ dayInfo, initialRecord, empId, onUpdate }) {
  const [status, setStatus] = useState(initialRecord?.status || '');
  const [leaveType, setLeaveType] = useState(initialRecord?.leaveType || 'none');
  const [updating, setUpdating] = useState(false);

  const updateAttendance = async (newStatus, newLeaveType) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      
      // ✅ FIXED: Changed endpoint and field names
      await axios.post(`${API_URL}/attendance/update`, {
        empId: empId,
        date: dayInfo.fullDate,
        status: newStatus,
        leaveType: newLeaveType === 'none' ? null : newLeaveType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStatus(newStatus);
      setLeaveType(newLeaveType);
      onUpdate(); // Refresh summary
      
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update attendance');
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    if (!newStatus) return;
    
    const newLeaveType = newStatus === 'leave' ? leaveType : 'none';
    updateAttendance(newStatus, newLeaveType);
  };

  const handleLeaveTypeChange = (e) => {
    const newLeaveType = e.target.value;
    updateAttendance('leave', newLeaveType);
  };

  const getStatusColor = () => {
    const colors = {
      present: 'bg-green-100 text-green-800 border-green-300',
      work_on_holiday: 'bg-blue-100 text-blue-800 border-blue-300',
      leave: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      holiday: 'bg-orange-100 text-orange-800 border-orange-300',
      absent: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-white text-gray-800 border-gray-300';
  };

  const getDayTypeColor = () => {
    if (dayInfo.dayType === 'sunday' || dayInfo.dayType === 'holiday_saturday') {
      return 'bg-red-50';
    }
    return 'bg-white';
  };

  return (
    <tr className={getDayTypeColor()}>
      <td className="px-6 py-4 whitespace-nowrap font-medium">
        {dayInfo.date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {dayInfo.dayOfWeek}
        {(dayInfo.dayType === 'sunday' || dayInfo.dayType === 'holiday_saturday') && (
          <span className="ml-2 text-xs text-red-600 font-semibold">(Weekend)</span>
        )}
      </td>
      <td className="px-6 py-4">
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={updating}
          className={`px-4 py-2 border-2 rounded-lg ${getStatusColor()} ${updating ? 'opacity-50' : ''}`}
        >
          <option value="">-- Select --</option>
          <option value="present">Present</option>
          <option value="leave">Leave</option>
          <option value="holiday">Holiday</option>
          <option value="work_on_holiday">Work on Holiday</option>
        </select>
      </td>
      <td className="px-6 py-4">
        {status === 'leave' && (
          <select
            value={leaveType}
            onChange={handleLeaveTypeChange}
            disabled={updating}
            className={`px-4 py-2 border-2 rounded-lg bg-purple-50 border-purple-300 ${updating ? 'opacity-50' : ''}`}
          >
            <option value="none">-- No Leave Type --</option>
            <option value="cl">CL (Casual Leave)</option>
            <option value="el">EL (Earned Leave)</option>
            <option value="work_on_holiday">Work on Holiday</option>
          </select>
        )}
      </td>
    </tr>
  );
}

export default AttendanceRow;