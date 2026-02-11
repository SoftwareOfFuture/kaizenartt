import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { Save, Image as ImageIcon } from 'lucide-react';

const ContentManagement = () => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activePage, setActivePage] = useState('home');

  const pages = [
    { id: 'home', name: 'Anasayfa' },
    { id: 'about', name: 'Hakkımızda' },
    { id: 'services', name: 'Hizmetler' },
    { id: 'contact', name: 'İletişim' },
    { id: 'footer', name: 'Footer' },
    { id: 'navbar', name: 'Navbar' }
  ];

  useEffect(() => {
    fetchContent();
  }, [activePage]);

  const fetchContent = async () => {
    try {
      const response = await api.get(`/content/${activePage}`);
      const contentMap = {};
      response.data.forEach(item => {
        if (!contentMap[item.section]) {
          contentMap[item.section] = {};
        }
        contentMap[item.section][item.field] = {
          id: item.id,
          content: item.content,
          type: item.content_type
        };
      });
      setContent(contentMap);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: {
          ...prev[section]?.[field],
          content: value
        }
      }
    }));
  };

  const handleImageUpload = async (section, field, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleContentChange(section, field, response.data.url);
    } catch (error) {
      alert('Görsel yüklenemedi');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = [];
      Object.keys(content).forEach(section => {
        Object.keys(content[section]).forEach(field => {
          updates.push({
            id: content[section][field].id,
            content: content[section][field].content
          });
        });
      });

      await api.post('/content/bulk', { updates });
      alert('İçerikler başarıyla kaydedildi!');
    } catch (error) {
      alert('Kaydetme başarısız');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">İçerik Yönetimi</h1>
          <p className="text-gray-500">Web sitesi içeriklerini düzenleyin</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save size={20} />
          <span>{saving ? 'Kaydediliyor...' : 'Tümünü Kaydet'}</span>
        </button>
      </div>

      {/* Page Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {pages.map(page => (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className={`px-4 py-2 font-medium transition-colors ${
              activePage === page.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-500 hover:text-secondary'
            }`}
          >
            {page.name}
          </button>
        ))}
      </div>

      {/* Content Editor */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        {Object.keys(content).length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Bu sayfa için henüz içerik yok. Veritabanına içerik eklenmesi gerekiyor.
          </p>
        ) : (
          Object.keys(content).map(section => (
            <div key={section} className="border-b border-gray-200 pb-6 last:border-0">
              <h3 className="text-lg font-bold text-secondary mb-4 capitalize">{section}</h3>
              <div className="space-y-4">
                {Object.keys(content[section]).map(field => {
                  const item = content[section][field];
                  return (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {field}
                      </label>
                      {item.type === 'image' ? (
                        <div>
                          {item.content && (
                            <img
                              src={item.content.startsWith('http') ? item.content : `http://localhost:5000${item.content}`}
                              alt={field}
                              className="w-full max-w-md h-48 object-cover rounded-lg mb-2"
                            />
                          )}
                          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-secondary rounded-lg hover:bg-gray-200 transition-colors cursor-pointer inline-block">
                            <ImageIcon size={18} />
                            <span>Görsel Değiştir</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(section, field, e)}
                              className="hidden"
                            />
                          </label>
                        </div>
                      ) : item.type === 'html' ? (
                        <textarea
                          value={item.content}
                          onChange={(e) => handleContentChange(section, field, e.target.value)}
                          rows="6"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono text-sm"
                        />
                      ) : (
                        <input
                          type="text"
                          value={item.content}
                          onChange={(e) => handleContentChange(section, field, e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContentManagement;
