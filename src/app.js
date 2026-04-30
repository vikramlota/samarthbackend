const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const demoRoutes = require('./routes/demo.routes.js');
const app = express()
const sitemapRoutes = require('./routes/sitemap.routes.js');
const homepageRoutes = require('./routes/homepage.routes.js');
const connectDB = require('./db/index.js');

// ⚡ CRITICAL: Set CORS headers FIRST, before any other middleware
// This ensures CORS headers are sent even if routes fail

// Custom CORS Middleware - More reliable than cors()
app.use((req, res, next) => {
  const origin = req.get('origin');
  console.log(`📍 Request: ${req.method} ${req.path} | Origin: ${origin}`);
  
  // Allowed origins
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://www.thesamarthacademy.in',
    'https://thesamarthacademy.in',
  
  ];
  
  // Always set these headers
  res.setHeader('Access-Control-Allow-Origin', origin && allowedOrigins.includes(origin) ? origin : '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '3600');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS preflight handled');
    res.status(200).end();
    return;
  }
  
  next();
});

// Standard cors package config (backup)
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    return callback(null, true); // Allow all for now
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Middleware to ensure database connection for all data requests
let dbConnected = false;
let dbConnectionPromise = null;

app.use(async (req, res, next) => {
  // Skip DB check for health check or static files
  if (req.path === '/api/health' || req.path.startsWith('/public') || req.path.includes('.')) {
    return next();
  }

  if (!dbConnected) {
    if (!dbConnectionPromise) {
      console.log('🔄 Connecting to database on first API request...');
      dbConnectionPromise = connectDB()
        .then(() => { dbConnected = true; console.log('✅ Database connected'); })
        .catch((err) => { dbConnectionPromise = null; throw err; });
    }
    try {
      await dbConnectionPromise;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return res.status(503).json({
        message: 'Database service temporarily unavailable',
        error: error.message
      });
    }
  }

  next();
});



app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true,limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: dbConnected ? 'connected' : 'not_connected',
    cors: 'enabled',
    environment: {
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasMongodbUri: !!process.env.MONGODB_URI,
      hasCloudinaryConfig: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
    }
  });
});

// Diagnostic endpoint — shows connected DB and collection counts
app.get('/api/debug', async (req, res) => {
  const mongoose = require('mongoose');
  const db = mongoose.connection;

  let collections = {};
  try {
    if (db.readyState === 1) {
      const colls = await db.db.listCollections().toArray();
      for (const col of colls) {
        collections[col.name] = await db.db.collection(col.name).countDocuments();
      }
    }
  } catch (e) {
    collections = { error: e.message };
  }

  res.json({
    status: 'ok',
    database: {
      name: db.name,
      host: db.host,
      readyState: db.readyState, // 1 = connected
      collections
    }
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api', sitemapRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/admin', require('./routes/Admin.routes.js'));
app.use('/api/courses', require('./routes/course.routes.js'));
app.use('/api/results', require('./routes/result.routes.js'));
app.use('/api/notifications', require('./routes/update.routes.js'));
app.use('/api/leads', require('./routes/lead.routes.js'));
app.use('/api/lead', require('./routes/lead.routes.js'));  // spec alias
app.use('/api/current-affairs', require('./routes/currentaffairs.routes.js'));
app.use('/api/demo-requests', demoRoutes);
app.use('/api/stats', require('./routes/stats.routes.js'));
app.use('/api/testimonials', require('./routes/testimonials.routes.js'));
app.use('/api/selections', require('./routes/selections.routes.js'));
app.use('/api/featured-exam', require('./routes/featuredExam.routes.js'));
app.use('/api/landing-pages', require('./routes/landingPage.routes.js'));
app.use('/api/faculty', require('./routes/faculty.routes.js'));
app.use('/api/batches', require('./routes/batch.routes.js'));
app.use('/api/about', require('./routes/about.routes.js'));
app.use('/api/media-coverage', require('./routes/mediaCoverage.routes.js'));
app.use('/api/inquiries', require('./routes/inquiry.routes.js'));
// Global error handler - catches any unhandled errors
app.use((err, req, res, next) => {
  console.error('🔴 ERROR:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = { app };