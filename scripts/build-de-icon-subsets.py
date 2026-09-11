#!/usr/bin/env python3
"""Create small valid OFL icon fonts; keep full Free fonts for additional CMS glyphs."""
from pathlib import Path
import re,subprocess,json,hashlib,shutil
from fontTools.ttLib import TTFont
root=Path('ensotek_de/frontend');vendor=root/'public/fonts/fontawesome-free';vendor.mkdir(exist_ok=True)
# Source downloaded from https://github.com/FortAwesome/Font-Awesome/tree/6.x/webfonts
for name in ['fa-solid-900.woff2','fa-brands-400.woff2','LICENSE.txt']:
 if not (vendor/name).exists():shutil.copyfile(Path('/tmp/fa-free')/name,vendor/name)
css=(root/'public/app/css/fontawesome-pro.css').read_text();source='\n'.join(p.read_text(errors='ignore') for p in (root/'src').rglob('*') if p.is_file() and p.suffix in ['.tsx','.ts','.scss','.json']);classes=set(re.findall(r'fa-[a-z0-9-]+',source));codes={0xf009}
for selector,body in re.findall(r'([^{}]+)\{([^{}]*)\}',css):
 if set(re.findall(r'fa-[a-z0-9-]+',selector))&classes:codes.update(int(x,16) for x in re.findall(r'content:\s*[\"\']\\([0-9a-fA-F]+)',body))
codes.update(int(x,16) for x in re.findall(r'content:\s*[\"\']\\([0-9a-fA-F]{3,6})',source))
css=re.sub(r'@font-face\{[^{}]*\}','',css)
faces=[];proof=[]
for name,family,aliases,weights in [('fa-solid-900','Ensotek UI Icons',['Font Awesome 6 Pro','Font Awesome 5 Pro','FontAwesome'],[100,300,400,900]),('fa-brands-400','Ensotek Brand Icons',['Font Awesome 6 Brands','Font Awesome 5 Brands'],[400])]:
 src=vendor/(name+'.woff2');present=set(TTFont(src).getBestCmap())&codes;unicodes=','.join(f'U+{x:X}' for x in sorted(present));suffix=hashlib.sha256(unicodes.encode()).hexdigest()[:8];dest=vendor/f'{name}.subset-{suffix}.woff2'
 subprocess.run(['pyftsubset',str(src),'--unicodes='+unicodes,'--flavor=woff2','--output-file='+str(dest)],check=True,capture_output=True)
 subset=TTFont(dest)
 # Modified fonts use new internal family/full/PostScript names, preserving OFL notice.
 for record in subset['name'].names:
  if record.nameID in [1,4,6,16,17]:
   value=family.replace(' ','') if record.nameID==6 else 'Regular' if record.nameID==17 else family
   record.string=value.encode(record.getEncoding())
 subset.save(dest);assert present<=set(TTFont(dest).getBestCmap())
 for alias in aliases:
  for weight in weights:
   common='@font-face{font-family:"'+alias+'";font-style:normal;font-weight:'+str(weight)+';font-display:swap;'
   faces.append(common+'src:url(/fonts/fontawesome-free/'+src.name+') format("woff2")}')
   faces.append(common+'src:url(/fonts/fontawesome-free/'+dest.name+') format("woff2");unicode-range:'+unicodes+'}')
 proof.append({'file':str(dest),'glyphs':len(present),'fullBytes':src.stat().st_size,'subsetBytes':dest.stat().st_size})
css+='\n'+'\n'.join(faces)+'\n.fa-grid-2:before{content:"\\f009"}\n'
(root/'public/app/css/fontawesome-pro.subset-20260910.css').write_text(css)
Path('output/checklist-2026-09-09/continuation/de-icon-subsets.json').write_text(json.dumps({'sourceIconClasses':len(classes),'oldProFiles':'Three old Pro WOFF2 files fail Brotli decoding; no longer referenced by active stylesheet','source':'Font Awesome Free 6.x official repository','license':'SIL OFL 1.1; LICENSE.txt retained; subset internal names renamed','fallback':'Full valid Free fonts for additional CMS icons; grid-2 maps to grid','fonts':proof},indent=2));print(proof)
p=root/'src/components/FontAwesomeLoader.tsx';s=p.read_text().replace('/app/css/fontawesome-pro.css','/app/css/fontawesome-pro.subset-20260910.css');p.write_text(s)

# Refresh the small UI stylesheet and CMS fallback manifest after font changes.
subprocess.run(["python3", "scripts/build-de-icon-css.py"], check=True)
