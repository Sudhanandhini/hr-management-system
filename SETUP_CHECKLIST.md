# ✅ Setup Checklist

## Before You Start
- [ ] Node.js installed (v16+)
- [ ] MySQL installed and running
- [ ] phpMyAdmin or MySQL Workbench (optional)
- [ ] Code editor (VS Code recommended)

---

## Database Setup
- [ ] MySQL server is running
- [ ] Import `database/schema.sql` into MySQL
- [ ] Verify `hr_management` database is created
- [ ] Verify tables are created (5 tables)
- [ ] Test admin login: admin@hrms.com / admin123

---

## Backend Configuration
- [ ] Navigate to `backend` folder
- [ ] Run `npm install`
- [ ] Create `uploads/resumes` folder
- [ ] Update `.env` file:
  - [ ] Set `DB_PASSWORD` to your MySQL password
  - [ ] Set `JWT_SECRET` to a secure random string
- [ ] Run `npm start`
- [ ] Verify server starts on port 5000
- [ ] Test API: Open `http://localhost:5000/api/health`

---

## Frontend Configuration
- [ ] Navigate to `frontend` folder
- [ ] Run `npm install`
- [ ] Verify `.env` has correct API URL
- [ ] Run `npm run dev`
- [ ] Verify app opens on port 5173
- [ ] Open `http://localhost:5173` in browser

---

## Testing
- [ ] Public site loads job listings
- [ ] Can navigate to admin login
- [ ] Can login with admin/admin123
- [ ] Dashboard loads successfully
- [ ] Can view job vacancies
- [ ] Can add new job
- [ ] Can view applications
- [ ] Can view employees
- [ ] Can access attendance page
- [ ] Can mark attendance for an employee

---

## Post-Setup Tasks
- [ ] Change default admin password
- [ ] Add your company information
- [ ] Customize job categories
- [ ] Add real employee data
- [ ] Configure resume upload limits
- [ ] Set up backup strategy
- [ ] Review security settings

---

## Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution:** 
- Check MySQL is running
- Verify credentials in `.env`
- Check database exists

### Issue: "Port 5000 already in use"
**Solution:**
- Stop other applications on port 5000
- Change PORT in backend `.env`

### Issue: "Cannot find module"
**Solution:**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

### Issue: "Resume upload fails"
**Solution:**
- Check `uploads/resumes` folder exists
- Check folder permissions
- Verify file size < 5MB

---

## Production Checklist
- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Use environment variables
- [ ] Enable error logging
- [ ] Set up monitoring
- [ ] Configure file upload limits
- [ ] Review security headers

---

## Need Help?

📖 Check `QUICK_START.md` for fast setup
📚 Check `README.md` for detailed documentation
🐛 Review troubleshooting section in README

---

**Happy Building! 🎉**
