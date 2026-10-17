import {defineConfig, devices} from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", {open: "never", outputFolder: "playwright-report"}],
  ],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on",
    screenshot: "on",
    video: "on",
  },
  projects: [
    {name: "chromium", use: {...devices["Desktop Chrome"]}},
  ],
  // Serves the transpiled output; run "npm run build" first.
  webServer: {
    command: "node express.mjs",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
