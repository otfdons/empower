require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const { errorHandler } = require('./middlewareFunctions');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: ['http://localhost:8000', 'http://localhost:3000', 'http://127.0.0.1:8000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1h',
  etag: false
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Backend is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Serve index.html for all non-API, non-static routes (SPA fallback)
app.get('*', (req, res) => {
  // Only serve index.html for actual page routes, not for assets
  const requestedPath = req.path;
  const hasExtension = requestedPath.includes('.');
  
  if (hasExtension) {
    // This is likely a file request that wasn't found by static middleware
    res.status(404).send('File not found');
    return;
  }
  
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`EMPOWER Backend running on http://localhost:${PORT}`);
  console.log('API Documentation:');
  console.log('  POST   /api/auth/register           - Register new user');
  console.log('  POST   /api/auth/login              - Login user');
  console.log('  POST   /api/auth/logout             - Logout user (requires token)');
  console.log('  POST   /api/auth/verify             - Verify account (requires token)');
  console.log('  GET    /api/users/profile           - Get user profile (requires token)');
  console.log('  PUT    /api/users/profile           - Update profile (requires token)');
  console.log('  POST   /api/users/change-password   - Change password (requires token)');
  console.log('  POST   /api/users/request-password-reset - Request password reset');
  console.log('  POST   /api/users/reset-password    - Reset password with token');
  console.log('  DELETE /api/users/account           - Delete account (requires token)');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Closing database...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database closed');
    }
    process.exit(0);
  });
});
