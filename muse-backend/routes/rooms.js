const express = require('express');
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all rooms for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM rooms WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create room
router.post('/', authenticateToken, async (req, res) => {
  const { name, description, isPublic, themeColor, coverImage } = req.body;
  
  try {
    const result = await db.query(
      'INSERT INTO rooms (user_id, name, description, is_public, theme_color, cover_image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [req.user.id, name, description, isPublic || false, themeColor || 'white', coverImage || '']
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update room
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, description, isPublic, themeColor, coverImage } = req.body;
  
  try {
    const result = await db.query(
      'UPDATE rooms SET name = $1, description = $2, is_public = $3, theme_color = $4, cover_image = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
      [name, description, isPublic, themeColor, coverImage, id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete room
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  
  try {
    await db.query('DELETE FROM rooms WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;