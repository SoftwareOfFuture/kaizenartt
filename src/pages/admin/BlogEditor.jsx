import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { Save, Eye, Sparkles, Upload } from 'lucide-react';
import { createArticleFromTitle } from '../../services/articleGenerator.js';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featured_image: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await api.get(`/blog/${id}`);
      setFormData({
        title: response.data.title,
        content: response.data.content,
        excerpt: response.data.excerpt || '',
        featured_image: response.data.featured_image || '',
        status: response.data.status
      });
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Makale yüklenemedi');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, featured_image: response.data.url }));
    } catch (error) {
      alert('Görsel yüklenemedi');
    }
  };

  const handleGenerateWithAI = async () => {
    if (!formData.title) {
      alert('Lütfen önce bir başlık girin');
      return;
    }

    setGenerating(true);
    try {
      // Call backend API to generate article
      const response = await api.post('/blog/generate', {
        title: formData.title
      });
      
      setFormData(prev => ({
        ...prev,
        content: response.data.content,
        excerpt: response.data.excerpt
      }));
      alert('Makale başarıyla oluşturuldu!');
    } catch (error) {
      console.error('AI generation error:', error);
      alert('AI ile makale oluşturulamadı: ' + (error.response?.data?.error || error.message));
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (publish = false) => {
    setLoading(true);
    try {
      const data = {
        ...formData,
        status: publish ? 'published' : formData.status
      };

      if (isNew) {
        await api.post('/blog', data);
      } else {
        await api.put(`/blog/${id}`, data);
      }

      alert(publish ? 'Makale yayınlandı!' : 'Makale kaydedildi!');
      navigate('/admin/blog');
    } catch (error) {
      console.error('Save error:', error);
      alert('Kaydetme başarısız: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">
            {isNew ? 'Yeni Makale' : 'Makale Düzenle'}
          </h1>
          <p className="text-gray-500">Makalenizi oluşturun veya düzenleyin</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-secondary rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <Save size={20} />
            <span>Kaydet</span>
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Eye size={20} />
            <span>Yayınla</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Başlık *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="Makale başlığı..."
          />
        </div>

        {/* AI Generate Button */}
        {isNew && formData.title && (
          <div>
            <button
              onClick={handleGenerateWithAI}
              disabled={generating}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
            >
              <Sparkles size={18} />
              <span>{generating ? 'Oluşturuluyor...' : 'AI ile İçerik Oluştur'}</span>
            </button>
          </div>
        )}

        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Öne Çıkan Görsel
          </label>
          {formData.featured_image && (
            <img
              src={formData.featured_image.startsWith('http') ? formData.featured_image : `http://localhost:5000${formData.featured_image}`}
              alt="Featured"
              className="w-full max-w-md h-48 object-cover rounded-lg mb-2"
            />
          )}
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-secondary rounded-lg hover:bg-gray-200 transition-colors cursor-pointer inline-block">
            <Upload size={18} />
            <span>Görsel Yükle</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Özet
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="Makale özeti (otomatik oluşturulacak)"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            İçerik *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            rows="20"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono text-sm"
            placeholder="Makale içeriği (Markdown formatında)..."
          />
          <p className="text-sm text-gray-500 mt-2">
            Markdown formatında yazabilirsiniz. Başlıklar için ## veya ### kullanın.
          </p>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durum
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="draft">Taslak</option>
            <option value="published">Yayınlandı</option>
            <option value="scheduled">Zamanlanmış</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
