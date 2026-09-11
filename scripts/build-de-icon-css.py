#!/usr/bin/env python3
"""Split icon mappings without removing support for future CMS icons."""
from pathlib import Path
import hashlib,json,re
root=Path(__file__).resolve().parents[1]/'ensotek_de/frontend'
full=(root/'public/app/css/fontawesome-pro.subset-20260910.css').read_text()
source='\n'.join(p.read_text(errors='ignore') for p in (root/'src').rglob('*') if p.is_file() and p.suffix in {'.ts','.tsx','.scss','.json'} and p.name!='icon-css-manifest.json')
used=set(re.findall(r'fa-[a-z0-9-]+',source))
removed=[]
def keep(match):
 selector,body=match.groups()
 classes=set(re.findall(r'fa-[a-z0-9-]+',selector))
 # Only remove plain glyph mappings. Keep utilities, faces, keyframes and layout.
 if classes and re.fullmatch(r'\s*content:\s*[\"\'](?:\\[0-9a-fA-F]+)+[\"\'];?\s*',body) and not classes & used:
  removed.append(selector)
  return ''
 return match.group(0)
core=re.sub(r'([^{}]+)\{([^{}]*)\}',keep,full)
known=sorted(set(re.findall(r'fa-[a-z0-9-]+',core)))
name='fontawesome-core-'+hashlib.sha256(core.encode()).hexdigest()[:12]+'.css'
manifest={'coreHref':'/app/css/'+name,'fallbackHref':'/app/css/fontawesome-pro.subset-20260910.css','knownClasses':known}
# Every source icon mapping and every non-glyph rule must remain byte-for-byte.
for match in re.finditer(r'([^{}]+)\{([^{}]*)\}',full):
 if set(re.findall(r'fa-[a-z0-9-]+',match[1]))&used:
  assert match[0] in core, match[1]
assert len(core)<len(full)/2
(root/'public/app/css'/name).write_text(core)
(root/'src/components/icon-css-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps({'fullBytes':len(full.encode()),'coreBytes':len(core.encode()),'removedMappingRules':len(removed),'knownClasses':len(known),'sourceClasses':len(used),'coreHref':manifest['coreHref'],'sourceMappingsPreserved':True}))
