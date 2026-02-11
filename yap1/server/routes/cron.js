import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { publishDailyArticle } from '../jobs/dailyArticle.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Manual trigger for daily article
router.post('/daily-article', async (req, res) => {
  try {
    const result = await publishDailyArticle();
    res.json({
      success: true,
      message: result.message,
      article: result.article || null
    });
  } catch (error) {
    console.error('Manual cron trigger error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to publish daily article'
    });
  }
});

export default router;
