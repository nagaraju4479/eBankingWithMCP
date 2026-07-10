import { test, expect } from '@playwright/test';

test('user can log in and see the dashboard', async ({ page }) => {
  await page.goto('http://localhost/bankms/');
  await page.locator('nav.site-navigation').getByRole('link', { name: 'User/Account Holder' }).click();

  await page.locator('input[name="email"]').fill('user@gmail.com');
  await page.locator('input[name="password"]').fill('user@123');
  await page.locator('button[name="login"]').click();

  await page.waitForURL(/dashboard\.php/);
  await expect(page).toHaveURL(/dashboard\.php/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
