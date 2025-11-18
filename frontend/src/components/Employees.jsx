import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    emp_id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    designation: '',
    department: '',
    join_date: '',
    salary: '',
    status: 'active'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (editingEmployee) {
        await axios.put(`${API_URL}/employees/${editingEmployee.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/employees`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      setEditingEmployee(null);
      resetForm();
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert(error.response?.data?.message || 'Failed to save employee');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      emp_id: employee.emp_id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      address: employee.address || '',
      designation: employee.designation || '',
      department: employee.department || '',
      join_date: employee.join_date ? employee.join_date.split('T')[0] : '',
      salary: employee.salary || '',
      status: employee.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/employees/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  const resetForm = () => {
    setFormData({
      emp_id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      designation: '',
      department: '',
      join_date: '',
      salary: '',
      status: 'active'
    });
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
          <h1>HR Management System - Employees</h1>
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
            <li><Link to="/admin/employees" className="active">Employees</Link></li>
            <li><Link to="/admin/attendance">Attendance</Link></li>
          </ul>
        </aside>

        <main className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h2>Employees</h2>
              <p>Manage employee records and information</p>
            </div>
            <button 
              className="btn btn-success" 
              onClick={() => {
                setEditingEmployee(null);
                resetForm();
                setShowModal(true);
              }}
            >
              + Add New Employee
            </button>
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
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Designation</th>
                    <th>Department</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.emp_id}</td>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone}</td>
                      <td>{emp.designation}</td>
                      <td>{emp.department}</td>
                      <td>{emp.join_date ? new Date(emp.join_date).toLocaleDateString() : '-'}</td>
                      <td>
                        <span className={`status-badge status-${emp.status}`}>
                          {emp.status}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button 
                          className="btn btn-warning btn-sm" 
                          onClick={() => handleEdit(emp)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => handleDelete(emp.id)}
                        >
                          Delete
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Employee ID *</label>
                  <input
                    type="text"
                    name="emp_id"
                    value={formData.emp_id}
                    onChange={handleChange}
                    required
                    disabled={editingEmployee}
                  />
                </div>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Join Date *</label>
                  <input
                    type="date"
                    name="join_date"
                    value={formData.join_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Salary</label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                />
              </div>
              <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
                {editingEmployee ? 'Update Employee' : 'Add Employee'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employees;
