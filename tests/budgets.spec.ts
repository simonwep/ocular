import { test, expect } from '@playwright/test';

test('Show correct budget group totals and averages', async ({ page }) => {
  await page.goto('/income');

  // Validate column sums
  await page.getByTestId('group-0-budget-0-0').fill('1000');
  await page.getByTestId('group-0-budget-1-0').fill('200');
  await expect(page.getByTestId('group-0-month-0-total')).toContainText('€1,200');

  await page.getByTestId('group-1-budget-0-0').fill('500');
  await page.getByTestId('group-1-budget-1-0').fill('100');
  await expect(page.getByTestId('group-1-month-0-total')).toContainText('€600');
  await expect(page.getByTestId('month-0-total')).toContainText('€1,800');
  await expect(page.getByTestId('income-amount')).toContainText('€1,800');

  await page.getByTestId('group-1-budget-1-1').fill('100');
  await expect(page.getByTestId('month-0-total')).toContainText('€1,800');
  await expect(page.getByTestId('income-amount')).toContainText('€1,900');

  // Validate row sums and averages
  await page.getByTestId('group-0-budget-0-1').fill('500');
  await expect(page.getByTestId('group-0-budget-0-total')).toContainText('€1,500');
  await expect(page.getByTestId('group-0-budget-0-average')).toContainText('€125');
});

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
