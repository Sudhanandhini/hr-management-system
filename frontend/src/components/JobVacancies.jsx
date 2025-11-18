import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function JobVacancies() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    experience: '',
    domain: '',
    location: '',
    job_type: 'Full-time',
    salary_range: '',
    requirements: '',
    status: 'active'
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/jobs/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
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
      if (editingJob) {
        await axios.put(`${API_URL}/jobs/${editingJob.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/jobs`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowModal(false);
      setEditingJob(null);
      resetForm();
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      alert('Failed to save job');
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description || '',
      experience: job.experience,
      domain: job.domain,
      location: job.location || '',
      job_type: job.job_type || 'Full-time',
      salary_range: job.salary_range || '',
      requirements: job.requirements || '',
      status: job.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      experience: '',
      domain: '',
      location: '',
      job_type: 'Full-time',
      salary_range: '',
      requirements: '',
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
          <h1>HR Management System - Job Vacancies</h1>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        <aside className="sidebar">
          <ul className="sidebar-menu">
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/jobs" className="active">Job Vacancies</Link></li>
            <li><Link to="/admin/applications">Job Applications</Link></li>
            <li><Link to="/admin/employees">Employees</Link></li>
            <li><Link to="/admin/attendance">Attendance</Link></li>
          </ul>
        </aside>

        <main className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h2>Job Vacancies</h2>
              <p>Manage job postings and openings</p>
            </div>
            <button 
              className="btn btn-success" 
              onClick={() => {
                setEditingJob(null);
                resetForm();
                setShowModal(true);
              }}
            >
              + Add New Job
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Domain</th>
                    <th>Experience</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.title}</td>
                      <td>{job.domain}</td>
                      <td>{job.experience}</td>
                      <td>{job.location}</td>
                      <td>
                        <span className={`status-badge status-${job.status}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button 
                          className="btn btn-warning btn-sm" 
                          onClick={() => handleEdit(job)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => handleDelete(job.id)}
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingJob ? 'Edit Job' : 'Add New Job'}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Domain *</label>
                <input
                  type="text"
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Experience *</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2-4 years"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Job Type</label>
                <select name="job_type" value={formData.job_type} onChange={handleChange}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="form-group">
                <label>Salary Range</label>
                <input
                  type="text"
                  name="salary_range"
                  value={formData.salary_range}
                  onChange={handleChange}
                  placeholder="e.g., 3-5 LPA"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Requirements</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button type="submit" className="btn btn-success" style={{ width: '100%' }}>
                {editingJob ? 'Update Job' : 'Create Job'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobVacancies;
