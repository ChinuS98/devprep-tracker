const express = require('express');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// POST /api/admin/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      success: true,
      token,
      username,
      role: 'admin'
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid credentials'
  });
});

// GET /api/admin/validate  -> API token validation
router.get('/validate', auth, (req, res) => {
  // If auth passed, token is valid
  res.json({
    valid: true,
    user: req.user   // { username, role, iat, exp }
  });
});

module.exports = router;
