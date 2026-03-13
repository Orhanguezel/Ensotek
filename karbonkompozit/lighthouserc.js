// @ts-check
/** @type {import('@lhci/cli').default} */
module.exports = {
  ci: {
    collect: {
      url: [
        'http://127.0.0.1:3122/tr',
        'http://127.0.0.1:3122/en',
        'http://127.0.0.1:3122/tr/products',
        'http://127.0.0.1:3122/tr/blog',
        'http://127.0.0.1:3122/tr/gallery',
        'http://127.0.0.1:3122/tr/contact',
      ],
      startServerCommand: 'node scripts/prepare-standalone.mjs && PORT=3122 HOSTNAME=127.0.0.1 node .next/standalone/karbonkompozit/server.js',
      startServerReadyPattern: 'Ready in',
      numberOfRuns: 2,
      settings: {
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'document-title': 'error',
        'meta-description': 'error',
        'canonical': 'error',
        'crawlable-anchors': 'error',
        'http-status-code': 'error',
        'hreflang': 'error',
        'is-crawlable': 'error',

        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
