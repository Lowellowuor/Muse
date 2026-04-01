const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, email, name, avatar_url, bio, location, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  const { name, bio, location, avatarUrl } = req.body;
  
  try {
    const result = await db.query(
      'UPDATE users SET name = $1, bio = $2, location = $3, avatar_url = $4 WHERE id = $5 RETURNING id, email, name, bio, location, avatar_url',
      [name, bio, location, avatarUrl, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;