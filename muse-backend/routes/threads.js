const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all threads
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT t.*, u.name as author_name 
       FROM threads t 
       JOIN users u ON t.user_id = u.id 
       ORDER BY t.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create thread
router.post('/', authenticateToken, async (req, res) => {
  const { title, content, mood, tags } = req.body;
  
  try {
    const result = await db.query(
      'INSERT INTO threads (user_id, title, content, mood, tags) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, title, content, mood, tags || []]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;