import { expect, test } from '@playwright/test';

test('Load demo data', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('income-value')).toHaveText('€0');

  await page.getByTestId('tools-menu').click();
  await page.getByTestId('load-demo-data').click();
  await expect(page.getByTestId('income-value')).toHaveText('€108,600');
});

test('Copy data from one year to another', async ({ page }) => {
  await page.goto('/#demo');
  await expect(page.getByTestId('income-value')).toHaveText('€108,600');

  const currentYear = new Date().getFullYear();
  await page.getByTestId('change-year').click();
  await page.getByTestId(`change-year-${currentYear + 1}`).click();
  await expect(page.getByTestId('current-year')).toHaveText(String(currentYear + 1));
  await expect(page.getByTestId('income-value')).toHaveText('€0');

  await page.getByTestId('change-year').click();
  await page.getByTestId(`change-year-${currentYear}`).click();
  await expect(page.getByTestId('current-year')).toHaveText(String(currentYear));

  page.on('dialog', (dialog) => dialog.accept());

  await page.getByTestId('tools-menu').click();
  await page.getByTestId('copy-data').click();
  await page.getByTestId('change-year').click();
  await page.getByTestId(`change-year-${currentYear + 1}`).click();
  await page.getByTestId('tools-menu').click();
  await page.getByTestId('paste-data').click();
  await expect(page.getByTestId('current-year')).toHaveText(String(currentYear + 1));
  await expect(page.getByTestId('income-value')).toHaveText('€108,600');
});
