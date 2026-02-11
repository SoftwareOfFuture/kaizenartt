import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

// Content structure based on the existing pages
const websiteContent = [
  // Home Page
  { page: 'home', section: 'hero', field: 'slide_1_title', content_type: 'text', content: 'Sanat ve Yaşamın' },
  { page: 'home', section: 'hero', field: 'slide_1_subtitle', content_type: 'text', content: 'Buluşması' },
  { page: 'home', section: 'hero', field: 'slide_1_desc', content_type: 'text', content: 'Estetik ve fonksiyonun mükemmel uyumu ile yaşam alanlarınızı yeniden tasarlıyoruz.' },
  { page: 'home', section: 'hero', field: 'slide_1_tag', content_type: 'text', content: 'Estetik • Denge • Süreklilik' },
  { page: 'home', section: 'hero', field: 'slide_1_image', content_type: 'image', content: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=2000&auto=format&fit=crop' },
  
  { page: 'home', section: 'hero', field: 'slide_2_title', content_type: 'text', content: 'Akışkan Hatlar' },
  { page: 'home', section: 'hero', field: 'slide_2_subtitle', content_type: 'text', content: 'Kalıcı Denge' },
  { page: 'home', section: 'hero', field: 'slide_2_desc', content_type: 'text', content: 'Doğayla bütünleşen, sınırları kaldıran ve huzur veren mekanlar yaratıyoruz.' },
  { page: 'home', section: 'hero', field: 'slide_2_tag', content_type: 'text', content: 'Doğa • Işık • Ferahlık' },
  { page: 'home', section: 'hero', field: 'slide_2_image', content_type: 'image', content: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop' },
  
  { page: 'home', section: 'hero', field: 'slide_3_title', content_type: 'text', content: 'Doğal Ritimle' },
  { page: 'home', section: 'hero', field: 'slide_3_subtitle', content_type: 'text', content: 'Şekillenen Yaşam' },
  { page: 'home', section: 'hero', field: 'slide_3_desc', content_type: 'text', content: 'Mimari, doğanın akışını taklit ederek insan yaşamına uyum sağlar. Organik formlar ve sade çizgilerle şekillenen deneyimler.' },
  { page: 'home', section: 'hero', field: 'slide_3_tag', content_type: 'text', content: 'Organik • Modern • Zamansız' },
  { page: 'home', section: 'hero', field: 'slide_3_image', content_type: 'image', content: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop' },
  
  { page: 'home', section: 'philosophy', field: 'subtitle', content_type: 'text', content: 'Felsefemiz' },
  { page: 'home', section: 'philosophy', field: 'title', content_type: 'text', content: 'Akışkan Hatlar, Kalıcı Denge' },
  { page: 'home', section: 'philosophy', field: 'item_1_title', content_type: 'text', content: 'Akışkan Hatlar' },
  { page: 'home', section: 'philosophy', field: 'item_1_subtitle', content_type: 'text', content: 'Zen Estetiği' },
  { page: 'home', section: 'philosophy', field: 'item_1_desc', content_type: 'text', content: 'Mekanların doğal akışını bozmadan, insan ergonomisiyle uyumlu organik formlar tasarlıyoruz. Sert köşeler yerine, yaşam enerjisinin serbestçe dolaştığı hatlar.' },
  { page: 'home', section: 'philosophy', field: 'item_2_title', content_type: 'text', content: 'Kalıcı Denge' },
  { page: 'home', section: 'philosophy', field: 'item_2_subtitle', content_type: 'text', content: 'Mühendislik Vizyonu' },
  { page: 'home', section: 'philosophy', field: 'item_2_desc', content_type: 'text', content: 'Sanatsal dokunuşlarımızı milimetrik mühendislik hesaplarıyla dengeliyoruz. Estetik olanın aynı zamanda en sağlam ve güvenli olduğu bir denge arayışı.' },
  { page: 'home', section: 'philosophy', field: 'item_3_title', content_type: 'text', content: 'Sürekli İyileştirme' },
  { page: 'home', section: 'philosophy', field: 'item_3_subtitle', content_type: 'text', content: 'Kaizen Ruhu' },
  { page: 'home', section: 'philosophy', field: 'item_3_desc', content_type: 'text', content: 'Her yeni projeyi bir öncekinden daha iyiye götürme tutkusu. Gelişimin asla durmadığı, her detayda mükemmelliğin arandığı bir tasarım yolculuğu.' },
  
  { page: 'home', section: 'about', field: 'subtitle', content_type: 'text', content: 'Hakkımızda' },
  { page: 'home', section: 'about', field: 'title', content_type: 'text', content: 'Mimarlık ve Sanatı Mühendislikle Buluşturuyoruz' },
  { page: 'home', section: 'about', field: 'description_1', content_type: 'text', content: 'Kaizen Art, Antalya merkezli, dinamik ve vizyoner kadrosuyla 2019 yılından günümüze estetik ve mühendisliği harmanlamaktadır.' },
  { page: 'home', section: 'about', field: 'description_2', content_type: 'text', content: '"Gökyüzü mavi kalsın" mottosuyla doğaya saygılı, sürdürülebilir ve sanatsal değeri olan modern yapılar inşa ediyoruz.' },
  { page: 'home', section: 'about', field: 'image', content_type: 'image', content: '/src/assets/about-main.jpg' },
  { page: 'home', section: 'about', field: 'founded_year', content_type: 'text', content: '2019' },
  
  { page: 'home', section: 'cta', field: 'title', content_type: 'text', content: 'Hayalinizdeki Yaşam Alanını Birlikte İnşa Edelim' },
  { page: 'home', section: 'cta', field: 'description', content_type: 'text', content: 'Siz hayal edin, biz mühendislik ve sanatla gerçeğe dönüştürelim.' },
  { page: 'home', section: 'cta', field: 'background_image', content_type: 'image', content: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop' },
  
  // Contact Page
  { page: 'contact', section: 'hero', field: 'title', content_type: 'text', content: 'Bize Ulaşın' },
  { page: 'contact', section: 'hero', field: 'description', content_type: 'text', content: 'Fikirlerinizi teknik birer başyapıta dönüştürmek için Antalya stüdyomuzda sizi bekliyoruz.' },
  { page: 'contact', section: 'info', field: 'phone', content_type: 'text', content: '+90 212 000 00 00' },
  { page: 'contact', section: 'info', field: 'email', content_type: 'text', content: 'info@kaizenart.com.tr' },
  { page: 'contact', section: 'info', field: 'address', content_type: 'text', content: 'Liman Mahallesi, Atatürk Bulvarı\nKonyaaltı, Antalya' },
  
  // Footer
  { page: 'footer', section: 'about', field: 'description', content_type: 'text', content: 'Mükemmelliği inşa ediyoruz. Kaizen felsefesiyle tasarlanan, doğayla uyumlu ve sürdürülebilir yaşam alanları. Her detayda sanat, her yapıda mühendislik.' },
  { page: 'footer', section: 'contact', field: 'address', content_type: 'text', content: 'Antalya, Türkiye' },
  { page: 'footer', section: 'contact', field: 'email', content_type: 'text', content: 'info@kaizenart.com.tr' },
  { page: 'footer', section: 'contact', field: 'phone', content_type: 'text', content: '+90 212 000 00 00' },
  
  // Navbar
  { page: 'navbar', section: 'menu', field: 'home', content_type: 'text', content: 'Anasayfa' },
  { page: 'navbar', section: 'menu', field: 'about', content_type: 'text', content: 'Hakkımızda' },
  { page: 'navbar', section: 'menu', field: 'services', content_type: 'text', content: 'Hizmetler' },
  { page: 'navbar', section: 'menu', field: 'projects', content_type: 'text', content: 'Projeler' },
  { page: 'navbar', section: 'menu', field: 'blog', content_type: 'text', content: 'Blog' },
  { page: 'navbar', section: 'menu', field: 'contact', content_type: 'text', content: 'İletişim' },
  { page: 'navbar', section: 'cta', field: 'text', content_type: 'text', content: 'Teklif Al' },
];

async function seedContent() {
  try {
    console.log('🔄 Seeding website content...');

    for (const item of websiteContent) {
      await pool.query(
        `INSERT INTO website_content (page, section, field, content_type, content)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (page, section, field) 
         DO UPDATE SET content = EXCLUDED.content, updated_at = CURRENT_TIMESTAMP`,
        [item.page, item.section, item.field, item.content_type, item.content]
      );
    }

    console.log(`✅ Seeded ${websiteContent.length} content items`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Content seeding error:', error);
    process.exit(1);
  }
}

seedContent();
