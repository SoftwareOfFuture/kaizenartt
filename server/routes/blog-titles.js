import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all titles
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM blog_titles_queue';
    const params = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get titles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create title
router.post('/', async (req, res) => {
  try {
    const { title, scheduled_date } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      `INSERT INTO blog_titles_queue (title, status, scheduled_date)
       VALUES ($1, 'pending', $2)
       RETURNING *`,
      [title, scheduled_date || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create title error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update title
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status, scheduled_date } = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (title) {
      updateFields.push(`title = $${paramCount++}`);
      values.push(title);
    }
    if (status) {
      updateFields.push(`status = $${paramCount++}`);
      values.push(status);
    }
    if (scheduled_date !== undefined) {
      updateFields.push(`scheduled_date = $${paramCount++}`);
      values.push(scheduled_date);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);

    const query = `
      UPDATE blog_titles_queue 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Title not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update title error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete title
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM blog_titles_queue WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Title not found' });
    }

    res.json({ message: 'Title deleted successfully' });
  } catch (error) {
    console.error('Delete title error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
