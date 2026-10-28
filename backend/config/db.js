const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/staffsync';
    
    // Connect to MongoDB
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[MongoDB Connected]: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.warn(`[MongoDB Warning]: Please verify your MONGODB_URI in backend/.env file (e.g. MongoDB Atlas connection string).`);
    // Do not crash the entire server process so API routes can still respond with meaningful error messages
    return null;
  }
};

module.exports = connectDB;
