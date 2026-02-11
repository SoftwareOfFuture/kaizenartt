import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

// Routes
import authRoutes from './server/routes/auth.js';
import adminRoutes from './server/routes/admin.js';
import blogRoutes from './server/routes/blog.js';
import blogTitlesRoutes from './server/routes/blog-titles.js';
import contentRoutes from './server/routes/content.js';
import uploadRoutes from './server/routes/upload.js';
import cronRoutes from './server/routes/cron.js';

if (!process.env.VERCEL) {
  import('./server/jobs/dailyArticle.js');
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'https://kaizenartt.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);
app.use(cors({
  origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'server/public/uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/blog/titles', blogTitlesRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/cron', cronRoutes);

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// API 404
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// SPA fallback - Vercel serves public/ statically, Express handles SPA routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = createServer(app);

if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

export default app;
