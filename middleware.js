const db = require('./database');

// Middleware to check if user is authenticated
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No authentication token provided' });
  }

  db.get(
    'SELECT * FROM sessions WHERE session_token = ? AND expires_at > datetime("now")',
    [token],
    (err, session) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err.message });
      }
      
      if (!session) {
        return res.status(401).json({ message: 'Invalid or expired session' });
      }

      // Attach user_id to request for use in route handlers
      req.user_id = session.user_id;
      req.session_token = token;
      next();
    }
  );
};

// Middleware for error handling
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

// Middleware to validate request body
const validateBody = (requiredFields) => {
  return (req, res, next) => {
    const missing = requiredFields.filter(field => !req.body[field]);
    
    if (missing.length > 0) {
      return res.status(400).json({
        message: 'Missing required fields',
        missing
      });
    }
    
    next();
  };
};

module.exports = {
  authenticateUser,
  errorHandler,
  validateBody
};
