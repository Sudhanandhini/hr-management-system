import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function ApplicationsList({ onLogout }) {
  const [applications, setApplications] = useState([]);

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
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/applications/${id}`, { application_status: status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteApplication = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/applications/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchApplications();
      } catch (error) {
        console.error('Error deleting application:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      shortlisted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="hover:underline">← Dashboard</Link>
            <h1 className="text-2xl font-bold">Job Applications</h1>
          </div>
          <button onClick={onLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resume</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {applications.map((app) => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{app.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{app.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{app.phone}</td>
                  <td className="px-6 py-4">{app.job_title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{app.experience}</td>
                  <td className="px-6 py-4">{app.domain}</td>
                  <td className="px-6 py-4">
                    <select
                      value={app.application_status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className={`px-3 py-1 rounded text-sm ${getStatusColor(app.application_status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {app.resume_path && (
                      <a
                        href={`http://localhost:5000/${app.resume_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteApplication(app.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              No applications found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApplicationsList;