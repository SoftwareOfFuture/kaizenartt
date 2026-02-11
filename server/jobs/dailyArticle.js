import cron from 'node-cron';
import pool from '../config/database.js';
import { createArticleFromTitle } from '../services/articleGenerator.js';

export const publishDailyArticle = async () => {
  try {
    console.log('🔄 Starting daily article publishing job...');

    // Get the first pending title
    const titleResult = await pool.query(
      `SELECT * FROM blog_titles_queue 
       WHERE status = 'pending' 
       ORDER BY created_at ASC 
       LIMIT 1`
    );

    if (titleResult.rows.length === 0) {
      console.log('ℹ️  No pending titles found');
      return { message: 'No pending titles found', article: null };
    }

    const titleQueue = titleResult.rows[0];
    console.log(`📌 Processing title: ${titleQueue.title}`);

    // Update status to processing
    await pool.query(
      'UPDATE blog_titles_queue SET status = $1 WHERE id = $2',
      ['processing', titleQueue.id]
    );

    try {
      // Get admin user ID
      const adminResult = await pool.query('SELECT id FROM users LIMIT 1');
      const authorId = adminResult.rows[0]?.id || 1;

      // Generate and create article
      const article = await createArticleFromTitle(titleQueue.title, authorId, pool);

      // Update title queue status to published
      await pool.query(
        `UPDATE blog_titles_queue 
         SET status = 'published', published_at = $1 
         WHERE id = $2`,
        [new Date(), titleQueue.id]
      );

      console.log('✅ Daily article published successfully:', article.id);
      return {
        message: 'Article published successfully',
        article: article
      };
    } catch (error) {
      // Update status to failed
      await pool.query(
        'UPDATE blog_titles_queue SET status = $1 WHERE id = $2',
        ['failed', titleQueue.id]
      );
      throw error;
    }
  } catch (error) {
    console.error('❌ Daily article publishing error:', error);
    throw error;
  }
};

// Schedule cron job - runs every day at 9:00 AM
// Format: minute hour day month dayOfWeek
if (process.env.NODE_ENV !== 'test') {
  cron.schedule('0 9 * * *', async () => {
    console.log('⏰ Cron job triggered: Daily article publishing');
    try {
      await publishDailyArticle();
    } catch (error) {
      console.error('❌ Cron job error:', error);
    }
  });
  console.log('✅ Daily article cron job scheduled (9:00 AM daily)');
}
