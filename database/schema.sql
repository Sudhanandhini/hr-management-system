CREATE DATABASE IF NOT EXISTS hr_management;
USE hr_management;

CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admin (username, password, email) VALUES 
('admin', '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhSflQLfkxBr9P02N8RQSZ4iKm9um', 'admin@hrms.com');

CREATE TABLE job_vacancies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_title VARCHAR(200) NOT NULL,
    department VARCHAR(100),
    location VARCHAR(100),
    experience_required VARCHAR(50),
    job_description TEXT,
    requirements TEXT,
    salary_range VARCHAR(100),
    job_type VARCHAR(50),
    posted_date DATE,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE job_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    job_id INT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    experience VARCHAR(50),
    domain VARCHAR(100),
    resume_path VARCHAR(255),
    application_status ENUM('pending', 'reviewed', 'shortlisted', 'rejected') DEFAULT 'pending',
    applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES job_vacancies(id) ON DELETE CASCADE
);

CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    department VARCHAR(100),
    designation VARCHAR(100),
    join_date DATE NOT NULL,
    salary DECIMAL(10, 2),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    emp_id INT,
    attendance_date DATE NOT NULL,
    status ENUM('present', 'work_on_holiday', 'leave', 'absent') NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emp_id) REFERENCES employees(id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (emp_id, attendance_date)
);
