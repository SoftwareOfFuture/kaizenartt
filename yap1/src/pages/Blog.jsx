import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await api.get('/blog?status=published');
      setArticles(response.data);
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

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-secondary mb-4">
            Blog
          </h1>
          <p className="text-gray-500 text-lg">
            Mimarlık, inşaat ve mühendislik dünyasından haberler ve makaleler
          </p>
        </motion.div>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Henüz yayınlanmış makale yok</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {article.featured_image && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.featured_image.startsWith('http') ? article.featured_image : `http://localhost:5000${article.featured_image}`}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Calendar size={16} />
                    <span>{formatDate(article.published_at || article.created_at)}</span>
                  </div>
                  <h2 className="text-xl font-bold text-secondary mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}
                  <Link
                    to={`/blog/${article.id}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                  >
                    Devamını Oku
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
