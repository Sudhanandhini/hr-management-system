# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Database Setup (2 minutes)
```bash
# Open MySQL and run:
source database/schema.sql
```
**OR** Import `database/schema.sql` via phpMyAdmin

### 2. Backend Setup (1 minute)
```bash
cd backend
npm install
# Edit .env with your MySQL password
npm start
```

### 3. Frontend Setup (1 minute)
```bash
cd frontend
npm install
npm run dev
```

### 4. Login & Start Using
- Open: http://localhost:3000
- Admin Login: http://localhost:3000/admin/login
- Username: **admin**
- Password: **admin123**

## 📋 Features Checklist

### ✅ Admin Features
- [x] Login with authentication
- [x] Dashboard with 4 modules
- [x] Job vacancy CRUD operations
- [x] View job applications with resume download
- [x] Employee CRUD operations  
- [x] Monthly attendance with auto weekend detection

### ✅ Public Features
- [x] View active job openings
- [x] Apply for jobs with resume upload
- [x] Responsive design

### ✅ Attendance Rules
- [x] Every Sunday = Holiday
- [x] 1st & 3rd Saturday = Holiday
- [x] 2nd, 4th, 5th Saturday = Working day
- [x] Options: Present, Work on Holiday, Leave

## 🎯 Common Tasks

### Add a New Job
1. Admin Dashboard → Job Vacancies
2. Click "Add New Job"
3. Fill details → Submit
4. Job appears on homepage

### Mark Employee Attendance
1. Admin Dashboard → Attendance
2. Select Year & Month
3. Click "Mark Attendance" for employee
4. Select status for each day

### View Applications
1. Admin Dashboard → Applications
2. View all applications
3. Update status, download resumes

## 📁 File Structure
```
hr-management-system/
├── backend/
│   ├── config/db.js              # Database connection
│   ├── controllers/              # Business logic
│   ├── middleware/               # Auth middleware
│   ├── routes/                   # API routes
│   ├── uploads/resumes/          # Resume uploads
│   ├── server.js                 # Main server file
│   └── .env                      # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── App.jsx              # Main app
│   │   └── main.jsx             # Entry point
│   └── .env                      # Frontend config
└── database/
    └── schema.sql                # Database schema
```

## 🔑 Default Login
- **URL:** http://localhost:3000/admin/login
- **Username:** admin
- **Password:** admin123

## ⚠️ Important Notes
1. Both backend (port 5000) and frontend (port 3000) must be running
2. Update `.env` files with correct credentials
3. Import database schema before starting
4. Ensure MySQL is running

## 🐛 Quick Troubleshooting
- **Can't connect to database?** → Check MySQL is running & credentials in backend/.env
- **CORS error?** → Ensure backend is running on port 5000
- **Login not working?** → Verify database schema was imported
- **Resume upload failing?** → Check backend/uploads/resumes folder exists

## 📞 Need Help?
Check `SETUP_GUIDE.md` for detailed instructions and troubleshooting.
