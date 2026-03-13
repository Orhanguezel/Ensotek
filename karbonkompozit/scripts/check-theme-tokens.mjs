import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, 'src');
const ALLOWED_HEX_FILE = path.join('src', 'styles', 'globals.css');
const ALLOWED_HEX_FILES = new Set([
  ALLOWED_HEX_FILE,
  path.join('src', 'app', 'opengraph-image.tsx'),
  path.join('src', 'app', 'twitter-image.tsx'),
  path.join('src', 'app', 'icon.tsx'),
  path.join('src', 'app', 'apple-icon.tsx'),
  path.join('src', 'app', 'manifest.ts'),
]);
const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);

const problems = [];
const requiredThemeFiles = [
  path.join(ROOT, 'src', 'lib', 'preferences', 'theme.ts'),
  path.join(ROOT, 'src', 'lib', 'preferences', 'theme-utils.ts'),
  path.join(ROOT, 'src', 'scripts', 'theme-boot.tsx'),
];

for (const file of requiredThemeFiles) {
  try {
    await readFile(file, 'utf8');
  } catch {
    problems.push(`${path.relative(ROOT, file)}: missing theme core file`);
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.next' || entry.name === 'node_modules') continue;
      await walk(fullPath);
      continue;
    }

    if (!EXTS.has(path.extname(entry.name))) continue;

    const rel = path.relative(ROOT, fullPath);
    const content = await readFile(fullPath, 'utf8');

    if (!ALLOWED_HEX_FILES.has(rel) && /#[0-9a-fA-F]{3,8}\b/.test(content)) {
      problems.push(`${rel}: raw hex color found`);
    }

    if (!ALLOWED_HEX_FILES.has(rel) && /var\(--(?:slate|brand|carbon)-/.test(content)) {
      problems.push(`${rel}: legacy token alias found`);
    }

    if (!ALLOWED_HEX_FILES.has(rel) && /\bbg-white(?![/-])\b/.test(content)) {
      problems.push(`${rel}: hardcoded bg-white surface found`);
    }

    if (rel === path.join('src', 'styles', 'globals.css')) {
      if (content.includes(":root[data-theme-preset='default']")) {
        problems.push(`${rel}: high-specificity light preset selector found`);
      }
      if (!content.includes("html[data-theme-mode='dark']")) {
        problems.push(`${rel}: missing dark theme root selector`);
      }
      if (!content.includes('.surface-dark-link')) {
        problems.push(`${rel}: missing surface-dark-link utility`);
      }
    }
  }
}

await walk(SRC_DIR);

if (problems.length > 0) {
  console.error('Theme token check failed:\n' + problems.map((line) => `- ${line}`).join('\n'));
  process.exit(1);
}

console.log('Theme token check passed');
