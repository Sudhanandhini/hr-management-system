import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function JobApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/applications/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/applications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application');
    }
  };

  const viewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
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
          <h1>HR Management System - Applications</h1>
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
            <li><Link to="/admin/applications" className="active">Job Applications</Link></li>
            <li><Link to="/admin/employees">Employees</Link></li>
            <li><Link to="/admin/attendance">Attendance</Link></li>
          </ul>
        </aside>

        <main className="dashboard-content">
          <div className="dashboard-header">
            <h2>Job Applications</h2>
            <p>Review and manage job applications</p>
          </div>

          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Applicant Name</th>
                    <th>Job Title</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Experience</th>
                    <th>Domain</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id}>
                      <td>{app.name}</td>
                      <td>{app.job_title}</td>
                      <td>{app.email}</td>
                      <td>{app.phone}</td>
                      <td>{app.experience}</td>
                      <td>{app.domain}</td>
                      <td>{new Date(app.applied_at).toLocaleDateString()}</td>
                      <td>
                        <select 
                          className={`status-badge status-${app.status}`}
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          style={{ border: 'none', cursor: 'pointer' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                      <td className="action-buttons">
                        <button 
                          className="btn btn-primary btn-sm" 
                          onClick={() => viewDetails(app)}
                        >
                          View
                        </button>
                        {app.resume && (
                          <a 
                            href={`http://localhost:5000/uploads/resumes/${app.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-sm"
                            style={{ textDecoration: 'none' }}
                          >
                            Resume
                          </a>
                        )}
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => handleDelete(app.id)}
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

      {showDetailsModal && selectedApplication && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Application Details</h3>
              <button className="close-btn" onClick={() => setShowDetailsModal(false)}>&times;</button>
            </div>
            <div style={{ lineHeight: '1.8' }}>
              <p><strong>Name:</strong> {selectedApplication.name}</p>
              <p><strong>Email:</strong> {selectedApplication.email}</p>
              <p><strong>Phone:</strong> {selectedApplication.phone}</p>
              <p><strong>Job Title:</strong> {selectedApplication.job_title}</p>
              <p><strong>Experience:</strong> {selectedApplication.experience}</p>
              <p><strong>Domain:</strong> {selectedApplication.domain}</p>
              <p><strong>Applied On:</strong> {new Date(selectedApplication.applied_at).toLocaleString()}</p>
              <p><strong>Status:</strong> <span className={`status-badge status-${selectedApplication.status}`}>
                {selectedApplication.status}
              </span></p>
              {selectedApplication.cover_letter && (
                <>
                  <p><strong>Cover Letter:</strong></p>
                  <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '5px', marginTop: '0.5rem' }}>
                    {selectedApplication.cover_letter}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobApplications;
