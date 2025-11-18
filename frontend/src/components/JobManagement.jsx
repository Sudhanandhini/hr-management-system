import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function JobManagement({ onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    job_title: '',
    department: '',
    location: '',
    experience_required: '',
    job_description: '',
    requirements: '',
    salary_range: '',
    job_type: 'Full-time',
    posted_date: new Date().toISOString().split('T')[0],
    status: 'active'
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
      setShowForm(false);
      setEditingJob(null);
      resetForm();
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData(job);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      job_title: '',
      department: '',
      location: '',
      experience_required: '',
      job_description: '',
      requirements: '',
      salary_range: '',
      job_type: 'Full-time',
      posted_date: new Date().toISOString().split('T')[0],
      status: 'active'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="hover:underline">← Dashboard</Link>
            <h1 className="text-2xl font-bold">Job Management</h1>
          </div>
          <button onClick={onLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="mb-6">
          <button
            onClick={() => { setShowForm(!showForm); setEditingJob(null); resetForm(); }}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            {showForm ? 'Cancel' : 'Add New Job'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4">{editingJob ? 'Edit Job' : 'Add New Job'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Job Title *</label>
                  <input
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Department *</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Experience Required *</label>
                  <input
                    type="text"
                    name="experience_required"
                    value={formData.experience_required}
                    onChange={handleChange}
                    placeholder="e.g., 2-5 years"
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Salary Range</label>
                  <input
                    type="text"
                    name="salary_range"
                    value={formData.salary_range}
                    onChange={handleChange}
                    placeholder="e.g., 5-8 LPA"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Job Type *</label>
                  <select
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Posted Date *</label>
                  <input
                    type="date"
                    name="posted_date"
                    value={formData.posted_date}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Job Description *</label>
                <textarea
                  name="job_description"
                  value={formData.job_description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Requirements</label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                {editingJob ? 'Update Job' : 'Add Job'}
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{job.job_title}</h3>
                  <p className="text-gray-600">{job.department} | {job.location}</p>
                  <p className="text-gray-600">Experience: {job.experience_required}</p>
                  <p className="text-gray-700 mt-2">{job.job_description}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded text-sm ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {job.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(job)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobManagement;
