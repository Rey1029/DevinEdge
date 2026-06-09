const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { usersDb } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'devinedge-super-secret-key';

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// @route   POST api/auth/signup
// @desc    Register a new client
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please enter all required fields' });
    }

    const users = usersDb.read();
    const userExists = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (userExists) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: 'usr-' + Math.random().toString(36).substring(2, 11),
      name,
      email: email.toLowerCase(),
      passwordHash,
      googleId: null,
      role: 'client',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    usersDb.write(users);

    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ error: 'Server registration error. Please try again.' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate client/admin & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password' });
    }

    const users = usersDb.read();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || !user.passwordHash) {
      return res.status(400).json({ error: 'Invalid login credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid login credentials' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ error: 'Server authentication error. Please try again.' });
  }
});

// @route   POST api/auth/google
// @desc    Simulate or handle Google Login
router.post('/google', async (req, res) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !name || !googleId) {
      return res.status(400).json({ error: 'Incomplete Google login payload' });
    }

    const users = usersDb.read();
    let user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Create new client user
      user = {
        id: 'usr-' + Math.random().toString(36).substring(2, 11),
        name,
        email: email.toLowerCase(),
        passwordHash: null,
        googleId,
        role: 'client',
        createdAt: new Date().toISOString()
      };
      users.push(user);
      usersDb.write(users);
    } else if (!user.googleId) {
      // Link Google Account to existing email
      user.googleId = googleId;
      usersDb.write(users);
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google Auth error:', error.message);
    res.status(500).json({ error: 'Server Google Login error. Please try again.' });
  }
});

// @route   GET api/auth/me
// @desc    Get current user details from token
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const users = usersDb.read();
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User session no longer exists' });
    }
    
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid authentication session' });
  }
});

module.exports = router;
