import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.SECANI_URL ? 1 : 4,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: process.env.SECANI_URL ? 90000 : 30000,
  use: {
    // Default localhost para desarrollo; SECANI_URL=http://54.90.124.49:9110 para correr contra EC2.
    baseURL: process.env.SECANI_URL || 'http://localhost:9110',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true,
    actionTimeout: process.env.SECANI_URL ? 30000 : 15000,
    navigationTimeout: process.env.SECANI_URL ? 60000 : 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
