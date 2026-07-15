import { chromium, type FullConfig } from '@playwright/test';
import { mkdirSync } from 'fs';
import path from 'path';
import authData from './test-data/auth.json';

async function globalSetup(config: FullConfig) {
  const storageStatePath = path.resolve(__dirname, 'user.json');
  mkdirSync(path.dirname(storageStatePath), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(authData.baseUrl);
  await page.locator('nav.site-navigation').getByRole('link', { name: 'User/Account Holder' }).click();
  await page.locator(authData.selectors.emailInput).fill(authData.login.email);
  await page.locator(authData.selectors.passwordInput).fill(authData.login.password);
  await page.locator(authData.selectors.loginButton).click();

  await page.waitForURL(/dashboard\.php/);
  await context.storageState({ path: storageStatePath });

  await browser.close();

  if (config.projects.length > 0) {
    console.log(`Saved authentication state to ${storageStatePath}`);
  }
}

export default globalSetup;
