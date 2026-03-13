import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, 'reports');
const REPORT_FILE = path.join(REPORT_DIR, 'seo-crawl-report.json');
const BUILD_ID_FILE = path.join(ROOT, '.next', 'BUILD_ID');
const STANDALONE_DIR = path.join(ROOT, '.next', 'standalone', 'karbonkompozit');
const STANDALONE_SERVER = path.join(STANDALONE_DIR, 'server.js');
const PREPARE_SCRIPT = path.join(ROOT, 'scripts', 'prepare-standalone.mjs');
const PORT = Number.parseInt(process.env.CRAWL_PORT || '3123', 10);
const ORIGIN = (process.env.APP_ORIGIN || `http://127.0.0.1:${PORT}`).replace(/\/$/, '');
const MAX_PAGES = Number.parseInt(process.env.CRAWL_MAX_PAGES || '150', 10);
const FETCH_TIMEOUT_MS = Number.parseInt(process.env.CRAWL_FETCH_TIMEOUT_MS || '8000', 10);

function isInternal(url) {
  return url.startsWith(ORIGIN);
}

function stripHash(url) {
  return url.split('#')[0];
}

function normalizeUrl(url) {
  const parsed = new URL(url, ORIGIN);
  const origin = new URL(ORIGIN);
  parsed.protocol = origin.protocol;
  parsed.host = origin.host;
  parsed.hash = '';
  return parsed.toString().replace(/\/$/, '') || ORIGIN;
}

function shouldSkipUrl(url) {
  const parsed = new URL(url, ORIGIN);
  return parsed.pathname.startsWith('/_next/');
}

async function ensureBuildExists() {
  await access(BUILD_ID_FILE);
  await access(STANDALONE_SERVER);
  await access(PREPARE_SCRIPT);
}

async function prepareStandaloneAssets() {
  await new Promise((resolve, reject) => {
    const proc = spawn(process.execPath, [PREPARE_SCRIPT], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
    });

    let stderr = '';
    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    proc.on('exit', (code) => {
      if (code === 0) {
        resolve(undefined);
        return;
      }

      reject(new Error(stderr.trim() || `prepare-standalone exited with code ${code}`));
    });
  });
}

async function waitForServer(proc) {
  const start = Date.now();

  while (Date.now() - start < 20000) {
    if (proc.exitCode != null) {
      throw new Error(`standalone server exited early with code ${proc.exitCode}`);
    }

    try {
      const res = await fetch(`${ORIGIN}/tr`, {
        redirect: 'manual',
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (res.ok) return;
    } catch {
      // Server is still booting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error('Timed out waiting for standalone server to become ready.');
}

async function fetchText(url) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    return {
      status: res.status,
      contentType: res.headers.get('content-type') || '',
      text: await res.text(),
      error: '',
    };
  } catch (error) {
    return {
      status: 599,
      contentType: '',
      text: '',
      error: error instanceof Error ? error.message : 'Unknown fetch error',
    };
  }
}

function extractLinks(html) {
  const links = new Set();
  const hrefPattern = /href="([^"]+)"/g;
  let match;
  while ((match = hrefPattern.exec(html))) {
    const href = match[1];
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
      continue;
    }
    try {
      const url = normalizeUrl(new URL(href, ORIGIN).toString());
      if (isInternal(url) && !shouldSkipUrl(url)) {
        links.add(stripHash(url));
      }
    } catch {
      continue;
    }
  }
  return [...links];
}

function extractSitemapUrls(xml) {
  const matches = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches.map((match) => stripHash(normalizeUrl(match[1].trim())));
}

async function createReport() {
  const sitemapResponse = await fetchText(`${ORIGIN}/sitemap.xml`);
  if (sitemapResponse.status !== 200) {
    throw new Error(`Could not fetch sitemap.xml from ${ORIGIN} (${sitemapResponse.status})`);
  }

  const sitemapUrls = extractSitemapUrls(sitemapResponse.text);
  const queue = [...sitemapUrls];
  const visited = new Set();
  const incoming = new Map();
  const broken = [];

  while (queue.length > 0 && visited.size < MAX_PAGES) {
    const url = queue.shift();
    if (!url || visited.has(url)) continue;
    visited.add(url);

    const { status, contentType, text, error } = await fetchText(url);
    if (status >= 400) {
      broken.push({ url, status, source: error ? `crawl:${error}` : 'crawl' });
      continue;
    }

    if (!contentType.includes('text/html')) continue;

    for (const link of extractLinks(text)) {
      const currentIncoming = incoming.get(link) || [];
      currentIncoming.push(url);
      incoming.set(link, currentIncoming);

      if (!visited.has(link) && !queue.includes(link) && queue.length + visited.size < MAX_PAGES) {
        queue.push(link);
      }
    }
  }

  const orphanUrls = sitemapUrls.filter((url) => {
    if (url === `${ORIGIN}/tr` || url === `${ORIGIN}/en`) return false;
    const refs = incoming.get(url) || [];
    return refs.length === 0;
  });

  const report = {
    origin: ORIGIN,
    crawledAt: new Date().toISOString(),
    sitemapCount: sitemapUrls.length,
    crawledCount: visited.size,
    broken,
    orphanUrls,
  };

  await mkdir(REPORT_DIR, { recursive: true });
  await writeFile(REPORT_FILE, JSON.stringify(report, null, 2));

  console.log(`SEO crawl report written to ${path.relative(ROOT, REPORT_FILE)}`);
  console.log(`Crawled: ${visited.size}`);
  console.log(`Broken: ${broken.length}`);
  console.log(`Orphans: ${orphanUrls.length}`);
}

await ensureBuildExists();
await prepareStandaloneAssets();

const proc = spawn(process.execPath, [STANDALONE_SERVER], {
  cwd: STANDALONE_DIR,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: {
    ...process.env,
    PORT: String(PORT),
    HOSTNAME: '127.0.0.1',
  },
});

let stdout = '';
proc.stdout.on('data', (chunk) => {
  stdout += chunk.toString();
});

let stderr = '';
proc.stderr.on('data', (chunk) => {
  stderr += chunk.toString();
});

try {
  await waitForServer(proc);
  await createReport();
} catch (error) {
  if (stdout.trim()) console.error(stdout.trim());
  if (stderr.trim()) console.error(stderr.trim());
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  proc.kill('SIGTERM');
}
