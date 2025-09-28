import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/api/**'],
  fullyParallel: true,
  forbidOnly: true,       // true = test.only() is not allowed in CI. Remove .only() calls.
  retries: process.env.CI ? 1 : 0,
  workers: 10,
  timeout: 180000,        // Maximum time one test can run for
  expect: {
    timeout: 15000,       // Increasing the default expect timeout from 5 to 15 seconds
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
    video: 'retain-on-failure',         // 'off' to disable, 'on' to always record, 'retain-on-failure' to keep videos only on failure
    screenshot: 'only-on-failure',      // 'off' to disable, 'on' to always capture, 'only-on-failure' to capture only when a test fails
    trace: 'off',                       // 'off' to disable, 'on' to always record, 'retain-on-failure' to keep traces only on failure
    actionTimeout: 20000,               // Default timeout for all actions (click, fill, etc.)
    navigationTimeout: 20000,           // Default timeout for navigation actions (goto, reload, etc.)
    launchOptions: {
      slowMo: process.env.SLOW ? 1000 : 0, // Only slow down when debugging --> sample usage: SLOW=1 npx playwright test
      headless: !process.env.SLOW,         // Run in headless mode unless SLOW is set
      // headless: true,4
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
      name: 'local',    // when you don't specify a browser explicitly, Chromium is the default browser that gets used.
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
        launchOptions: {
          args: ["-width=1920", "-height=1080"],
        },
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "webkit", // Safari
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