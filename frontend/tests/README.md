# 🧪 Test Configuration - Ensotek Frontend

Bu klasör Ensotek web sitesi için SEO ve performans testlerini içerir.

## 🚀 Hızlı Başlangıç

```bash
# Test ortamını kurulum (ilk sefer)
npm run test:setup

# SEO testlerini çalıştır
npm run test:seo

# Lighthouse testlerini çalıştır  
npm run lh:autorun
```

## 📊 Test Türleri

### 1. SEO Tests (Playwright)
- **Hreflang validation** - Multilingual URL structure
- **Meta tag validation** - Title, description, canonical
- **Structured data** - JSON-LD validation
- **Accessibility checks** - ARIA, semantic HTML

### 2. Performance Tests (Lighthouse)
- **Core Web Vitals** - LCP, FID, CLS
- **SEO scores** - Meta tags, structured data
- **Best practices** - Security, HTTPS, compression
- **Accessibility** - Color contrast, keyboard navigation

## 🛠️ Komutlar

### SEO Tests
```bash
npm run test:seo          # Normal test run
npm run test:seo:ui       # Interactive UI mode  
npm run test:seo:debug    # Debug mode with breakpoints
npm run test:seo:headed   # Browser görünür mode
npm run test:all          # Tüm testler + HTML report
```

### Lighthouse Tests
```bash
npm run lh:autorun        # Tam süreç (collect + assert + upload)
npm run lh:collect        # Sadece data toplama
npm run lh:assert         # Sadece threshold kontrol
npm run lh:upload         # Sadece sonuç yükleme
```

### Utility Commands
```bash
npm run test:setup        # Playwright install + deps
npm run test:clean        # Test sonuçlarını temizle
npm run pw:install        # Sadece browser install
npm run pw:deps           # Sistem dependencies
```

## ⚙️ Konfigürasyon

### Environment Variables

Test ayarları için `.env.test.example` dosyasını `.env.local` olarak kopyalayın:

```bash
cp .env.test.example .env.local
```

**Önemli değişkenler:**
- `PLAYWRIGHT_BASE_URL` - Test edilecek site URL'i
- `PLAYWRIGHT_LOCALES` - Test edilecek diller (de,tr,en)
- `PLAYWRIGHT_PRODUCT_SLUG` - Test edilecek örnek ürün
- `LH_BASE_URL` - Lighthouse için base URL

### Test Yapılandırması

**Playwright Config** (`playwright.config.ts`):
- Multiple browser support (Chrome, Firefox)
- Retry logic for CI/CD
- Screenshot/video on failures
- Environment variable injection

**Lighthouse Config** (`lighthouserc.cjs`):
- Performance thresholds
- SEO validation rules
- Multi-locale URL generation
- Output formatting

## 📈 Threshold'lar

### Lighthouse Thresholds (Ensotek için optimize)
- **Performance**: ≥ 75 (Cloudinary + FontAwesome realistic)
- **Accessibility**: ≥ 90 (Kritik, error level)
- **SEO**: ≥ 95 (Bizim için kritik)
- **Best Practices**: ≥ 85

### Core Web Vitals
- **FCP**: ≤ 2.5s
- **LCP**: ≤ 4.0s  
- **CLS**: ≤ 0.1

## 🗂️ Dosya Yapısı

```
tests/
├── seo/                          # SEO testleri
│   ├── helpers.ts               # Test utility functions
│   ├── hreflang.routes.spec.ts  # Ana sayfa hreflang testleri
│   └── hreflang.details.spec.ts # Detay sayfa hreflang testleri
└── ...

test-results/                     # Test sonuçları
├── html-report/                 # Playwright HTML reports
├── artifacts/                   # Screenshots, videos
└── .last-run.json              # Son test bilgisi

.lighthouseci/                   # Lighthouse sonuçları
├── lhr-*.json                   # Lighthouse reports
└── manifest.json               # Manifest file
```

## 🔍 Test Detayları

### Hreflang Tests
Test edilen route'lar:
- `/` (homepage)
- `/product`, `/service`, `/news`
- `/library`, `/references`, `/contact`
- `/offer`, `/faqs`, `/terms`
- `/privacy-policy`, `/kvkk`, `/quality`

Her route için kontrol edilen:
- ✅ Canonical URL absolute ve doğru
- ✅ Hreflang links tüm aktif lokaller için mevcut
- ✅ x-default tag doğru default locale'e işaret ediyor
- ✅ Same-origin policy uygunluğu

### Detail Page Tests
Environment variable ile slug tanımlı ise test edilir:
- Product detail pages (`/product/[slug]`)
- Service detail pages (`/service/[slug]`)
- News articles (`/news/[slug]`)
- Library documents (`/library/[slug]`)
- Team member pages (`/team/[slug]`)

## 🚨 Troubleshooting

### Common Issues

**1. Tests fail with 404 errors**
```bash
# Backend'in çalıştığından emin ol
cd ../backend && bun run dev
```

**2. Hreflang validation fails**
```bash
# _document.tsx'de hreflang generation kontrolü
# Default locale configuration kontrolü
```

**3. Lighthouse thresholds too strict**
```bash
# lighthouserc.cjs'de thresholds ayarlama
# Realistic değerler için dökümanı gözden geçir
```

**4. Playwright browser issues**
```bash
npm run test:setup    # Browsers'ı yeniden install et
```

### Debug Mode

Detaylı debugging için:
```bash
# Step-by-step debug
npm run test:seo:debug

# Browser görünür mode
npm run test:seo:headed

# Full trace ile
PWDEBUG=1 npm run test:seo
```

## 📊 CI/CD Integration

### GitHub Actions örneği
```yaml
- name: Run SEO Tests
  run: |
    npm run test:setup
    npm run test:seo
    npm run lh:autorun
  env:
    PLAYWRIGHT_BASE_URL: ${{ secrets.STAGING_URL }}
```

### Production Testing
Production'a deploy öncesi test için:
```bash
# Staging environment
PLAYWRIGHT_BASE_URL=https://staging.ensotek.de npm run test:seo

# Production validation
PLAYWRIGHT_BASE_URL=https://www.ensotek.de npm run test:seo
```

## 📝 Test Sonuçları

- **HTML Report**: `test-results/html-report/index.html`
- **JUnit XML**: `test-results/junit.xml`  
- **Lighthouse Reports**: `.lighthouseci/`
- **Screenshots**: `test-results/artifacts/`

Test sonuçlarını lokalde görüntüleme:
```bash
npx playwright show-report test-results/html-report
```