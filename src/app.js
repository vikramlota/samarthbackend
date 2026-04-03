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
    'https://gyann-samarth-acadamy2.vercel.app',
    'https://gyann-samarth-acadamy-j861.vercel.app'
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
let dbConnectionInProgress = false;

app.use(async (req, res, next) => {
  // Skip DB check for health check or static files
  if (req.path === '/api/health' || req.path.startsWith('/public') || req.path.includes('.')) {
    return next();
  }

  // For ALL API requests (GET, POST, PUT, DELETE), ensure database is connected
  if (!dbConnected && !dbConnectionInProgress) {
    dbConnectionInProgress = true;
    try {
      console.log('🔄 Connecting to database on first API request...');
      await connectDB();
      dbConnected = true;
      console.log('✅ Database connected');
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return res.status(503).json({ 
        message: 'Database service temporarily unavailable',
        error: error.message 
      });
    } finally {
      dbConnectionInProgress = false;
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
    timestamp: new Date().toISOString(),
    database: dbConnected ? 'connected' : 'not_connected',
    cors: 'enabled',
    environment: {
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasMongodbUri: !!process.env.MONGODB_URI,
      hasCloudinaryConfig: !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
    }
  });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    status: 'ok',
    origin: req.get('origin'),
    requestHeaders: {
      'user-agent': req.get('user-agent'),
      'content-type': req.get('content-type')
    },
    cors: 'enabled',
    corsPolicy: allowedOrigins
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
app.use('/api/current-affairs', require('./routes/currentaffairs.routes.js'));
app.use("/api/demo-requests", demoRoutes);
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