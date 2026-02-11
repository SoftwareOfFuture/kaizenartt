import { generateArticle, generateExcerpt } from './openai.js';
import { researchTopic } from './webResearch.js';
import { generateSlug } from '../utils/helpers.js';

export const createArticleFromTitle = async (title, authorId, pool) => {
  try {
    console.log(`📝 Generating article for title: ${title}`);

    // Step 1: Research the topic
    console.log('🔍 Researching topic...');
    const researchContext = await researchTopic(title);

    // Step 2: Generate article content
    console.log('🤖 Generating article content with AI...');
    const content = await generateArticle(title, researchContext);

    // Step 3: Generate excerpt
    console.log('📄 Generating excerpt...');
    const excerpt = await generateExcerpt(content);

    // Step 4: Create slug
    const slug = generateSlug(title);

    // Step 5: Save to database
    console.log('💾 Saving article to database...');
    const result = await pool.query(
      `INSERT INTO blog_articles (title, slug, content, excerpt, status, author_id, published_at)
       VALUES ($1, $2, $3, $4, 'published', $5, $6)
       RETURNING *`,
      [title, slug, content, excerpt, authorId, new Date()]
    );

    console.log('✅ Article created successfully:', result.rows[0].id);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Article generation error:', error);
    throw error;
  }
};
