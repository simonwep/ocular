import { expect, test } from '@playwright/test';

test('Navigate and show correct page title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Dashboard');

  await page.getByTestId('navigation-income').click();
  await expect(page).toHaveTitle('Income');

  await page.getByTestId('navigation-expenses').click();
  await expect(page).toHaveTitle('Expenses');

  await page.getByTestId('navigation-dashboard').click();
  await expect(page).toHaveTitle('Dashboard');
});
