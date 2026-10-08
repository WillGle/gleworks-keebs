import { defineConfig, devices } from '@playwright/test'
import path from 'node:path'

const runDir = process.env.GLEWORKS_RUN_DIR || path.resolve('logs', `${new Date().toISOString().replace(/[:.]/g, '-')}-direct-playwright-${process.pid}`)
// Keep the managed server's build/preview logs with direct Playwright runs too.
process.env.GLEWORKS_RUN_DIR = runDir

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  outputDir: path.join(runDir, 'test-results'),
  reporter: [['list'], ['html', {
    open: 'never',
    outputFolder: path.join(runDir, 'playwright-report'),
  }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: false,
    timeout: 60000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
  },
})
