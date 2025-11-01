import { defineConfig, devices } from '@playwright/test';
import { config } from 'dotenv';

config({ quiet: true });

export default defineConfig({
  testDir: './test',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  projects: [
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        contextOptions: { reducedMotion: 'reduce', serviceWorkers: 'block' }
      }
    }
  ],
  webServer: {
    command: 'pnpm preview',
    url: 'http://localhost:3000',
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  },
  use: {
    baseURL: 'http://localhost:3000',
    video: 'retain-on-failure'
  }
});
