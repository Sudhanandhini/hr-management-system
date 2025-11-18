import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1>HR Management System</h1>
          <div className="navbar-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/admin/login')}>
              Admin Login
            </button>
          </div>
        </div>
      </nav>

      <div className="home-container">
        <div className="home-header">
          <h2>Current Job Openings</h2>
          <p>Find your perfect career opportunity</p>
        </div>

        {loading ? (
          <div className="loading">Loading job openings...</div>
        ) : jobs.length === 0 ? (
          <div className="loading">No job openings available at the moment</div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job.id} className="job-card">
                <h3>{job.title}</h3>
                <div className="job-info">
                  <div className="job-info-item">
                    <strong>Domain:</strong> {job.domain}
                  </div>
                  <div className="job-info-item">
                    <strong>Experience:</strong> {job.experience}
                  </div>
                  <div className="job-info-item">
                    <strong>Location:</strong> {job.location}
                  </div>
                  <div className="job-info-item">
                    <strong>Job Type:</strong> {job.job_type}
                  </div>
                  {job.salary_range && (
                    <div className="job-info-item">
                      <strong>Salary:</strong> {job.salary_range}
                    </div>
                  )}
                </div>
                <p className="job-description">{job.description}</p>
                {job.requirements && (
                  <div className="job-info">
                    <strong>Requirements:</strong>
                    <p>{job.requirements}</p>
                  </div>
                )}
                <button 
                  className="btn btn-success" 
                  style={{ width: '100%', marginTop: '1rem' }}
                  onClick={() => navigate(`/apply/${job.id}`)}
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
