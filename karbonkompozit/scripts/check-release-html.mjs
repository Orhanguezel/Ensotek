import { access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BUILD_ID_FILE = path.join(ROOT, '.next', 'BUILD_ID');
const STANDALONE_DIR = path.join(ROOT, '.next', 'standalone', 'karbonkompozit');
const STANDALONE_SERVER = path.join(STANDALONE_DIR, 'server.js');
const PREPARE_SCRIPT = path.join(ROOT, 'scripts', 'prepare-standalone.mjs');
const PORT = 3121;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const routeChecks = [
  {
    pathname: '/tr',
    patterns: ['data-theme-template="moe-carbon-industrial"', 'data-theme-mode="light"', '<link rel="canonical"'],
  },
  {
    pathname: '/tr/products',
    patterns: ['data-theme-template="moe-carbon-industrial"', 'MOE Kompozit'],
  },
  {
    pathname: '/tr/blog',
    patterns: ['data-theme-template="moe-carbon-industrial"', '<html lang="tr"'],
  },
  {
    pathname: '/tr/contact',
    patterns: ['data-theme-template="moe-carbon-industrial"', '<html lang="tr"'],
  },
  {
    pathname: '/robots.txt',
    patterns: ['User-Agent', 'Sitemap:'],
  },
  {
    pathname: '/sitemap.xml',
    patterns: ['<urlset', '/tr/products', '/tr/blog'],
  },
];

async function ensureBuildExists() {
  try {
    await access(BUILD_ID_FILE);
    await access(STANDALONE_SERVER);
    await access(PREPARE_SCRIPT);
  } catch {
    throw new Error('Missing standalone build output. Run `npm run build` before `npm run test:release`.');
  }
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
      const res = await fetch(`${BASE_URL}/tr`, { redirect: 'manual' });
      if (res.ok) return;
    } catch {
      // Server is still booting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error('Timed out waiting for standalone server to become ready.');
}

async function runChecks() {
  const failures = [];

  for (const { pathname, patterns } of routeChecks) {
    const res = await fetch(`${BASE_URL}${pathname}`, { redirect: 'manual' });
    const text = await res.text();

    if (!res.ok) {
      failures.push(`${pathname}: expected 200, got ${res.status}`);
      continue;
    }

    for (const pattern of patterns) {
      if (!text.includes(pattern)) {
        failures.push(`${pathname}: missing pattern ${pattern}`);
      }
    }
  }

  if (failures.length > 0) {
    throw new Error(`Release HTML smoke check failed:\n${failures.map((line) => `- ${line}`).join('\n')}`);
  }
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
  await runChecks();
  console.log('Release HTML smoke check passed');
} catch (error) {
  if (stdout.trim()) {
    console.error(stdout.trim());
  }
  if (stderr.trim()) {
    console.error(stderr.trim());
  }
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  proc.kill('SIGTERM');
}
