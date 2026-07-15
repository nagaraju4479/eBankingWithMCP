import { test, expect } from '../src/helpers/auth.fixture';

test('authenticated user session is available', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('user/dashboard.php');
  await authenticatedPage.waitForLoadState('networkidle');
  await expect(authenticatedPage).toHaveURL(/dashboard\.php/);
  await expect(authenticatedPage.locator('body')).toContainText('Dashboard');
});
