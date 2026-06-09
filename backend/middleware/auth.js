const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'devinedge-super-secret-key';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header is missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token is missing' });
    }

    // Verify token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Token is expired or invalid' });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(500).json({ error: 'Internal server authentication error' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Admin role required' });
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware
};
