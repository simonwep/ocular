import { assertNoErrors } from './utils/assertNoErrors.ts';
import { expect, test } from '@playwright/test';

test.beforeEach(({ page }) => assertNoErrors(page));

test('Show correct dashboard values based on incomes and expenses', async ({ page }) => {
  await page.goto('/income');
  await page.getByTestId('group-0-budget-0-0').fill('1000');
  await page.getByTestId('group-1-budget-0-0').fill('200');

  await page.getByTestId('navigation-expenses').click();
  await expect(page.getByTestId('group-0-budget-0-0')).toBeEmpty();

  await page.getByTestId('group-0-budget-0-0').fill('300');
  await page.getByTestId('group-1-budget-0-0').fill('100');

  await page.getByTestId('navigation-dashboard').click();
  await expect(page.getByTestId('income-value')).toContainText('€1,200');
  await expect(page.getByTestId('expenses-value')).toContainText('€400');
  await expect(page.getByTestId('expenses-sub')).toContainText('33%');
  await expect(page.getByTestId('ending-balance-value')).toContainText('€800');
});

test('Show correct all time values based on the demo data', async ({ page }) => {
  await page.goto('/#demo');
  await page.getByTestId('view-all-time').click();

  await expect(page.getByTestId('all-time-savings')).toHaveText('€85,648');
  await expect(page.getByTestId('all-time-expenses')).toHaveText('€120,752');
  await expect(page.getByTestId('all-time-income')).toHaveText('€206,400');
  await expect(page.getByTestId('yoy-expense-growth')).toHaveText('-19.19%');
  await expect(page.getByTestId('yoy-income-growth')).toHaveText('11.04%');
});

test('Show correct remaining balance', async ({ page }) => {
  const year = new Date().getFullYear();

  await page.clock.setFixedTime(`${year}-12-15`);
  await page.goto('/#demo');
  await expect(page.getByTestId('remaining-balance-alt')).toHaveText(/to an end/);
  await expect(page.getByTestId('remaining-balance-value')).toBeHidden();

  await page.clock.setFixedTime(`${year}-11-15`);
  await expect(page.getByTestId('remaining-balance-alt')).toBeHidden();
  await expect(page.getByTestId('remaining-balance-value')).toHaveText('€2,581');

  await page.getByTestId('settings').click();
  await page.getByTestId('change-month-offset').click();
  await page.getByTestId('change-month-offset-2').click();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('remaining-balance-alt')).toBeHidden();
  await expect(page.getByTestId('remaining-balance-value')).toHaveText('€9,253');

  await page.getByTestId('settings').click();
  await page.getByTestId('change-month-offset').click();
  await page.getByTestId('change-month-offset-11').click();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('remaining-balance-alt')).toHaveText(/the past/);
  await expect(page.getByTestId('remaining-balance-value')).toBeHidden();

  await page.clock.setFixedTime(`${year + 1}-12-15`);
  await expect(page.getByTestId('remaining-balance-alt')).toBeHidden();
  await expect(page.getByTestId('remaining-balance-value')).toHaveText('€41,817');
  await expect(page.getByTestId('remaining-balance-sub')).toContainText('100%');
});
