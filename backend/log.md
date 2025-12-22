Aşağıdaki planı iki hat üzerinde kurguluyorum: **(A) Ziyaretçi analitiği (frontend tracker + analytics_events)** ve **(B) Anlık log/hatayı dashboard’da izleme (streaming + history)**. Hedef: hızlı MVP + ileride ölçeklenebilir mimari.

---

## 0) Hedef Çıktılar

### Admin Dashboard’da göreceklerin

1. **Analytics**

* Bugün / Son 7 gün: Pageviews, Unique visitors, Sessions
* Top pages, referrers, ülkeler (opsiyon), cihazlar (opsiyon)
* Zaman serisi grafikleri (hour/day bucket)

2. **Ops / Logs**

* Son 5–10 dk hata (level>=40) canlı akış
* Son 24 saat hata listesi (filter/sort/pagination)
* Endpoint latency p95 + status dağılımı
* “Auth token expired / refresh” sayıları

---

## 1) Mimari Kararları

### 1.1 Analytics (doğru yöntem)

* **Frontend tracker** (Next.js public site) `page_view`, `event`, `session_start` üretir.
* Backend: **/api/analytics/collect** (public) → DB’ye yazar.
* Admin: **/api/admin/analytics/summary** (admin) → agregasyon döner.

**Kimliklendirme (unique visitor)**

* Cookie tabanlı `visitor_id` (UUID) + `session_id` (TTL 30 dk idle).
* IP’yi ham saklama yok; gerekiyorsa **hash**.

### 1.2 Logs / Errors (anlık + geçmiş)

İki katman:

**(1) Kalıcı hata kayıtları (DB)**

* Sadece `level>=40` (error/warn) olaylarını DB’ye yaz.
* Admin listeleri buradan gelir.

**(2) Canlı akış (WebSocket veya SSE)**

* Admin dashboard açıkken yeni error geldi mi push.
* WebSocket şart değil; **SSE** (Server-Sent Events) çoğu durumda daha basit ve yeterli.
* Sen “gerekirse websocket kuralım” diyorsun: Ben MVP’de SSE öneririm; chat/bi-directional gerekirse WS’ye geçeriz.

---

## 2) İş Akışı (MVP’den Production’a)

### Faz 1 — Analytics MVP (1. gün hedef)

**Backend**

1. DB tabloları:

* `analytics_visitors` (opsiyonel; MVP’de gerekmez)
* `analytics_events`
* (isteğe bağlı) `analytics_sessions`

2. Public endpoint:

* `POST /api/analytics/collect`

  * Body: `{ type, ts, visitor_id, session_id, path, ref, locale, ua, ... }`
  * Validation + rate limit + bot filtre (basit)

3. Admin endpoints:

* `GET /api/admin/analytics/summary?range=7d`
* `GET /api/admin/analytics/top-pages?range=7d`
* `GET /api/admin/analytics/referrers?range=7d`

**Frontend (Public site)**
4) Tracker script / hook:

* route change dinle → `page_view`
* ilk giriş → `session_start`
* cookie yönetimi

**Admin UI**
5) Dashboard widget’ları:

* cards: pageviews, visitors, sessions
* chart: daily pageviews
* tables: top pages, referrers

**Kabul kriterleri**

* Aynı kullanıcı yeniledikçe visitor artmıyor; pageview artıyor.
* 7 gün grafiği doluyor.

---

### Faz 2 — Log/Errors History (DB) (1. gün hedef)

**Backend**

1. DB tablosu: `app_logs` (sadece warn/error)

* `id, ts, level, msg, route, method, status_code, response_time_ms, req_id, user_id?, ip_hash?, err_code?, err_stack?, meta_json`

2. Fastify hook:

* `onResponse` → status_code, responseTime
* Eğer `statusCode>=500` veya “auth_failed” gibi belirlediğin olaylar → insert.
* Ayrıca `setErrorHandler` ile exception yakala → insert.

3. Admin endpoint:

* `GET /api/admin/ops/logs?level>=40&range=24h&limit=200&offset=0&contains=...`

**Admin UI**
4) “Errors” paneli:

* liste + filtre (level, contains, route, status)
* detay drawer (stack, meta)

**Kabul kriterleri**

* Token expired ve 500 error’lar panelde görünüyor.
* Pagination çalışıyor.

---

### Faz 3 — Canlı akış (SSE öneri) (0.5–1 gün)

**Backend**

1. SSE endpoint:

* `GET /api/admin/ops/stream` (auth + admin)
* Yeni log insert olduğunda ilgili client’lara push.

Uygulama yaklaşımı:

* Uygulama içinde `EventEmitter` veya basit “pubsub”:

  * DB’ye error yaz → `emit('log', payload)`
  * SSE bağlantıları → `res.write("data: ...\n\n")`

**Frontend Admin**
2) SSE client:

* Dashboard’da “Live errors” paneli
* Bağlantı koparsa exponential backoff ile yeniden bağlan

**Kabul kriterleri**

* Yeni 401/auth_failed veya 500 anında düşüyor.
* 10–20 sn içinde görünüyor.

> WebSocket’e geçiş kriteri: admin panelde “acknowledge”, “mute”, “assign”, “chat” gibi çift yönlü etkileşim istersen.

---

### Faz 4 — Ölçek/kalite (opsiyon)

* Bot filtreleri (UA + known bot list + rate limit)
* Geo enrichment (IP → country) (opsiyon; privacy)
* Sampling (çok trafik olursa)
* Retention policy (analytics 90 gün, logs 30 gün)
* Grafana/Loki entegrasyonu (ileride)

---

## 3) Veri Şeması Önerisi (MVP)

### analytics_events

* `id` (uuid)
* `ts` (datetime)
* `type` enum: `page_view | session_start | event`
* `visitor_id` (uuid)
* `session_id` (uuid)
* `path` (varchar)
* `referrer` (varchar nullable)
* `locale` (varchar)
* `ua` (varchar nullable) / ya da `ua_hash`
* `meta` (json) (utm, screen, etc.)

### app_logs

* `id` (uuid)
* `ts`
* `level` int (pino)
* `msg`
* `req_id`
* `method`
* `url` (normalized)
* `status_code`
* `response_time_ms`
* `user_id` nullable
* `err_code` nullable
* `err_stack` nullable (kırpılmış)
* `meta` json

---

## 4) Güvenlik ve Privacy (minimum şartlar)

* Analytics endpoint public olacağı için:

  * **rate limit** (IP bazlı)
  * payload validation (zod)
  * origin kontrolü (sadece kendi domainlerin)
* Visitor cookie:

  * `SameSite=Lax`, `Secure` (prod), 365 gün
* IP saklamayacaksan saklama; gerekiyorsa **hash + salt**.

---

## 5) Senin projeye uygun “iş akışı” checklist

### Sprint-1 (Analytics)

1. DB migration: `analytics_events`
2. `POST /api/analytics/collect`
3. Next.js tracker (page_view)
4. Admin summary endpoints
5. Admin dashboard widget’ları

### Sprint-2 (Logs)

1. DB migration: `app_logs`
2. Fastify hooks + error handler + insert
3. Admin logs list endpoint
4. Admin “Errors” ekranı

### Sprint-3 (Live)

1. SSE stream endpoint
2. Admin SSE client + live panel
3. Basit “mute filter” (contains/route)

---

## 6) Hemen başlayalım: Sıradaki somut adım

Benim önerim: **Önce Analytics MVP**, paralelde **Logs DB History**. Çünkü ikisi dashboard’u hemen anlamlı yapar. SSE’yi en sona koyarız.

Devam edebilmem için senden tek bilgiye ihtiyacım var (cevaplamadan da ilerleyebilirim ama en doğrusu bu):

* Backend’de ORM olarak **Drizzle** mı kullanıyorsun (Ensotek backend’de)? ve tabloları nerede tanımlıyorsun (`src/db/schema` gibi)?

Eğer “evet drizzle” dersen bir sonraki mesajda doğrudan:

* `analytics_events` ve `app_logs` için schema + migration
* Fastify route/controller code
* Next.js tracker hook
* Admin RTK endpoints contract
  şeklinde **tam kod** çıkaracağım.
