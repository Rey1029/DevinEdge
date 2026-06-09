const express = require('express');
const cors = require('cors');
const path = require('path');

// Crash prevention: Catch all uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('CRITICAL UNCAUGHT EXCEPTION PREVENTED:', err.stack || err);
  // Log the crash but DO NOT terminate the server process
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL UNHANDLED REJECTION PREVENTED at:', promise, 'reason:', reason);
  // Log the crash but DO NOT terminate the server process
});

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS dynamically for local development on different network IPs
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isLocal = origin.startsWith('http://localhost:') || 
                    origin.startsWith('http://127.0.0.1:') || 
                    origin.startsWith('http://192.168.') || 
                    origin.startsWith('http://10.') || 
                    origin.startsWith('http://172.');
    if (isLocal) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRouter = require('./routes/auth');
const inquiriesRouter = require('./routes/inquiries');
const eventsRouter = require('./routes/events');

// Register API Routes
app.use('/api/auth', authRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/events', eventsRouter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

// Serve static assets in production if needed
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
  });
}

// Global robust Express Error Handler (prevents crashes from route exceptions)
app.use((err, req, res, next) => {
  console.error('Express request handler error intercepted:', err.message || err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred.' 
      : err.message 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(` DevinEdge Resilient Backend API Running     `);
  console.log(` Port: ${PORT}                              `);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'} `);
  console.log(` Database: local JSON files (crash-proof)   `);
  console.log(`=============================================`);
});
