// =============================================================
// AI Content Generation — Groq/OpenAI compatible
// Admin panelden girilmis API key varsa onu kullanir,
// yoksa .env'deki GROQ_API_KEY kullanilir.
// =============================================================

import type { FastifyRequest, FastifyReply } from 'fastify';
import { env } from '@/core/env';

type ContentRequest = {
  title?: string;
  summary?: string;
  content?: string;
  tags?: string;
  locale: string;
  target_locales?: string[];
  module_key?: string;
  action: 'enhance' | 'translate' | 'generate_meta' | 'full';
};

type LocaleContent = {
  locale: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  meta_title: string;
  meta_description: string;
  tags: string;
};

async function getAIConfig(req: FastifyRequest) {
  // Admin panelden girilen API ayarlarini DB'den oku
  try {
    const db = (req.server as any).db || (req.server as any).mysql;
    if (db) {
      const [rows] = await db.query(
        "SELECT `value` FROM site_settings WHERE `key` = 'api_settings' AND locale = '*' LIMIT 1"
      ).catch(() => [[]]);
      if (rows?.[0]?.value) {
        const val = typeof rows[0].value === 'string' ? JSON.parse(rows[0].value) : rows[0].value;
        if (val?.groq_api_key) {
          return {
            apiKey: val.groq_api_key,
            model: val.groq_model || env.GROQ_MODEL || 'llama-3.3-70b-versatile',
            base: val.groq_api_base || 'https://api.groq.com/openai/v1',
          };
        }
      }
    }
  } catch {}

  // .env fallback
  return {
    apiKey: env.GROQ_API_KEY || process.env.GROQ_API_KEY || '',
    model: env.GROQ_MODEL || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    base: process.env.GROQ_API_BASE || 'https://api.groq.com/openai/v1',
  };
}

async function callAI(config: { apiKey: string; model: string; base: string }, systemPrompt: string, userPrompt: string): Promise<string> {
  if (!config.apiKey) throw new Error('AI API key tanimli degil. .env veya admin panelden ayarlayin.');

  const res = await fetch(`${config.base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 4000,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI API error: ${res.status} — ${err.slice(0, 200)}`);
  }

  const data = await res.json() as any;
  return data?.choices?.[0]?.message?.content || '';
}

function extractJSON(text: string): any {
  try { return JSON.parse(text); } catch {}
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) { try { return JSON.parse(match[1].trim()); } catch {} }
  const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (jsonMatch) { try { return JSON.parse(jsonMatch[1]); } catch {} }
  throw new Error('AI yanitindan JSON cikarilamadi');
}

const SYSTEM_PROMPT = `Sen Ensotek firması icin profesyonel icerik yazarisin.
Ensotek, endustriyel sogutma kuleleri, HVAC cozumleri ve muhendislik hizmetleri sunan bir B2B firmasidir.

Kurallar:
- Profesyonel, guvenilir ve teknik bir ton kullan
- Endustriyel sogutma ve HVAC sektorune uygun terminoloji kullan
- SEO dostu icerik uret (anahtar kelime yogunlugu dogal olsun)
- HTML formatinda icerik uret (<p>, <h2>, <h3>, <ul>, <li>, <strong> taglari kullan)
- Basliklar kisa ve etkileyici olsun
- Meta description 155 karakter sinirinda olsun
- Slug Turkce karaktersiz, kucuk harf, tire ile ayrilmis olsun
- Tags virgul ile ayrilmis olsun
- Yaniti SADECE JSON olarak don, aciklama ekleme`;

export async function aiContentAssist(req: FastifyRequest, reply: FastifyReply) {
  const body = req.body as ContentRequest;

  if (!body?.action) {
    return reply.code(400).send({ error: { message: 'action alani gerekli' } });
  }

  const locales = body.target_locales?.length ? body.target_locales : [body.locale || 'de'];

  try {
    const config = await getAIConfig(req);
    let userPrompt = '';

    if (body.action === 'full') {
      userPrompt = `Mevcut bilgiler:
- Baslik: ${body.title || '(bos)'}
- Ozet: ${body.summary || '(bos)'}
- Icerik: ${body.content ? body.content.slice(0, 500) : '(bos)'}
- Etiketler: ${body.tags || '(bos)'}
- Modul: ${body.module_key || 'blog'}

Gorev: Bu bilgileri kullanarak her dil icin eksiksiz bir icerik hazirla.
- Baslik bossa, ozet veya icerikten anlamli bir baslik uret
- Icerik bos veya kisaysa, baslik ve ozetten en az 3 paragraf HTML icerik uret
- Ozet bossa, icerikten 1-2 cumlelik ozet cikar
- meta_title ve meta_description SEO icin optimize et
- tags bossa, icerikten uygun etiketler cikar
- Slug her dilde ayni olsun (Turkce karaktersiz)

Hedef diller: ${locales.join(', ')}

SADECE su JSON formatinda yanit ver:
{
  "locales": [
    {
      "locale": "de",
      "title": "...",
      "slug": "...",
      "summary": "...",
      "content": "<p>...</p>",
      "meta_title": "...",
      "meta_description": "...",
      "tags": "etiket1, etiket2"
    }
  ]
}`;
    } else if (body.action === 'enhance') {
      userPrompt = `Mevcut icerik:
- Baslik: ${body.title || '(bos)'}
- Icerik: ${body.content || '(bos)'}

Gorev: Bu icerigi gelistir ve genislet. Daha detayli, profesyonel ve SEO dostu hale getir.
Dil: ${body.locale || 'de'}

SADECE su JSON formatinda yanit ver:
{
  "locales": [{ "locale": "${body.locale || 'de'}", "title": "...", "slug": "...", "summary": "...", "content": "<p>...</p>", "meta_title": "...", "meta_description": "...", "tags": "..." }]
}`;
    } else if (body.action === 'translate') {
      userPrompt = `Kaynak icerik (${body.locale || 'de'}):
- Baslik: ${body.title}
- Ozet: ${body.summary}
- Icerik: ${body.content?.slice(0, 2000)}
- Etiketler: ${body.tags}

Gorev: Bu icerigi su dillere cevir: ${locales.filter(l => l !== body.locale).join(', ')}
Ceviri dogal olsun, kelime kelime degil anlam odakli.
Slug tum dillerde ayni olsun.

SADECE su JSON formatinda yanit ver:
{
  "locales": [
    { "locale": "en", "title": "...", "slug": "...", "summary": "...", "content": "<p>...</p>", "meta_title": "...", "meta_description": "...", "tags": "..." }
  ]
}`;
    } else if (body.action === 'generate_meta') {
      userPrompt = `Icerik:
- Baslik: ${body.title}
- Icerik: ${body.content?.slice(0, 1000)}

Gorev: SEO meta bilgilerini olustur.
Dil: ${body.locale || 'de'}

SADECE su JSON formatinda yanit ver:
{
  "locales": [{ "locale": "${body.locale || 'de'}", "title": "${body.title}", "slug": "...", "summary": "...", "content": "", "meta_title": "...", "meta_description": "...", "tags": "..." }]
}`;
    }

    const raw = await callAI(config, SYSTEM_PROMPT, userPrompt);
    const result = extractJSON(raw);

    return reply.send({ ok: true, data: result });
  } catch (err: any) {
    return reply.code(500).send({ error: { message: err.message || 'AI icerik hatasi' } });
  }
}
