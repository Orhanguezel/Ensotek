# KuhlTurm-React
Elbette! İşte backend ve frontend teknolojilerini belirttiğin bir **full-stack proje** için detaylandırılmış proje açıklaması ve teknik talimat metni. Bunu doğrudan `README.md`, proje dökümantasyonu veya roadmap olarak kullanabilirsin:

---

## 🎯 Proje Tanımı

Bu proje, modern web geliştirme teknolojilerini kullanarak geliştirilecek **full-stack bir web uygulamasıdır**. Uygulama, kullanıcı tabanlı işlemler, ürün yönetimi, sepet/sipariş sistemleri ve yönetim paneli gibi modülleri içeren tam kapsamlı bir yapıya sahip olacak.

## 🛠 Teknoloji Yığını

### Backend (API Sunucusu)
- **Dil**: TypeScript  
- **Framework**: Express.js  
- **Veritabanı**: MongoDB (Mongoose ODM ile)  
- **Kimlik Doğrulama**: JWT + HTTP-only Cookie  
- **Middleware**: CORS, Helmet, Logger, Error Handler  
- **Dosya Yükleme**: Multer  
- **Mail Gönderimi**: Nodemailer  
- **Diğer**: RESTful API mimarisi, MVC yapısı, rol bazlı yetkilendirme (RBAC)

### Frontend (Kullanıcı Arayüzü)
- **Framework**: Next.js (App Router ile)  
- **Dil**: TypeScript  
- **Durum Yönetimi**: Redux Toolkit  
- **Stil Sistemi**: styled-components  
- **Çok Dilli Destek**: react-i18next  
- **Tema Desteği**: Dark/Light toggle  
- **Formlar**: react-hook-form + yup validasyon  
- **Sayfa Koruması**: Özel `ProtectedRoute` yapısı  

---

## 📦 Backend Yapısı (src klasörü altında)

```
src/
├── config/            # Veritabanı bağlantısı, environment ayarları
├── controllers/       # İş mantığı (örnek: user.controller.ts)
├── routes/            # Express Router (örnek: auth.routes.ts)
├── models/            # Mongoose modelleri
├── middlewares/       # Hata yönetimi, auth, role-check gibi yapılar
├── utils/             # Yardımcı fonksiyonlar (token, mail, slug vs.)
├── types/             # Global TypeScript tip tanımları
└── app.ts             # Express uygulamasının ana dosyası
```

### Örnek Backend Modülleri:
- Auth (login, register, logout, me)
- User (profil, şifre güncelleme)
- Product (CRUD, filtreleme)
- Cart (ekle, sil, güncelle, temizle)
- Order (oluştur, listele, durumu güncelle)
- Admin Dashboard (istatistik veriler)

---

## 💻 Frontend Yapısı (`src` klasörü altında)

```
src/
├── app/               # Next.js App Router sayfaları (TR/EN/DE destekli)
│   ├── admin/         # Admin panel sayfaları
│   ├── visitor/       # Ziyaretçi sayfaları
│   ├── account/       # Kullanıcı profili
│   └── login, register, etc.
├── components/        # Sayfa bileşenleri (Navbar, Footer, Formlar vs.)
├── redux/             # store, slice dosyaları (authSlice, productSlice vs.)
├── hooks/             # Özel hooklar
├── utils/             # Yardımcı fonksiyonlar (apiCall, formatter vs.)
├── styles/            # styled-components teması, globalTheme.ts
└── locales/           # i18n JSON dosyaları (tr.json, en.json, de.json)
```

---

## 🔐 Kimlik Doğrulama Yapısı

- Kullanıcılar login olduğunda `accessToken` cookie olarak `httpOnly` şekilde saklanır.
- API çağrılarında `withCredentials: true` kullanılır.
- Backend tarafında `verifyToken` middleware ile kullanıcı doğrulaması yapılır.
- Redux Toolkit'te `authSlice` ile login/register/logout işlemleri yönetilir.

---

## 🌍 Çok Dilli Destek (TR / EN / DE)

- `locales/tr.json`, `locales/en.json`, `locales/de.json` dosyalarında içerikler tutulur.
- `react-i18next` ile çeviri kullanımı yapılır.
- Dinamik yönlendirme ve dil değiştirme desteği sağlanır.

---

## 📈 Admin Panel Özellikleri (admin/ dizini altında)

- Kullanıcı yönetimi
- Ürün yönetimi (ekle, sil, güncelle, filtrele)
- Sipariş yönetimi (teslim durumu vs.)
- Randevu/Hizmet yönetimi (isteğe bağlı)
- Dashboard istatistikleri (grafikler)

---

## 🧪 Test & Geliştirme

- Backend testleri: Postman ile manuel test + Jest opsiyonu
- Frontend geliştirme: responsive tasarım, dark/light destekli
- CI/CD opsiyonu: GitHub Actions + PM2 + Webhook ile otomatik deployment

---

## 🔜 Yol Haritası

1. [x] Backend temel kurulum (auth, user, product, cart)
2. [x] Frontend Redux + Auth işlemleri
3. [ ] Ürün listeleme & detay sayfası
4. [ ] Sepet işlemleri + ödeme entegrasyonu
5. [ ] Admin panel modülleri
6. [ ] E-posta bildirim sistemi
7. [ ] SEO ve performans optimizasyonları

---

İstersen bu yapıyı `README.md` dosyasına, Notion'a ya da proje dökümanına direkt olarak kopyalayabilirsin. Daha fazla detay veya örnek bileşen yapısı istersen memnuniyetle ekleyebilirim. Hazır mısın bir sonraki adımı detaylandırmaya?
