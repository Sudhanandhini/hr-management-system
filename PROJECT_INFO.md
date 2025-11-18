# 🏢 HR Management System - Complete Project

## 📦 What You Got

A **production-ready HR Management System** built with:
- ✅ MySQL Database
- ✅ Node.js + Express Backend (REST API)
- ✅ React + Vite Frontend (Modern UI)
- ✅ Complete authentication & authorization
- ✅ File upload functionality (Resume)
- ✅ Responsive design with Tailwind CSS

## 🎯 Core Features

### 1️⃣ Public Website
- View active job openings
- Apply for jobs with resume upload (PDF/DOC/DOCX)
- Clean, professional interface

### 2️⃣ Admin Panel
**Dashboard** with 4 main modules:

#### 📋 Job Vacancy Management
- Create, Edit, Update, Delete job postings
- Set job as Active/Inactive
- Full job details (title, department, location, experience, salary, description)

#### 📝 Application Management  
- View all job applications
- Download resumes
- Update application status (Pending → Reviewed → Shortlisted → Rejected)
- Delete applications

#### 👥 Employee Management
- Add, Edit, Delete employees
- Track: Employee ID, Name, Email, Phone, Address, Department, Designation, Join Date, Salary
- Set employee status (Active/Inactive)

#### 📅 Attendance Management
- Monthly attendance tracking
- **Smart Weekend Detection:**
  - Every Sunday = Holiday 🔴
  - 1st & 3rd Saturday = Holiday 🔴
  - 2nd, 4th, 5th Saturday = Working Day 🟢
- Attendance options:
  - ✅ Present
  - 💼 Work on Holiday
  - 🏖️ Leave

## 🚀 Installation Steps

### Prerequisites
```bash
Node.js v16+
MySQL 5.7+
npm or yarn
```

### Quick Setup (3 Steps)

#### Step 1: Database
```bash
# Import database/schema.sql into MySQL
# This creates everything including admin user
```

#### Step 2: Backend
```bash
cd backend
npm install
# Edit .env with your MySQL password
npm start
```
Server runs on: **http://localhost:5000**

#### Step 3: Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on: **http://localhost:3000**

## 🔐 Default Login

- **Admin URL:** http://localhost:3000/admin/login
- **Username:** admin
- **Password:** admin123

## 📁 Project Structure

```
hr-management-system/
│
├── 📂 database/
│   └── schema.sql                    ← Import this first!
│
├── 📂 backend/                       ← Node.js API
│   ├── config/db.js                 ← Database connection
│   ├── controllers/                 ← Business logic
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   ├── employeeController.js
│   │   └── attendanceController.js
│   ├── middleware/
│   │   └── authMiddleware.js        ← JWT authentication
│   ├── routes/                      ← API endpoints
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── attendanceRoutes.js
│   ├── uploads/resumes/             ← Resume storage
│   ├── server.js                    ← Main server file
│   ├── package.json
│   └── .env                         ← Configure this!
│
└── 📂 frontend/                      ← React App
    ├── src/
    │   ├── components/              ← All React components
    │   │   ├── AdminLogin.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── ApplicationForm.jsx
    │   │   ├── JobManagement.jsx
    │   │   ├── ApplicationsList.jsx
    │   │   ├── EmployeeManagement.jsx
    │   │   ├── AttendanceManagement.jsx
    │   │   └── MonthlyAttendance.jsx
    │   ├── App.jsx                  ← Main routing
    │   ├── main.jsx                 ← Entry point
    │   └── index.css                ← Tailwind CSS
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── .env                         ← Configure this!
```

## 🔧 Configuration

### Backend .env
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here     ← Change this!
DB_NAME=hr_management
JWT_SECRET=hrms_secret_key_2024
```

### Frontend .env
```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 Database Tables

1. **admin** - Admin user authentication
2. **job_vacancies** - Job postings
3. **job_applications** - User applications
4. **employees** - Employee records
5. **attendance** - Daily attendance records

## 🌐 API Endpoints

### Public Endpoints
```
GET  /api/jobs/active           - View active jobs
GET  /api/jobs/:id              - Get single job
POST /api/applications          - Submit application
```

### Protected Endpoints (Require JWT Token)
```
POST   /api/auth/login          - Admin login

Jobs:
GET    /api/jobs                - All jobs
POST   /api/jobs                - Create job
PUT    /api/jobs/:id            - Update job
DELETE /api/jobs/:id            - Delete job

Applications:
GET    /api/applications        - All applications
PUT    /api/applications/:id    - Update status
DELETE /api/applications/:id    - Delete

Employees:
GET    /api/employees           - All employees
POST   /api/employees           - Create employee
PUT    /api/employees/:id       - Update employee
DELETE /api/employees/:id       - Delete employee

Attendance:
GET    /api/attendance/monthly/:emp_id/:year/:month  - Monthly view
POST   /api/attendance          - Mark attendance
GET    /api/attendance/summary/:year/:month         - Summary
```

## 💡 Usage Guide

### For Job Seekers
1. Visit homepage
2. Browse job openings
3. Click "Apply Now"
4. Fill form & upload resume
5. Submit application

### For HR Admin

#### Managing Jobs
1. Login → Dashboard → Job Vacancies
2. Add New Job → Fill details → Submit
3. Edit/Delete existing jobs
4. Toggle Active/Inactive status

#### Reviewing Applications
1. Dashboard → Applications
2. View all applications with details
3. Download resumes
4. Update status
5. Delete if needed

#### Managing Employees
1. Dashboard → Employees
2. Add New Employee → Fill details
3. Edit employee information
4. Set Active/Inactive status

#### Marking Attendance
1. Dashboard → Attendance
2. Select Year & Month
3. Click "Mark Attendance" for employee
4. System shows calendar with:
   - Red background = Holidays (Sundays, 1st & 3rd Saturdays)
   - White background = Working days
5. Select attendance for each day:
   - Present (normal working day)
   - Work on Holiday (worked on weekend)
   - Leave (was absent)

## 🎨 Features Highlights

✅ **Secure Authentication** - JWT-based login system
✅ **File Upload** - Resume upload with validation
✅ **Responsive Design** - Works on desktop, tablet, mobile
✅ **Status Management** - Track application & employee status
✅ **Smart Attendance** - Auto-detects weekends and holidays
✅ **CRUD Operations** - Full create, read, update, delete for all modules
✅ **Professional UI** - Clean design with Tailwind CSS
✅ **RESTful API** - Well-structured backend
✅ **Protected Routes** - Secure admin panel

## 🐛 Troubleshooting

### Database Connection Failed
- ✅ Check MySQL is running
- ✅ Verify credentials in backend/.env
- ✅ Ensure schema.sql was imported

### CORS Error
- ✅ Backend must be running on port 5000
- ✅ Check VITE_API_URL in frontend/.env

### Login Not Working
- ✅ Verify schema.sql created admin user
- ✅ Check JWT_SECRET in backend/.env
- ✅ Clear browser cache/cookies

### File Upload Error
- ✅ Ensure backend/uploads/resumes/ folder exists
- ✅ Check folder permissions (write access)

### Attendance Not Visible
- ✅ Employee status must be "active"
- ✅ Check selected year/month
- ✅ Verify attendance table exists

## 🚀 Deployment

### Backend (Node.js)
- Deploy to: Heroku, Railway, DigitalOcean, AWS
- Set environment variables
- Configure MySQL connection

### Frontend (React)
- Build: `npm run build`
- Deploy `dist` folder to: Vercel, Netlify, GitHub Pages
- Update VITE_API_URL to production backend URL

### Database
- Use managed MySQL: AWS RDS, DigitalOcean Managed DB, PlanetScale
- Import schema.sql
- Update backend .env with production credentials

## 📝 Technical Stack

**Frontend:**
- React 18
- Vite (Build tool)
- React Router (Navigation)
- Axios (HTTP client)
- Tailwind CSS (Styling)

**Backend:**
- Node.js
- Express.js (Web framework)
- MySQL2 (Database driver)
- JWT (Authentication)
- Bcrypt (Password hashing)
- Multer (File upload)

**Database:**
- MySQL

## 📄 Available Documentation

1. **QUICK_START.md** - Get started in 5 minutes
2. **SETUP_GUIDE.md** - Detailed setup instructions
3. **PROJECT_INFO.md** - This file (Complete overview)

## ✨ What Makes This Special

- 🎯 **Production-Ready** - Not just a demo, ready to deploy
- 🔐 **Secure** - JWT authentication, password hashing, protected routes
- 📱 **Responsive** - Works perfectly on all devices
- 🎨 **Modern UI** - Clean design with Tailwind CSS
- 📊 **Complete CRUD** - Full database operations
- 🤖 **Smart Logic** - Auto weekend detection in attendance
- 📁 **File Management** - Resume upload & download
- 🧩 **Modular Code** - Easy to maintain and extend

## 🎓 Learning Resource

This project demonstrates:
- REST API development
- JWT authentication
- File upload handling
- CRUD operations
- React component architecture
- State management
- Form handling
- Protected routing
- Database design
- Backend-Frontend integration

Perfect for learning full-stack development!

---

## 📞 Support

For questions or issues:
1. Check the documentation files
2. Review console logs (browser & terminal)
3. Verify environment variables
4. Ensure all services are running

## 🎉 Ready to Start?

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend  
cd frontend
npm install
npm run dev

# Browser
Open: http://localhost:3000
Login: admin / admin123
```

**Happy Coding! 🚀**
