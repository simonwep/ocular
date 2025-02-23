import { expect, test } from '@playwright/test';

test('Change the locale', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('current-year-text')).toContainText('Annual budget for');

  await page.getByTestId('settings').click();
  await page.getByTestId('change-locale').click();
  await page.getByTestId('change-locale-de').click();
  await expect(page.getByTestId('current-year-text')).toContainText('Jährliches Budget für');
});

test('Change the currency and apply correct locale format', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('income-value')).toHaveText('€0');

  await page.getByTestId('settings').click();
  await page.getByTestId('change-currency').click();
  await page.getByTestId('change-currency-USD').click();
  await expect(page.getByTestId('income-value')).toHaveText('$0');

  await page.getByTestId('change-locale').click();
  await page.getByTestId('change-locale-de').click();
  await expect(page.getByTestId('income-value')).toHaveText('0 $');
});

test('Change the starting month', async ({ page }) => {
  await page.goto('/income');
  await expect(page.getByTestId('month-0-name')).toHaveText('January');
  await expect(page.getByTestId('month-11-name')).toHaveText('December');

  await page.getByTestId('settings').click();
  await page.getByTestId('change-month-offset').click();
  await page.getByTestId('change-month-offset-2').click();
  await expect(page.getByTestId('month-0-name')).toHaveText('March');
  await expect(page.getByTestId('month-11-name')).toHaveText('February');
});

test('Carry over net-savings to next year', async ({ page }) => {
  const currentYear = new Date().getFullYear();

  await page.goto('/#demo');
  await page.getByTestId('change-year').click();
  await page.getByTestId(`change-year-${currentYear + 1}`).click();
  await expect(page.getByTestId('income-sub')).toBeHidden();
  await expect(page.getByTestId('income-value')).toHaveText('€0');
  await expect(page.getByTestId('ending-balance-value')).toHaveText('€0');

  await page.getByTestId('change-year').click();
  await page.getByTestId(`change-year-${currentYear}`).click();
  await expect(page.getByTestId('income-sub')).toBeHidden();
  await expect(page.getByTestId('income-value')).toHaveText('€108,600');
  await expect(page.getByTestId('ending-balance-value')).toHaveText('€41,817');

  await page.getByTestId('change-year').click();
  await page.getByTestId(`change-year-${currentYear - 1}`).click();
  await expect(page.getByTestId('income-sub')).toBeHidden();
  await expect(page.getByTestId('income-value')).toHaveText('€97,800');
  await expect(page.getByTestId('ending-balance-value')).toHaveText('€43,831');

  await page.getByTestId('settings').click();
  await page.getByTestId('carry-over-net-savings').check();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('income-sub')).toBeHidden();
  await expect(page.getByTestId('income-value')).toHaveText('€97,800');
  await expect(page.getByTestId('ending-balance-value')).toHaveText('€43,831');

  await page.getByTestId('change-year').click();
  await page.getByTestId(`change-year-${currentYear}`).click();
  await expect(page.getByTestId('income-sub')).toHaveText('€43,831');
  await expect(page.getByTestId('income-value')).toHaveText('€152,431');
  await expect(page.getByTestId('ending-balance-value')).toHaveText('€85,648');

  await page.getByTestId('change-year').click();
  await page.getByTestId(`change-year-${currentYear + 1}`).click();
  await expect(page.getByTestId('income-sub')).toHaveText('€85,648');
  await expect(page.getByTestId('income-value')).toHaveText('€85,648');
  await expect(page.getByTestId('ending-balance-value')).toHaveText('€85,648');
});
