require('dotenv').config({ path: './.env' });
const connectDB = require('./db/index.js');
const { app } = require('./app.js');

let dbConnectionAttempted = false;
let dbConnected = false;

// Attempt database connection
const initializeDatabase = async () => {
  if (dbConnectionAttempted) return Promise.resolve(dbConnected);
  dbConnectionAttempted = true;
  
  try {
    console.log('🔄 Attempting MongoDB connection...');
    await connectDB();
    dbConnected = true;
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('⚠️ Database connection failed:', error.message);
    dbConnected = false;
    return false;
  }
};

// Initialize database immediately
initializeDatabase();

// For local development, start server
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running at port: ${PORT}`);
  });
}

// For serverless, export app
module.exports = app;

module.exports = app;
