# MOE web logo paketi

`logo-1` ilk (üst), `logo-2` ikinci (alt) tasarımı temel alır.
Her tasarımda Türkçe `tr` ve İngilizce `en`; açık zemin için `light`, koyu zemin için `dark` dosyaları bulunur.

## Logolar

- PNG ve kayıpsız WebP, gerçek şeffaf zemin.
- 1200 × 440 ve 600 × 220 piksel. Tüm logo sürümleri aynı tuval oranındadır.
- Fazla dış boşluklar kırpıldı, kenarlarda güvenli küçük pay bırakıldı.
- 600 piksel dosya, 300 piksele kadar gösterim için 2x çözünürlük sağlar.
- `width` ve `height` oranını koruyun; CSS `height:auto` kullanın. Sabit yükseklikte `object-fit:contain` kullanın.
- Yapay zekâ ile düzenlenmiş raster dosyalardır; vektör kaynak değildir. Kaynak tasarımla küçük detay farkları olabilir.

## HTML örneği

Seçtiğiniz tasarımın klasörünü sitenin `public/brand/` klasörüne kopyalayın.
Aşağıdaki örnek tarayıcının tema tercihine göre Türkçe logoyu seçer.
Sitenizde ayrı bir tema düğmesi varsa `src` seçimini uygulamanın aktif temasına bağlayın.

```html
<picture>
  <source media="(prefers-color-scheme: dark)"
    srcset="/brand/logo-1/logo-1-tr-dark-600.webp 600w, /brand/logo-1/logo-1-tr-dark-1200.webp 1200w"
    sizes="240px" type="image/webp">
  <source srcset="/brand/logo-1/logo-1-tr-light-600.webp 600w, /brand/logo-1/logo-1-tr-light-1200.webp 1200w"
    sizes="240px" type="image/webp">
  <img src="/brand/logo-1/logo-1-tr-light-600.png"
    width="600" height="220" style="width:240px;max-width:100%;height:auto" alt="MOE Kompozit">
</picture>

<link rel="icon" href="/brand/logo-1/icons/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/brand/logo-1/icons/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/brand/logo-1/icons/apple-touch-icon.png">
<link rel="manifest" href="/brand/logo-1/icons/site.webmanifest">
<meta name="theme-color" content="#111820">
```

## İkonlar

İki tasarım için ayrı O amblemi. Küçük boyutta okunmayacağı için alt yazı kullanılmadı.
Favicon ICO içinde 16/32/48 piksel; ayrıca aynı boyutlarda PNG bulunur.
Apple Touch 180 × 180, uygulama ikonları 192 × 192 ve 512 × 512 pikseldir.
İkonlar, hem light hem dark arayüzde kullanılabilen opak koyu zeminlidir; Apple Touch köşeleri dosyada yuvarlatılmadı.
Web manifest içindeki isim ve start_url siteye göre düzenlenebilir. İkonlar maskable olarak işaretlenmedi.

`onizleme.html` dosyasını tarayıcıda açarak tüm sürümleri karşılaştırın.
`dosyalar.json` boyut ve dosya büyüklüğü envanteridir.

## Üretim

Görsel düzenleme: yerleşik imagegen. İstek: onaylı logoyu koru, beyaz zemini gerçek şeffaflığa dönüştür, dark sürümde alt yazıyı beyaz yap, dış boşlukları azalt. İkon isteği: karbon dokulu turuncu O amblemini kare koyu zeminde ortala.
Web dışa aktarma: ImageMagick ile kırpma, ortak tuval, PNG/WebP/ICO boyutlandırma.
