import { expect, test } from '@playwright/test';

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

// TODO: Placeholder for all-time overview

test('Show correct all time values based on the demo data', async ({ page }) => {
  await page.goto('/#demo');
  await page.getByTestId('view-all-time').click();

  await expect(page.getByTestId('all-time-savings')).toHaveText('€85,648');
  await expect(page.getByTestId('all-time-expenses')).toHaveText('€120,752');
  await expect(page.getByTestId('all-time-income')).toHaveText('€206,400');
  await expect(page.getByTestId('yoy-expense-growth')).toHaveText('-19.19%');
  await expect(page.getByTestId('yoy-income-growth')).toHaveText('11.04%');
});
