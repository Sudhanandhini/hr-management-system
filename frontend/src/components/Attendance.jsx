import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Attendance() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/attendance/employees-summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>HR Management System - Attendance</h1>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/jobs">Job Vacancies</Link></li>
            <li><Link to="/admin/applications">Job Applications</Link></li>
            <li><Link to="/admin/employees">Employees</Link></li>
            <li><Link to="/admin/attendance" className="active">Attendance</Link></li>
          </ul>
        </aside>

        <main className="dashboard-content">
          <div className="dashboard-header">
            <h2>Employee Attendance</h2>
            <p>Mark and manage employee attendance</p>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Department</th>
                    <th>Days Marked (This Month)</th>
                    <th>Present Days</th>
                    <th>Leave Days</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.emp_id}</td>
                      <td>{emp.name}</td>
                      <td>{emp.designation || '-'}</td>
                      <td>{emp.department || '-'}</td>
                      <td>{emp.marked_days}</td>
                      <td>{emp.present_days}</td>
                      <td>{emp.leave_days}</td>
                      <td>
                        <button 
                          className="btn btn-success btn-sm" 
                          onClick={() => navigate(`/admin/attendance/${emp.id}`)}
                        >
                          Mark Attendance
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Attendance;
