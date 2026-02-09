// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

// Base URL configuration for different environments
const rawBaseURL =
  process.env.PLAYWRIGHT_BASE_URL || 
  process.env.NEXT_PUBLIC_SITE_URL || 
  'http://localhost:3000';

const baseURL = String(rawBaseURL).trim().replace(/\/+$/, '');

// Test environment configuration
const testEnv = {
  // Default test slugs for detail pages
  PLAYWRIGHT_PRODUCT_SLUG: process.env.PLAYWRIGHT_PRODUCT_SLUG || 'cooling-tower-test',
  PLAYWRIGHT_SERVICE_SLUG: process.env.PLAYWRIGHT_SERVICE_SLUG || 'maintenance-service',
  PLAYWRIGHT_NEWS_SLUG: process.env.PLAYWRIGHT_NEWS_SLUG || 'latest-technology-2024',
  PLAYWRIGHT_LIBRARY_SLUG: process.env.PLAYWRIGHT_LIBRARY_SLUG || 'installation-guide',
  PLAYWRIGHT_TEAM_SLUG: process.env.PLAYWRIGHT_TEAM_SLUG || 'engineering-team',
  
  // Locale configuration
  PLAYWRIGHT_LOCALES: process.env.PLAYWRIGHT_LOCALES || 'de,tr,en',
  PLAYWRIGHT_DEFAULT_LOCALE: process.env.PLAYWRIGHT_DEFAULT_LOCALE || 'de',
  PLAYWRIGHT_DEFAULT_NO_PREFIX: process.env.PLAYWRIGHT_DEFAULT_NO_PREFIX || '1'
};

export default defineConfig({
  testDir: './tests',
  timeout: 90_000, // Arttırıldı: Cloudinary image loading için
  expect: { 
    timeout: 15_000 // SEO head loading için yeterli süre
  },
  retries: process.env.CI ? 2 : 1,
  fullyParallel: true,
  
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Ensotek için browser settings
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
    
    // Test environment variables
    extraHTTPHeaders: {
      'Accept-Language': 'de,tr,en'
    }
  },
  
  // Environment variables for tests
  env: testEnv,
  
  projects: [
    {
      name: 'chromium-desktop',
      use: { 
        ...devices['Desktop Chrome'],
        // Ensotek desktop optimization
        viewport: { width: 1920, height: 1080 }
      }
    },
    {
      name: 'firefox-desktop', 
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      }
    }
  ],
  
  // Test reporting
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['line']
  ],
  
  outputDir: './test-results/artifacts',
});
