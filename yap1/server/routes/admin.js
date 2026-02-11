import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      pendingTitles,
      recentArticles
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM blog_articles'),
      pool.query("SELECT COUNT(*) FROM blog_articles WHERE status = 'published'"),
      pool.query("SELECT COUNT(*) FROM blog_articles WHERE status = 'draft'"),
      pool.query("SELECT COUNT(*) FROM blog_titles_queue WHERE status = 'pending'"),
      pool.query(
        'SELECT id, title, status, created_at FROM blog_articles ORDER BY created_at DESC LIMIT 5'
      )
    ]);

    res.json({
      stats: {
        totalArticles: parseInt(totalArticles.rows[0].count),
        publishedArticles: parseInt(publishedArticles.rows[0].count),
        draftArticles: parseInt(draftArticles.rows[0].count),
        pendingTitles: parseInt(pendingTitles.rows[0].count)
      },
      recentArticles: recentArticles.rows
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// General stats
router.get('/stats', async (req, res) => {
  try {
    const [articles, titles] = await Promise.all([
      pool.query('SELECT status, COUNT(*) as count FROM blog_articles GROUP BY status'),
      pool.query('SELECT status, COUNT(*) as count FROM blog_titles_queue GROUP BY status')
    ]);

    res.json({
      articles: articles.rows,
      titles: titles.rows
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
