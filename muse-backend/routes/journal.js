const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get journal entries
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM journal_entries WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create journal entry
router.post('/', authenticateToken, async (req, res) => {
  const { title, content, mood } = req.body;
  
  try {
    const result = await db.query(
      'INSERT INTO journal_entries (user_id, title, content, mood) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, title, content, mood || 'neutral']
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;