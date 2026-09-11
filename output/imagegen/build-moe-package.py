import json
import shutil
import subprocess
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).parent
OUT = ROOT / 'moe-web-paketi-2026-09-09'
OUT.mkdir(exist_ok=True)
sources = json.loads((ROOT / 'moe-sources.json').read_text())
inventory = []

def convert(*args):
    subprocess.run(['convert', *map(str, args)], check=True)

for name, source in sources.items():
    design = '-'.join(name.split('-')[:2])
    folder = OUT / design
    folder.mkdir(exist_ok=True)
    if name.endswith('-icon'):
        icons = folder / 'icons'
        icons.mkdir(exist_ok=True)
        for size in (16, 32, 48, 180, 192, 512):
            filename = ('apple-touch-icon.png' if size == 180 else
                        f'favicon-{size}x{size}.png' if size <= 48 else f'icon-{size}.png')
            convert(source, '-resize', f'{size}x{size}!', '-background', '#111820', '-alpha', 'remove', '-alpha', 'off', '-strip', icons / filename)
        convert(icons / 'icon-512.png', '-define', 'icon:auto-resize=48,32,16', icons / 'favicon.ico')
        manifest = {'name':'MOE Kompozit', 'short_name':'MOE', 'start_url':'/',
                    'display':'standalone', 'background_color':'#111820', 'theme_color':'#111820',
                    'icons':[{'src':f'icon-{s}.png','sizes':f'{s}x{s}','type':'image/png','purpose':'any'} for s in (192,512)]}
        (icons / 'site.webmanifest').write_text(json.dumps(manifest, indent=2))
        continue
    with Image.open(source) as im:
        assert 'A' in im.getbands() and im.getchannel('A').getextrema()[0] == 0, name
    for width, height in ((1200,440),(600,220)):
        dest = folder / f'{name}-{width}.png'
        bounds = subprocess.check_output(['convert', source, '-alpha', 'extract', '-threshold', '10%', '-format', '%@', 'info:'], text=True)
        convert(source, '-crop', bounds, '+repage', '-resize', f'{width-24}x{height-24}',
                '-background', 'none', '-gravity', 'center', '-extent', f'{width}x{height}', '-strip', dest)
        convert(dest, '-define', 'webp:lossless=true', dest.with_suffix('.webp'))

for path in sorted(OUT.rglob('*')):
    if path.suffix in ('.png','.webp'):
        with Image.open(path) as im:
            if '/icons/' not in str(path):
                assert im.mode == 'RGBA' and im.getchannel('A').getextrema()[0] == 0, path
                assert im.getpixel((0,0))[3] == 0, path
            inventory.append({'file':str(path.relative_to(OUT)), 'width':im.width, 'height':im.height, 'bytes':path.stat().st_size})
(OUT / 'dosyalar.json').write_text(json.dumps(inventory, indent=2))

cards=[]
for design in ('logo-1','logo-2'):
    for lang, label in (('tr','KOMPOZİT'),('en','COMPOSITE')):
        for theme in ('light','dark'):
            name=f'{design}-{lang}-{theme}'
            cards.append(f'<article class="{theme}"><p>{design} · {label} · {theme}</p><img width="1200" height="440" src="{design}/{name}-1200.png" alt="MOE {label}"></article>')
    cards.append(f'<article class="dark"><p>{design} · ikonlar (gerçek boyut)</p><div class="icons">'+''.join(f'<img width="{s}" height="{s}" src="{design}/icons/'+('apple-touch-icon.png' if s==180 else f'favicon-{s}x{s}.png')+'" alt="MOE ikon">' for s in (16,32,48,180))+'</div></article>')
(OUT / 'onizleme.html').write_text('''<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>MOE web logo paketi</title><style>*{box-sizing:border-box}body{margin:0;padding:28px;font:15px system-ui;background:#e5e7eb;color:#17212b}main{max-width:1200px;margin:auto}section{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}article{padding:20px;border-radius:12px;overflow:hidden}p{font-size:12px;margin:0 0 12px}.light{background:#fff}.dark{background:#111820;color:#e7edf2}article>img{width:100%;height:auto;display:block}.icons{display:flex;align-items:center;gap:18px;flex-wrap:wrap}@media(max-width:680px){section{grid-template-columns:1fr}body{padding:16px}}</style><main><h1>MOE web logo paketi</h1><p>İki tasarım · Türkçe / İngilizce · light / dark</p><section>'''+''.join(cards)+'</section></main></html>')
(OUT / 'KULLANIM.md').write_text('''# MOE web logo paketi

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
''')
zip_path=shutil.make_archive(str(OUT),'zip',ROOT,OUT.name)
print(json.dumps({'zip':zip_path,'images':len(inventory),'bytes':Path(zip_path).stat().st_size},indent=2))
