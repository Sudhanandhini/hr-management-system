import { Link } from 'react-router-dom';

function AdminDashboard({ onLogout }) {
  const admin = JSON.parse(localStorage.getItem('admin') || '{}');

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">HR Management System</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {admin.username}</span>
            <button onClick={onLogout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/admin/jobs" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-blue-600 text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">Job Vacancies</h3>
            <p className="text-gray-600">Manage job postings</p>
          </Link>

          <Link to="/admin/applications" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-green-600 text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">Applications</h3>
            <p className="text-gray-600">View job applications</p>
          </Link>

          <Link to="/admin/employees" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-purple-600 text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">Employees</h3>
            <p className="text-gray-600">Manage employee records</p>
          </Link>

          <Link to="/admin/attendance" className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-orange-600 text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Attendance</h3>
            <p className="text-gray-600">Track employee attendance</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
