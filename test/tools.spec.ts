import { assertNoErrors } from './utils/assertNoErrors.ts';
import { expect, test } from '@playwright/test';

test.beforeEach(({ page }) => assertNoErrors(page));

test('Load demo data', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('income-value')).toHaveText('€0');

  await page.getByTestId('tools-menu').click();
  await page.getByTestId('load-demo-data').click();
  await expect(page.getByTestId('income-value')).toHaveText('€108,600');
});

test.describe('Load demo data in different languages', () => {
  const tests = [
    { locale: 'en-US', wages: 'Wages' },
    { locale: 'de-DE', wages: 'Gehälter' },
    { locale: 'fr-FR', wages: 'Salaires' }
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
