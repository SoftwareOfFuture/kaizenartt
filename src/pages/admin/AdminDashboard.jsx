import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { FileText, CheckCircle, Clock, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
      setRecentArticles(response.data.recentArticles);
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  const statCards = [
    {
      title: 'Toplam Makale',
      value: stats?.totalArticles || 0,
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Yayınlanmış',
      value: stats?.publishedArticles || 0,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Taslak',
      value: stats?.draftArticles || 0,
      icon: FileText,
      color: 'bg-yellow-500'
    },
    {
      title: 'Bekleyen Başlık',
      value: stats?.pendingTitles || 0,
      icon: Clock,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary mb-2">Dashboard</h1>
        <p className="text-gray-500">Hoş geldiniz! İşte genel bakışınız.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-secondary">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-secondary mb-4">Hızlı İşlemler</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/blog/new"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            <span>Yeni Makale</span>
          </Link>
          <Link
            to="/admin/blog"
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-secondary rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FileText size={20} />
            <span>Tüm Makaleler</span>
          </Link>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-secondary">Son Makaleler</h2>
          <Link
            to="/admin/blog"
            className="text-primary hover:text-primary/80 flex items-center gap-2 text-sm font-medium"
          >
            Tümünü Gör
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="p-6">
          {recentArticles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Henüz makale yok</p>
          ) : (
            <div className="space-y-4">
              {recentArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/admin/blog/${article.id}/edit`}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-secondary mb-1">{article.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded ${
                        article.status === 'published' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {article.status === 'published' ? 'Yayında' : 'Taslak'}
                      </span>
                      <span>{new Date(article.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-gray-400" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
