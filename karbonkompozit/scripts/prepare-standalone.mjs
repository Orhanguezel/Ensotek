import { access, cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const NEXT_DIR = path.join(ROOT, '.next');
const STANDALONE_APP_DIR = path.join(NEXT_DIR, 'standalone', 'karbonkompozit');
const STATIC_SOURCE = path.join(NEXT_DIR, 'static');
const STATIC_TARGET = path.join(STANDALONE_APP_DIR, '.next', 'static');
const PUBLIC_SOURCE = path.join(ROOT, 'public');
const PUBLIC_TARGET = path.join(STANDALONE_APP_DIR, 'public');

async function ensureExists(targetPath) {
  await access(targetPath);
}

async function copyIfPresent(source, target) {
  try {
    await ensureExists(source);
  } catch {
    return;
  }

  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target, { recursive: true, force: true });
}

await ensureExists(STANDALONE_APP_DIR);
await copyIfPresent(STATIC_SOURCE, STATIC_TARGET);
await copyIfPresent(PUBLIC_SOURCE, PUBLIC_TARGET);

console.log('Standalone assets prepared');
