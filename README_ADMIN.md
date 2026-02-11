# Admin Panel ve Blog Sistemi Kurulum Rehberi

## Backend Kurulumu

### 1. Bağımlılıkları Yükleyin

```bash
cd server
npm install
```

### 2. Environment Variables Ayarlayın

`server/.env` dosyası oluşturun:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/kaizen_art
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key-here
ADMIN_EMAIL=teknikofis@kaizenartinsaat.com
ADMIN_PASSWORD=Bc0101!.
PORT=5000
NODE_ENV=development
```

### 3. Veritabanını Oluşturun ve Migrate Edin

```bash
# PostgreSQL veritabanını oluşturun
createdb kaizen_art

# Migration'ları çalıştırın
npm run migrate

# Website içeriklerini seed edin
npm run seed:content
```

### 4. Backend'i Başlatın

```bash
npm run dev
```

Backend `http://localhost:5000` adresinde çalışacak.

## Frontend Kurulumu

### 1. Bağımlılıkları Yükleyin

```bash
cd ..
npm install
```

### 2. Environment Variables Ayarlayın

`.env` dosyası oluşturun:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Frontend'i Başlatın

```bash
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacak.

## Admin Paneli Kullanımı

### Giriş Bilgileri

- **URL**: `http://localhost:5173/admin/login`
- **Email**: `teknikofis@kaizenartinsaat.com`
- **Şifre**: `Bc0101!.`

### Özellikler

1. **Dashboard**: Genel istatistikler ve hızlı erişim
2. **Blog Yönetimi**: 
   - Makale oluşturma, düzenleme, silme
   - AI ile otomatik makale oluşturma
   - Başlık kuyruğu yönetimi
3. **İçerik Yönetimi**: Tüm sayfa içeriklerini düzenleme
4. **Ayarlar**: Sistem ayarları

## Günlük Makale Yayınlama

Sistem her gün saat 09:00'da otomatik olarak `blog_titles_queue` tablosundaki bekleyen başlıklardan birini alıp AI ile makale oluşturur ve yayınlar.

Manuel tetikleme için:
```bash
curl -X POST http://localhost:5000/api/cron/daily-article \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## API Endpoints

### Public Endpoints

- `GET /api/blog` - Tüm yayınlanmış makaleler
- `GET /api/blog/:id` - Makale detayı
- `GET /api/content` - Website içerikleri
- `GET /api/content/:page` - Belirli sayfa içerikleri

### Protected Endpoints (Admin)

- `POST /api/auth/login` - Admin girişi
- `GET /api/admin/dashboard` - Dashboard istatistikleri
- `POST /api/blog` - Yeni makale oluştur
- `PUT /api/blog/:id` - Makale güncelle
- `DELETE /api/blog/:id` - Makale sil
- `POST /api/blog/generate` - AI ile makale oluştur
- `POST /api/upload/image` - Görsel yükle
- `PUT /api/content/:id` - İçerik güncelle
- `POST /api/content/bulk` - Toplu içerik güncelleme

## Veritabanı Yapısı

- `users` - Admin kullanıcıları
- `blog_articles` - Blog makaleleri
- `blog_titles_queue` - Bekleyen başlık kuyruğu
- `website_content` - Website içerikleri
- `settings` - Sistem ayarları

## Production Deployment

### Vercel Deployment

1. PostgreSQL veritabanını Vercel'de oluşturun
2. Environment variables'ı Vercel'e ekleyin
3. Backend'i serverless function olarak deploy edin
4. Frontend'i static site olarak deploy edin

### Environment Variables (Production)

```env
DATABASE_URL=<vercel_postgres_url>
JWT_SECRET=<strong_random_secret>
OPENAI_API_KEY=<your_openai_key>
ADMIN_EMAIL=teknikofis@kaizenartinsaat.com
ADMIN_PASSWORD=Bc0101!.
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

## Notlar

- JWT secret key otomatik oluşturulur, ancak production'da mutlaka manuel ayarlayın
- İlk admin kullanıcı migration ile oluşturulur
- Günlük makale yayınlama cron job'ı production'da da çalışır
- Tüm görseller `/public/uploads/` klasörüne kaydedilir
