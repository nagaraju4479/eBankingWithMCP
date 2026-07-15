import { test as base, type BrowserContext, type Page } from '@playwright/test';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

const storageStatePath = path.resolve(__dirname, '../../user.json');

type AuthFixtures = {
  authenticatedContext: BrowserContext;
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedContext: async ({ browser }, use) => {
    if (!existsSync(storageStatePath)) {
      throw new Error(`Authentication state not found at ${storageStatePath}. Run the global setup before executing tests.`);
    }

    const context = await browser.newContext({ storageState: storageStatePath });
    await use(context);
    await context.close();
  },

  authenticatedPage: async ({ authenticatedContext }, use, testInfo) => {
    const page = await authenticatedContext.newPage();

    await use(page);

    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotDir = path.resolve(__dirname, '../../test-results/screenshots');
      mkdirSync(screenshotDir, { recursive: true });
      const screenshotPath = path.join(screenshotDir, `${testInfo.title.replace(/\s+/g, '-')}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });
    }

    await page.close();
  },
});

export { expect } from '@playwright/test';
