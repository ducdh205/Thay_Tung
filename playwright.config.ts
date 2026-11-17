import { defineConfig } from '@playwright/test';

// Runs the built single file over file:// in the Edge already installed on this machine.
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 90_000,
  workers: 1,
  fullyParallel: false,
  reporter: 'list',
  use: { channel: 'msedge', viewport: { width: 1920, height: 1080 } },
});
