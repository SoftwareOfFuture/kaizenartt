import express from 'express';
import pool from '../config/database.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { generateSlug, generateExcerpt } from '../utils/helpers.js';
import { createArticleFromTitle } from '../services/articleGenerator.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { status = 'published', limit = 10, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM blog_articles';
    const params = [];
    
    if (!req.user) {
      query += " WHERE status = 'published'";
    } else if (status !== 'all') {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM blog_articles WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const article = result.rows[0];
    
    // Only show published articles to non-authenticated users
    if (!req.user && article.status !== 'published') {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected routes
router.use(authenticateToken);

// Generate article with AI
router.post('/generate', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Get admin user ID
    const adminResult = await pool.query('SELECT id FROM users LIMIT 1');
    const authorId = adminResult.rows[0]?.id || 1;

    // Generate article
    const article = await createArticleFromTitle(title, authorId, pool);

    res.json({
      content: article.content,
      excerpt: article.excerpt
    });
  } catch (error) {
    console.error('Generate article error:', error);
    res.status(500).json({ error: 'Failed to generate article: ' + error.message });
  }
});

// Create article
router.post('/', async (req, res) => {
  try {
    const { title, content, excerpt, featured_image, status = 'draft' } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const slug = generateSlug(title);
    const finalExcerpt = excerpt || generateExcerpt(content);

    const result = await pool.query(
      `INSERT INTO blog_articles (title, slug, content, excerpt, featured_image, status, author_id, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        title,
        slug,
        content,
        finalExcerpt,
        featured_image || null,
        status,
        req.user.id,
        status === 'published' ? new Date() : null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ error: 'Article with this slug already exists' });
    }
    console.error('Create article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update article
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, featured_image, status } = req.body;

    // Check if article exists
    const existing = await pool.query('SELECT * FROM blog_articles WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (title) {
      updateFields.push(`title = $${paramCount++}`);
      values.push(title);
      updateFields.push(`slug = $${paramCount++}`);
      values.push(generateSlug(title));
    }
    if (content) {
      updateFields.push(`content = $${paramCount++}`);
      values.push(content);
      if (!excerpt) {
        updateFields.push(`excerpt = $${paramCount++}`);
        values.push(generateExcerpt(content));
      }
    }
    if (excerpt) {
      updateFields.push(`excerpt = $${paramCount++}`);
      values.push(excerpt);
    }
    if (featured_image !== undefined) {
      updateFields.push(`featured_image = $${paramCount++}`);
      values.push(featured_image);
    }
    if (status) {
      updateFields.push(`status = $${paramCount++}`);
      values.push(status);
      if (status === 'published' && existing.rows[0].status !== 'published') {
        updateFields.push(`published_at = $${paramCount++}`);
        values.push(new Date());
      }
    }

    updateFields.push(`updated_at = $${paramCount++}`);
    values.push(new Date());
    values.push(id);

    const query = `
      UPDATE blog_articles 
      SET ${updateFields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete article
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM blog_articles WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Publish article
router.post('/:id/publish', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE blog_articles 
       SET status = 'published', published_at = $1, updated_at = $1
       WHERE id = $2
       RETURNING *`,
      [new Date(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Publish article error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
