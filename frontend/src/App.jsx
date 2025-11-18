import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import JobManagement from './components/JobManagement';
import ApplicationsList from './components/ApplicationsList';
import EmployeeManagement from './components/EmployeeManagement';
import AttendanceManagement from './components/AttendanceManagement';
import MonthlyAttendance from './components/MonthlyAttendance';
import HomePage from './components/HomePage';
import ApplicationForm from './components/ApplicationForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apply/:jobId" element={<ApplicationForm />} />
        <Route path="/admin/login" element={isAuthenticated ? <Navigate to="/admin/dashboard" /> : <AdminLogin onLogin={handleLogin} />} />
        <Route path="/admin/dashboard" element={isAuthenticated ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/jobs" element={isAuthenticated ? <JobManagement onLogout={handleLogout} /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/applications" element={isAuthenticated ? <ApplicationsList onLogout={handleLogout} /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/employees" element={isAuthenticated ? <EmployeeManagement onLogout={handleLogout} /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/attendance" element={isAuthenticated ? <AttendanceManagement onLogout={handleLogout} /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/attendance/:empId/:year/:month" element={isAuthenticated ? <MonthlyAttendance onLogout={handleLogout} /> : <Navigate to="/admin/login" />} />
      </Routes>
    </Router>
  );
}

export default App;