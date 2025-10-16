const express = require('express');
const timeout = require('connect-timeout');
require('dotenv').config();

const app = express();
const port = 3000;

/* ------------------ MIDDLEWARES ------------------ */

// Timeout middleware (5 seconds)
app.use(timeout('5s'));
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});


// Timeout guard middleware
app.use((req, res, next) => {
  if (!req.timedout) next();
});

/* ------------------ HELPERS ------------------ */

// Helper to wrap async routes and catch errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Helper to send response only if not timed out
const safeSend = (req, res, callback) => {
  if (!req.timedout && !res.headersSent) {
    callback();
  }
};

/* ------------------ ROUTES ------------------ */

// Root route
app.get(
  '/',
  asyncHandler(async (req, res) => {
    setTimeout(() => {
      safeSend(req, res, () => {
        res.status(200).send('Hello World!');
      });
    }, 6000);
  })
);

// User info + cat fact route
app.get(
  '/me',
  asyncHandler(async (req, res) => {
    const currentTime = new Date().toISOString();
    const response = await fetch('https://catfact.ninja/fact');
    const data = await response.json();

    safeSend(req, res, () => {
      res.status(200).json({
        status: 'success',
        user: {
          email: process.env.EMAIL_ADDRESS || 'emailexample@gmail.com',
          name: process.env.FULLNAME || 'Your fullname',
          stack: process.env.STACK || 'Your stack eg. Node.js/Express',
        },
        timestamp: currentTime,
        fact: data.fact,
      });
    });
  })
);


/* ------------------ ERROR HANDLING ------------------ */

// Global error handler
app.use((err, req, res, next) => {
  console.error('🚨 Error caught:', err.message);

  if (res.headersSent) {
    return next(err);
  }

  if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
    return res.status(504).json({ error: 'Request timed out' });
  }

  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'Fail',
    error: 'Route not found',
  });
});

/* ------------------ PROCESS SAFETY ------------------ */

process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
});

/* ------------------ SERVER ------------------ */

app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});