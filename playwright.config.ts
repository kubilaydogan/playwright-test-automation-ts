import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/api/**'],
  fullyParallel: true,
  forbidOnly: true,
  retries: process.env.CI ? 1 : 0,
  workers: 10,
  timeout: 180000,
  expect: {
    timeout: 15000,
  },
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['junit', { outputFile: 'test-results/test-results.xml' }],
    ['allure-playwright']
  ],

  use: {
    baseURL: '',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'off',
    actionTimeout: 20000,
    navigationTimeout: 20000,
    launchOptions: {
      slowMo: process.env.SLOW ? 1000 : 0,
      headless: !process.env.SLOW,         // Run in headless mode unless SLOW is set
      // headless: true,
      args: [
        "--start-maximized",
        "--ignore-certificate-errors",
        "--no-sandbox",
        "--disable-dev-shm-usage"
      ],
    },
  },

  projects: [
    {
      name: 'local',
      use: {
        viewport: null,
        launchOptions: {
          headless: false,
          args: [
            "--start-maximized"
          ],
        }
      },
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1920, height: 1080 },
      },
    },

    // A no-browser project for API or unit testing
    {
      name: 'api',
      testDir: './tests/api',
      testIgnore: "",
      workers: 1,
      use: {
        baseURL: 'https://restful-booker.herokuapp.com',
      },
    }
  ]

});