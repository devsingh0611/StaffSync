# StaffSync – Modern Human Resource Management System

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React.js](https://img.shields.io/badge/React.js-18+-blue.svg)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-brightgreen.svg)](https://www.mongodb.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**StaffSync** is a full-stack, enterprise-grade Human Resource Management System (HRMS) built using the MERN stack (**MongoDB, Express.js, React.js, Node.js**) with Bootstrap 5 and modern SaaS design principles. Designed to streamline and automate day-to-day HR operations within organizations, StaffSync provides distinct, role-based workflows for **HR Administrators**, **Managers**, and **Employees**.

---

## 🌟 Key Features by Role

### 1. 🛡️ HR Administrator Module
- **Dashboard Analytics**: Real-time KPI statistics including Total Staff, Present Today, Absent, Pending Leave requests, and Approved leaves.
- **Interactive Data Visualizations**: Department-wise staff distribution bar charts and live attendance ratio donut charts powered by Recharts.
- **Employee Management (Full CRUD)**:
  - Add new employees with role, department, designation, and manager assignment.
  - Search employees by name, employee ID, or email.
  - Filter directory by department and role.
  - View comprehensive employee profile modal with leave history and attendance stats.
  - Edit employee records and delete employees with confirmation guardrails.
- **Leave Management**:
  - Review all organizational leave applications across departments.
  - Filter leaves by status: *All*, *Pending*, *Approved*, *Rejected*.
  - Approve or reject leave applications with custom HR notes and remarks.
- **Attendance Monitoring**:
  - Real-time timecard tracking with check-in, check-out, and total working hours.
  - Filter attendance by specific calendar date and department.
  - Manual attendance override/adjustment tool for HR records.
- **Company Announcements**:
  - Publish news and bulletins with priority tags (*Urgent*, *High*, *Medium*, *Low*).
  - Target announcements to specific departments or company-wide.
  - Edit and delete published announcements.
- **Training Management**:
  - Create and oversee company training programs, workshops, and certifications.
  - Assign participants and monitor program status (*Upcoming*, *Ongoing*, *Completed*).

### 2. 👔 Manager Module
- **Manager Dashboard**: Overview of direct reports, team attendance today, pending leave approvals, and active team training programs.
- **Team Directory**: View profiles, contact details, designations, and joining dates of assigned team members.
- **Team Leave Approvals**: Review and take action on leave requests submitted by direct reports with manager remarks.
- **Team Attendance**: Monitor daily and monthly attendance records and logged hours of team members.
- **Training Program Management**: Create workshops and assign team members for continuous professional development.

### 3. 👤 Employee Module
- **Personal Dashboard**: Live workplace clock, today's timecard status, monthly present days, leave balance counter (18-day quota), and recent updates.
- **One-Click Biometric Attendance**:
  - **Check In** with time capture and automatic late detection (after 9:30 AM).
  - **Check Out** with automatic working hours computation and half-day detection.
  - Monthly timecard history with total hours and average daily hours.
- **Leave Applications**:
  - Apply for leave by type (*Casual, Sick, Paid, Annual, Maternity/Paternity, Unpaid*), date range, and reason.
  - View personal leave balance and status of pending requests.
  - Cancel pending leave requests prior to manager/HR review.
- **Assigned Trainings**: Browse assigned skill development programs and track completion status.
- **Company Bulletins**: Read organizational announcements with priority tags.
- **My Profile & Account Security**: Update permitted contact details (phone, address) and change login password.

---

## ⚡ Quick Demo Credentials

For convenience during mentor evaluations and live demonstrations, the login interface features **1-Click Demo Buttons** that automatically populate credentials:

| Role | Email | Password | Assigned Department |
| :--- | :--- | :--- | :--- |
| **HR Administrator** | `hr@staffsync.com` | `password123` | Human Resources |
| **Engineering Manager** | `david.mitchell@staffsync.com` | `password123` | Engineering |
| **Marketing Manager** | `elena.rodriguez@staffsync.com` | `password123` | Marketing |
| **Employee (Full-Stack)** | `employee@staffsync.com` | `password123` | Engineering (Reports to David) |
| **Employee (Frontend)** | `priya.sharma@staffsync.com` | `password123` | Engineering (Reports to David) |

---

## 🛠️ Technology Stack

- **Frontend**:
  - React.js 18
  - Vite (Ultra-fast build tool)
  - Bootstrap 5.3 & Custom Modern SaaS CSS
  - React Router DOM v6 (Role-protected routing)
  - Axios (HTTP client with JWT interceptors)
  - Recharts (Interactive charts & analytics)
  - React Icons (Modern icon pack)
- **Backend**:
  - Node.js (v18+ / v20+)
  - Express.js (REST API framework)
  - JSON Web Tokens (JWT authentication)
  - bcrypt.js (Secure password hashing)
  - CORS, Morgan logger, Dotenv
- **Database**:
  - MongoDB Atlas (Cloud database) or Local MongoDB
  - Mongoose ODM (Data modeling & validation)

---

## 📂 Project Directory Structure

```
StaffSync/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & configuration
│   ├── controllers/
│   │   ├── announcementController.js
│   │   ├── attendanceController.js
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── employeeController.js
│   │   ├── leaveController.js
│   │   └── trainingController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role authorization
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/
│   │   ├── Announcement.js       # Company news schema
│   │   ├── Attendance.js         # Daily timecard schema
│   │   ├── Leave.js              # Time-off requests schema
│   │   ├── Training.js           # Skill training schema
│   │   └── User.js               # User & staff member schema
│   ├── routes/
│   │   ├── announcementRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── leaveRoutes.js
│   │   └── trainingRoutes.js
│   ├── utils/
│   │   └── seed.js               # Database seeder with complete sample data
│   ├── .env                      # Server environment configuration
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express application entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx # Role-based route guard
│   │   │   └── StatCard.jsx       # Reusable KPI metric card
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Authentication & user state store
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx# Responsive sidebar, navbar, & footer
│   │   ├── pages/
│   │   │   ├── auth/              # Login, Register, Forgot Password
│   │   │   ├── common/            # MyProfile, Settings
│   │   │   ├── employee/          # Employee Dashboard, ApplyLeave, Attendance, Trainings
│   │   │   ├── hr/                # HR Dashboard, Employees, Leaves, Attendance, Announcements
│   │   │   ├── manager/           # Manager Dashboard, Team, Leaves, Attendance
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js             # Axios instance with JWT interceptors
│   │   ├── App.jsx                # Main route configuration
│   │   ├── index.css              # Custom SaaS design styling
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js             # Vite configuration with API proxy
│
├── .gitignore
├── package.json                   # Root workspace scripts
└── README.md
```

---

## 🚀 Installation & Local Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- MongoDB: Free [MongoDB Atlas Cluster](https://www.mongodb.com/products/platform/atlas-database) or local MongoDB installed.

### Step 1: Clone or Open the Repository
```bash
git clone https://github.com/your-username/StaffSync.git
cd StaffSync
```

### Step 2: Configure Environment Variables
In the `backend/` directory, create or inspect `.env`:
```ini
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/staffsync?retryWrites=true&w=majority
JWT_SECRET=staffsync_super_secret_jwt_key_2026_xyz
JWT_EXPIRE=7d
NODE_ENV=development
```
*(Replace `<username>` and `<password>` with your MongoDB Atlas database user credentials).*

### Step 3: Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 4: Seed the Database with Sample Records
Populate 1 HR Administrator, 2 Managers, 8 Employees, initial attendance records, leaves, announcements, and training programs:
```bash
cd backend
node utils/seed.js
```

### Step 5: Start the Development Servers
Open two terminal windows:

**Terminal 1 (Backend API Server):**
```bash
cd backend
npm start
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Vite runs hot-reload UI on http://localhost:3000
```

Open `http://localhost:3000` in your web browser.

---

## 📡 REST API Reference

| Method | Endpoint | Access Level | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register new staff account |
| **POST** | `/api/auth/login` | Public | Authenticate user & issue JWT token |
| **GET** | `/api/auth/me` | Authenticated | Retrieve current user profile |
| **PUT** | `/api/auth/profile` | Authenticated | Update allowed personal profile info |
| **PUT** | `/api/auth/password` | Authenticated | Update user password |
| **GET** | `/api/dashboard/hr` | HR Admin | Get HR dashboard statistics & charts |
| **GET** | `/api/dashboard/manager` | Manager | Get team stats & pending approvals |
| **GET** | `/api/dashboard/employee`| Employee | Get personal timecard & leave balance |
| **GET** | `/api/employees` | HR, Manager | List employees with search & dept filter |
| **POST** | `/api/employees` | HR Admin | Create a new employee |
| **PUT** | `/api/employees/:id` | HR Admin | Update employee details & manager assignment |
| **DELETE**| `/api/employees/:id` | HR Admin | Delete employee & associated data |
| **GET** | `/api/leaves` | Authenticated | Get leaves (HR=all, Manager=team, Employee=self) |
| **POST** | `/api/leaves` | Authenticated | Submit new leave application |
| **PUT** | `/api/leaves/:id/status`| HR, Manager| Approve or reject leave request |
| **PUT** | `/api/leaves/:id/cancel`| Employee | Cancel pending leave request |
| **POST** | `/api/attendance/check-in`| Authenticated | Mark daily check-in |
| **POST** | `/api/attendance/check-out`| Authenticated| Mark daily check-out & calculate hours |
| **GET** | `/api/attendance/today` | Authenticated | Get today's attendance status |
| **GET** | `/api/attendance/my-history`| Authenticated| Monthly attendance log for current user |
| **GET** | `/api/attendance` | HR, Manager | Company/team attendance for selected date |
| **POST** | `/api/announcements` | HR Admin | Create corporate announcement |
| **GET** | `/api/announcements` | Authenticated | Read company announcements |
| **POST** | `/api/trainings` | HR, Manager | Create training program |
| **GET** | `/api/trainings` | Authenticated | List assigned or created trainings |

---

## ☁️ Deployment Guide

### Option 1: Full-Stack on Render (Single Service)
Since `backend/server.js` serves both the Express API and the static React build from `frontend/dist`:
1. Build the frontend: `cd frontend && npm run build`
2. Push your code to GitHub.
3. On [Render](https://render.com/), create a new **Web Service** connected to your repository.
4. Set Build Command: `cd frontend && npm install && npm run build && cd ../backend && npm install`
5. Set Start Command: `cd backend && node server.js`
6. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`.

### Option 2: Split Deployment (Render Backend + Vercel Frontend)
1. **Backend on Render**:
   - Create Web Service from the `backend` folder.
   - Set Build Command: `npm install`
   - Set Start Command: `node server.js`
   - Copy your Render backend URL (e.g., `https://staffsync-api.onrender.com`).
2. **Frontend on Vercel**:
   - Import your repository on [Vercel](https://vercel.com/).
   - Set Root Directory to `frontend`.
   - Add Environment Variable: `VITE_API_URL=https://staffsync-api.onrender.com/api`
   - Deploy!

---

## 🎓 Mentor Demonstration Walkthrough

When presenting StaffSync to your mentor or evaluators:
1. **Authentication Demonstration**:
   - Click the **[HR Admin]** quick demo button on the login screen and sign in as Sarah Jenkins.
   - Showcase the HR Dashboard with live employee distribution charts, present vs. absent ratios, and pending leaves.
2. **Employee Management**:
   - Navigate to **Employees**. Show the live search bar (type "Alex" or "EMP-1004") and filter by department.
   - Click **Add New Employee** to demonstrate validation and auto-generated IDs.
   - Click **View Profile** to show the rich modal containing leave history and contact information.
3. **Leave Workflow Simulation**:
   - Open an incognito browser window and log in as **Employee** (`employee@staffsync.com`).
   - Navigate to **Apply Leave**. Apply for a 2-day "Casual Leave" with a reason.
   - Switch back to the **HR Admin** or **Manager** window, go to **Leave Requests**, and click **Approve** with remarks.
   - Refresh the employee screen to demonstrate real-time status update from *Pending* to *Approved*.
4. **Attendance System**:
   - On the employee dashboard, demonstrate the **Check In** and **Check Out** workflow with automatic working hours computation.
   - On the HR screen, open **Attendance Monitor** to show company-wide logs and date selection.
5. **Role-Based Access Control**:
   - Log in as an Employee and attempt to manually navigate to `/hr/dashboard` or `/hr/employees`.
   - Show how the route guard automatically prevents unauthorized access and safely redirects the user.

---

## 📄 License
This project is licensed under the MIT License.
