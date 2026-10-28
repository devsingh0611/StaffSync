const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Health Check & Welcome Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'StaffSync HRMS API',
    version: '1.0.0',
    status: 'Operational',
    timestamp: new Date(),
    endpoints: {
      auth: '/api/auth',
      employees: '/api/employees',
      leaves: '/api/leaves',
      attendance: '/api/attendance',
      announcements: '/api/announcements',
      trainings: '/api/trainings',
      dashboard: '/api/dashboard',
    },
  });
});

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/trainings', require('./routes/trainingRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Serve static frontend build if available
const frontendDist = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: 'StaffSync HRMS Backend is active. Frontend build not detected in ../frontend/dist.',
    });
  });
}

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(` StaffSync Backend Server running on port ${PORT} `);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Base URL: http://localhost:${PORT}`);
  console.log(`===============================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

module.exports = app;
