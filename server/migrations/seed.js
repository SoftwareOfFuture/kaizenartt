import bcrypt from 'bcryptjs';
import pool from '../config/database.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    console.log('🔄 Running migrations...');

    // Read migration file
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '001_create_tables.sql'),
      'utf8'
    );

    // Execute migration
    await pool.query(migrationSQL);
    console.log('✅ Tables created successfully');

    // Seed admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'teknikofis@kaizenartinsaat.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Bc0101!.';

    // Check if admin user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);

    if (existingUser.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        'INSERT INTO users (email, password) VALUES ($1, $2)',
        [adminEmail, hashedPassword]
      );
      console.log('✅ Admin user created:', adminEmail);
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Seed default settings
    const defaultSettings = [
      { key: 'openai_api_key', value: process.env.OPENAI_API_KEY || '' },
      { key: 'daily_article_time', value: '09:00' },
      { key: 'site_name', value: 'Kaizen Art İnşaat & Mühendislik' }
    ];

    for (const setting of defaultSettings) {
      await pool.query(
        `INSERT INTO settings (key, value) 
         VALUES ($1, $2) 
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
        [setting.key, setting.value]
      );
    }
    console.log('✅ Default settings created');

    console.log('🎉 Migration completed successfully!');
    console.log('\n📝 Run "npm run seed:content" to seed website content');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

runMigrations();
