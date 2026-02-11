import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all content (public - for frontend)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page } = req.query;
    let query = 'SELECT * FROM website_content';
    const params = [];

    if (page) {
      query += ' WHERE page = $1';
      params.push(page);
    }

    query += ' ORDER BY page, section, field';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get content by page
router.get('/:page', optionalAuth, async (req, res) => {
  try {
    const { page } = req.params;
    const result = await pool.query(
      'SELECT * FROM website_content WHERE page = $1 ORDER BY section, field',
      [page]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get page content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected routes
router.use(authenticateToken);

// Update content
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (content === undefined) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const result = await pool.query(
      `UPDATE website_content 
       SET content = $1, updated_at = $2
       WHERE id = $3
       RETURNING *`,
      [content, new Date(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk update content
router.post('/bulk', async (req, res) => {
  try {
    const { updates } = req.body; // Array of {id, content}

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ error: 'Updates array is required' });
    }

    const results = [];
    for (const update of updates) {
      const result = await pool.query(
        `UPDATE website_content 
         SET content = $1, updated_at = $2
         WHERE id = $3
         RETURNING *`,
        [update.content, new Date(), update.id]
      );
      if (result.rows.length > 0) {
        results.push(result.rows[0]);
      }
    }

    res.json({ updated: results.length, items: results });
  } catch (error) {
    console.error('Bulk update content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
