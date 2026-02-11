import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const generateArticle = async (title, researchContext = '') => {
  try {
    const systemPrompt = `Sen profesyonel bir Türkçe blog yazarısın. Mimarlık, inşaat ve mühendislik konularında uzmanlaşmışsın. SEO uyumlu, okunabilir ve bilgilendirici makaleler yazıyorsun.`;

    const userPrompt = `Aşağıdaki başlık hakkında detaylı bir blog makalesi yaz:

Başlık: ${title}

${researchContext ? `\nAraştırma Bilgileri:\n${researchContext}\n` : ''}

Lütfen şu kriterlere uygun bir makale yaz:
- 800-1200 kelime arası
- SEO uyumlu (doğal anahtar kelime kullanımı)
- Türkçe dilbilgisi kurallarına uygun
- Mimarlık/inşaat/mühendislik perspektifinden yazılmış
- Markdown formatında (başlıklar için ##, ### kullan)
- Giriş, gelişme ve sonuç bölümleri içeren yapıda
- Okuyucuya değer katacak bilgiler içeren
- Profesyonel ama anlaşılır dil kullan

Makaleyi yalnızca içerik olarak döndür, başlık ekleme.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = completion.choices[0].message.content;
    return content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate article: ' + error.message);
  }
};

export const generateExcerpt = async (content) => {
  try {
    const prompt = `Aşağıdaki makale içeriğinden 150-200 karakter arası kısa bir özet çıkar. Sadece özeti döndür, başka bir şey ekleme:\n\n${content.substring(0, 500)}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 100
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI excerpt error:', error);
    // Fallback to simple excerpt
    return content.substring(0, 200).trim() + '...';
  }
};
