import { test } from '@playwright/test';

export const cleanupState = () => {
  test.beforeEach(async ({ page }) => {
    page.addInitScript(() => {
      window.localStorage.clear();
    })
  });
}
