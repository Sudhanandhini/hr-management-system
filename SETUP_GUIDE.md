# HR Management System - Complete Setup Guide

## Project Overview
This is a complete HR Management System with admin authentication, job vacancy management, application management, employee management, and attendance tracking with automatic weekend calculation.

## Project Structure
```
hr-management-system/
├── backend/           # Node.js + Express + MySQL
├── frontend/          # React + Vite + Tailwind CSS
└── database/          # MySQL schema
```

## Prerequisites
- Node.js (v16 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Database Setup

### Step 1: Import Database
1. Open phpMyAdmin or MySQL Workbench
2. Create a new database or use existing
3. Import the file: `database/schema.sql`
4. This will create:
   - `hr_management` database
   - All required tables (admin, job_vacancies, job_applications, employees, attendance)
   - Default admin user

### Default Admin Credentials
- **Username:** admin
- **Password:** admin123

## Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Edit the `.env` file in the backend folder:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=hr_management
JWT_SECRET=hrms_secret_key_2024
```

### Step 4: Start Backend Server
```bash
npm start
```

**For Development (with auto-restart):**
```bash
npm run dev
```

Backend will run on: `http://localhost:5000`

## Frontend Setup

### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Edit the `.env` file in the frontend folder:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Start Frontend Development Server
```bash
npm run dev
```

Frontend will run on: `http://localhost:3000`

## Features

### 1. Admin Authentication
- Secure login system with JWT tokens
- Protected admin routes
- Session management

### 2. Job Vacancy Management
- Create, edit, update, delete job postings
- Set job status (active/inactive)
- Manage job details:
  - Job title, department, location
  - Experience required, salary range
  - Job description, requirements
  - Job type (Full-time, Part-time, Contract)

### 3. Job Application Management
- Public application form
- Resume upload (PDF/DOC/DOCX)
- View all applications in admin panel
- Update application status:
  - Pending
  - Reviewed
  - Shortlisted
  - Rejected
- Download resumes
- Delete applications

### 4. Employee Management
- Add, edit, delete employee records
- Employee details:
  - Employee ID, name, email, phone
  - Address, department, designation
  - Join date, salary
  - Status (active/inactive)

### 5. Attendance Management
- Monthly attendance tracking
- Automatic weekend calculation:
  - **Every Sunday:** Holiday
  - **1st & 3rd Saturday:** Holiday
  - **2nd, 4th, 5th Saturday:** Working days
- Attendance options:
  - Present
  - Work on Holiday
  - Leave
- Visual indicators for holidays
- Monthly attendance view

## Usage Instructions

### For Public Users
1. Visit `http://localhost:3000`
2. Browse available job openings
3. Click "Apply Now" on any job
4. Fill application form and upload resume
5. Submit application

### For Admin Users

#### Login
1. Visit `http://localhost:3000/admin/login`
2. Enter credentials (admin / admin123)
3. Access admin dashboard

#### Manage Jobs
1. Go to "Job Vacancies" from dashboard
2. Click "Add New Job" to create posting
3. Fill all job details
4. Set status as "Active" to display on homepage
5. Edit or delete existing jobs

#### View Applications
1. Go to "Applications" from dashboard
2. View all submitted applications
3. Update status (Reviewed, Shortlisted, Rejected)
4. Download resumes
5. Delete unwanted applications

#### Manage Employees
1. Go to "Employees" from dashboard
2. Click "Add New Employee"
3. Fill employee details
4. Edit or delete existing employees
5. Set status as "Inactive" to remove from attendance

#### Mark Attendance
1. Go to "Attendance" from dashboard
2. Select year and month
3. Click "Mark Attendance" for any employee
4. View monthly calendar with holidays highlighted
5. Select attendance status for each day:
   - Present for regular working days
   - Work on Holiday for weekend work
   - Leave for absences
6. System automatically identifies:
   - Sundays (red background)
   - Holiday Saturdays (red background)
   - Working Saturdays (normal)

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Jobs
- `GET /api/jobs` - Get all jobs (protected)
- `GET /api/jobs/active` - Get active jobs (public)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (protected)
- `PUT /api/jobs/:id` - Update job (protected)
- `DELETE /api/jobs/:id` - Delete job (protected)

### Applications
- `POST /api/applications` - Submit application (public)
- `GET /api/applications` - Get all applications (protected)
- `PUT /api/applications/:id` - Update status (protected)
- `DELETE /api/applications/:id` - Delete application (protected)

### Employees
- `GET /api/employees` - Get all employees (protected)
- `GET /api/employees/:id` - Get single employee (protected)
- `POST /api/employees` - Create employee (protected)
- `PUT /api/employees/:id` - Update employee (protected)
- `DELETE /api/employees/:id` - Delete employee (protected)

### Attendance
- `GET /api/attendance/monthly/:emp_id/:year/:month` - Get monthly attendance (protected)
- `GET /api/attendance/summary/:year/:month` - Get attendance summary (protected)
- `POST /api/attendance` - Mark attendance (protected)

## Production Build

### Backend
```bash
cd backend
npm start
```
Deploy to services like Heroku, Railway, or DigitalOcean

### Frontend
```bash
cd frontend
npm run build
```
Deploy the `dist` folder to Vercel, Netlify, or your hosting service

### Important: Update Environment Variables
When deploying, update:
- Backend: Database credentials, JWT secret
- Frontend: API URL to your production backend URL

## Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify credentials in backend `.env`
- Ensure database exists

### CORS Error
- Check backend is running
- Verify frontend API URL in `.env`
- Ensure CORS is enabled in backend

### File Upload Error
- Check `uploads/resumes` directory exists in backend
- Verify folder has write permissions

### Attendance Not Showing
- Ensure employee status is "active"
- Check date format in requests
- Verify attendance table exists

## Support
For issues or questions, check:
- Backend console for API errors
- Browser console for frontend errors
- Database logs for SQL errors

## Technologies Used
- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, MySQL2, JWT, Bcrypt, Multer
- **Database:** MySQL
