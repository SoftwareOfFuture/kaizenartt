import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { Save } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    openai_api_key: '',
    daily_article_time: '09:00',
    site_name: 'Kaizen Art İnşaat & Mühendislik'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Settings would be fetched from API in a real implementation
    // For now, using defaults
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real implementation, save settings via API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      alert('Ayarlar kaydedildi!');
    } catch (error) {
      alert('Kaydetme başarısız');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary mb-2">Ayarlar</h1>
          <p className="text-gray-500">Sistem ayarlarını yönetin</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save size={20} />
          <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            OpenAI API Key
          </label>
          <input
            type="password"
            value={settings.openai_api_key}
            onChange={(e) => handleChange('openai_api_key', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="sk-..."
          />
          <p className="text-sm text-gray-500 mt-2">
            Blog makaleleri oluşturmak için OpenAI API anahtarı
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Günlük Makale Yayınlama Saati
          </label>
          <input
            type="time"
            value={settings.daily_article_time}
            onChange={(e) => handleChange('daily_article_time', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
          <p className="text-sm text-gray-500 mt-2">
            Her gün bu saatte otomatik olarak bir makale yayınlanacak
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Adı
          </label>
          <input
            type="text"
            value={settings.site_name}
            onChange={(e) => handleChange('site_name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
