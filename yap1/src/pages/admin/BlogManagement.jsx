import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogManagement = () => {
  const [articles, setArticles] = useState([]);
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('articles');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [articlesRes, titlesRes] = await Promise.all([
        api.get('/blog?status=all'),
        api.get('/blog/titles')
      ]);
      setArticles(articlesRes.data);
      setTitles(titlesRes.data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu makaleyi silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await api.delete(`/blog/${id}`);
      setArticles(articles.filter(a => a.id !== id));
    } catch (error) {
      alert('Silme işlemi başarısız');
    }
  };

  const handlePublish = async (id) => {
    try {
      await api.post(`/blog/${id}/publish`);
      fetchData();
    } catch (error) {
      alert('Yayınlama işlemi başarısız');
    }
  };

  const handleDeleteTitle = async (id) => {
    if (!window.confirm('Bu başlığı silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await api.delete(`/blog/titles/${id}`);
      setTitles(titles.filter(t => t.id !== id));
    } catch (error) {
      alert('Silme işlemi başarısız');
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Blog Yönetimi</h1>
          <p className="text-gray-500">Makalelerinizi yönetin ve başlık kuyruğunu kontrol edin</p>
        </div>
        <Link
          to="/admin/blog/new"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          <span>Yeni Makale</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('articles')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'articles'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-secondary'
          }`}
        >
          Makaleler ({articles.length})
        </button>
        <button
          onClick={() => setActiveTab('titles')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'titles'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-secondary'
          }`}
        >
          Başlık Kuyruğu ({titles.length})
        </button>
      </div>

      {activeTab === 'articles' ? (
        <>
          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Makale ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          {/* Articles Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Başlık</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Durum</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Tarih</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                      {searchQuery ? 'Sonuç bulunamadı' : 'Henüz makale yok'}
                    </td>
                  </tr>
                ) : (
                  filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-secondary">{article.title}</div>
                        <div className="text-sm text-gray-500">{article.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          article.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : article.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {article.status === 'published' ? 'Yayında' : article.status === 'draft' ? 'Taslak' : 'Zamanlanmış'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(article.created_at).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/blog/${article.id}/edit`}
                            className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded transition-colors"
                          >
                            <Edit size={18} />
                          </Link>
                          {article.status !== 'published' && (
                            <button
                              onClick={() => handlePublish(article.id)}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Eye size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-secondary">Başlık Kuyruğu</h2>
            <Link
              to="/admin/blog/titles/new"
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              + Yeni Başlık Ekle
            </Link>
          </div>
          <div className="space-y-3">
            {titles.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Henüz başlık yok</p>
            ) : (
              titles.map((title) => (
                <div
                  key={title.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium text-secondary">{title.title}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      <span className={`px-2 py-1 rounded ${
                        title.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : title.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : title.status === 'processing'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {title.status === 'pending' ? 'Bekliyor' : 
                         title.status === 'published' ? 'Yayınlandı' :
                         title.status === 'processing' ? 'İşleniyor' : 'Başarısız'}
                      </span>
                      {title.scheduled_date && (
                        <span className="ml-2">
                          {new Date(title.scheduled_date).toLocaleDateString('tr-TR')}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteTitle(title.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
