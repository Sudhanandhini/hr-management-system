import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function HomePage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_URL}/jobs/active`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Career Opportunities</h1>
          <Link to="/admin/login" className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">
            Admin Login
          </Link>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Join Our Team</h2>
          <p className="text-xl text-gray-600">Explore exciting career opportunities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{job.job_title}</h3>
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-semibold">Department:</span> {job.department}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Location:</span> {job.location}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Experience:</span> {job.experience_required}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Type:</span> {job.job_type}
                </p>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">{job.job_description}</p>
              <Link
                to={`/apply/${job.id}`}
                className="block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="text-center text-gray-600 mt-12">
            <p className="text-xl">No job openings available at the moment</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
