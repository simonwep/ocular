import { assertNoErrors } from './utils/assertNoErrors.ts';
import { expect, test } from '@playwright/test';

test.beforeEach(({ page }) => assertNoErrors(page));

test('Load demo data', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('income-value')).toHaveText('€0');

  await page.getByTestId('navigation-tools-menu').click();
  await page.getByTestId('load-demo-data').click();
  await expect(page.getByTestId('income-value')).toHaveText('€108,600');
});

test('Ask for loading demo data if there is already data', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('navigation-change-year').click();
  await page.getByTestId(`navigation-change-year-${new Date().getFullYear() + 1}`).click();
  await page.getByTestId('navigation-income').click();
  await page.getByTestId('group-0-budget-0-0').fill('100');
  await page.getByTestId('navigation-dashboard').click();
  await expect(page.getByTestId('load-demo-data-placeholder')).toBeVisible();

  page.on('dialog', (dialog) => dialog.dismiss());
  await page.getByTestId('load-demo-data-placeholder').click();
  await expect(page.getByTestId('income-value')).toHaveText('€100');
});

test.describe('Load demo data in different languages', () => {
  const tests = [
    { locale: 'en-US', wages: 'Wages' },
    { locale: 'de-DE', wages: 'Gehälter' }
  ];

  for (const data of tests) {
    test(`Load demo data in ${data.locale}`, async ({ browser }) => {
      const context = await browser.newContext({ locale: data.locale });
      const page = await context.newPage();

      await page.goto('/#demo');
      await page.getByTestId('view-summary').click();
      await expect(page.getByTestId('income-group-0')).toHaveText(data.wages);
    });
  }
});

test('Keep value in cells if unchanged', async ({ page }) => {
  await page.goto('/#demo');
  await page.getByTestId('navigation-income').click();
  const value = await page.getByTestId('group-0-budget-0-0').inputValue();

  await page.getByTestId('group-0-budget-0-0').focus();
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue(value);
});

test('Copy data from one year to another', async ({ page }) => {
  const currentYear = new Date().getFullYear();

  await page.goto('/#demo');
  await expect(page.getByTestId('income-value')).toHaveText('€108,600');
  await expect(page.getByTestId('current-year')).toHaveText(String(currentYear));

  await page.getByTestId('navigation-tools-menu').click();
  await page.getByTestId('copy-paste-data').click();
  await page.getByTestId('target-year').click();
  await page.getByTestId(`target-year-${currentYear + 1}`).click();
  await page.getByTestId('transfer-data').click();
  await expect(page.getByTestId('transfer-data')).toBeHidden();
  await expect(page.getByTestId('income-value')).toHaveText('€108,600');
  await expect(page.getByTestId('current-year')).toHaveText(String(currentYear + 1));
});

test('Copy data from one year to another without values', async ({ page }) => {
  const currentYear = new Date().getFullYear();

  await page.goto('/#demo');
  await expect(page.getByTestId('income-value')).toHaveText('€108,600');
  await expect(page.getByTestId('current-year')).toHaveText(String(currentYear));

  await page.getByTestId('navigation-tools-menu').click();
  await page.getByTestId('copy-paste-data').click();
  await page.getByTestId('target-year').click();
  await page.getByTestId(`target-year-${currentYear + 1}`).click();
  await page.getByTestId('include-values').uncheck();
  await page.getByTestId('transfer-data').click();
  await expect(page.getByTestId('transfer-data')).toBeHidden();
  await expect(page.getByTestId('income-value')).toHaveText('€0');
  await expect(page.getByTestId('current-year')).toHaveText(String(currentYear + 1));
});

test('Copy partial data from one year to another', async ({ page }) => {
  const currentYear = new Date().getFullYear();

  await page.goto('/#demo');
  await expect(page.getByTestId('income-value')).toHaveText('€108,600');
  await expect(page.getByTestId('current-year')).toHaveText(String(currentYear));

  await page.getByTestId('navigation-tools-menu').click();
  await page.getByTestId('copy-paste-data').click();
  await page.getByTestId('target-year').click();
  await page.getByTestId(`target-year-${currentYear + 1}`).click();
  await page.getByTestId('remove-Other').click();
  await page.getByTestId('remove-Home').click();
  await page.getByTestId('remove-Travel').click();
  await page.getByTestId('transfer-data').click();
  await expect(page.getByTestId('transfer-data')).toBeHidden();
  await expect(page.getByTestId('income-value')).toHaveText('€99,000');
  await expect(page.getByTestId('current-year')).toHaveText(String(currentYear + 1));

  await page.getByTestId('navigation-income').click();
  await expect(page.getByTestId('group-0-name')).toBeVisible();
  await expect(page.getByTestId('group-1-name')).toBeHidden();

  await page.getByTestId('navigation-expenses').click();
  await expect(page.getByTestId('group-7-name')).toHaveValue('Insurance');
  await expect(page.getByTestId('group-10-name')).toBeHidden();
});
