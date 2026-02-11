import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.js';
import { Calendar, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await api.get(`/blog/${id}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Simple markdown to HTML converter
  const markdownToHtml = (markdown) => {
    if (!markdown) return '';
    
    return markdown
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/# (.*)/g, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Makale bulunamadı</p>
          <Link to="/blog" className="text-primary hover:text-primary/80">
            Blog sayfasına dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-secondary mb-8"
        >
          <ArrowLeft size={20} />
          <span>Blog'a Dön</span>
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Calendar size={16} />
            <span>{formatDate(article.published_at || article.created_at)}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-6">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-xl text-gray-600 italic">{article.excerpt}</p>
          )}
        </motion.header>

        {article.featured_image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 rounded-xl overflow-hidden"
          >
            <img
              src={article.featured_image.startsWith('http') ? article.featured_image : `http://localhost:5000${article.featured_image}`}
              alt={article.title}
              className="w-full h-auto"
            />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: `<p>${markdownToHtml(article.content)}</p>` }}
        />
      </div>
    </article>
  );
};

export default BlogDetail;
