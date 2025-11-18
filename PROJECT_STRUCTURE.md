# HR Management System - Project Structure

## Folder Structure

```
hr-management-system/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── jobs.js
│   │   ├── applications.js
│   │   ├── employees.js
│   │   └── attendance.js
│   └── uploads/
│       └── resumes/
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── .env
│   ├── public/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── index.css
│       └── components/
│           ├── Home.jsx
│           ├── Login.jsx
│           ├── AdminDashboard.jsx
│           ├── JobApplications.jsx
│           ├── JobVacancies.jsx
│           ├── Employees.jsx
│           ├── Attendance.jsx
│           ├── MonthlyAttendance.jsx
│           └── ApplicationForm.jsx
│
└── database/
    └── schema.sql
```

## Database Tables

1. **admins** - Admin user credentials
2. **jobs** - Job vacancy details
3. **applications** - Job application submissions
4. **employees** - Employee information
5. **attendance** - Employee attendance records

## Features

### Frontend (React + Vite)
- Home page with job listings
- Application form for job seekers
- Admin login
- Admin dashboard with navigation
- Job vacancy management
- Application viewing
- Employee management
- Attendance tracking with holiday logic

### Backend (Node.js + Express)
- REST API endpoints
- JWT authentication
- File upload for resumes
- MySQL database integration
- CORS enabled

### Special Features
- Sunday always holiday
- 1st and 3rd Saturday holiday
- 2nd, 4th, 5th Saturday working day
- Attendance options: Present, Work on Holiday, Leave
