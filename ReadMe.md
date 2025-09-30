# Playwright Test Automation 


## 🚀 Quick Start

**Install Plugin**
> Playwright Test for VSCode

**Clone the repository and run following commands:**

  - `npm install`
  - `npx playwright install`  (to download browsers)

<br>

*Good to have:*
  - `sudo npm install -g playwright`  (Optional - Install Playwright globally)
  - `npm install -g allure-commandline` (Optional - Install Allure CLI globally to view Allure reports)

<br>


### Report Artifacts Configuration

Configure what artifacts are captured during test execution in your `playwright.config.ts`:

```typescript
export default defineConfig({
  use: {
    // Video recording options
    video: 'retain-on-failure',    // 'off' | 'on' | 'retain-on-failure'
    
    // Screenshot capture options  
    screenshot: 'only-on-failure', // 'off' | 'on' | 'only-on-failure'
    
    // Trace recording options
    trace: 'retain-on-failure',    // 'off' | 'on' | 'retain-on-failure' | 'on-first-retry'
    
  },
});
```