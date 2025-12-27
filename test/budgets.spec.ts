import { assertNoErrors } from './utils/assertNoErrors.ts';
import { test, expect } from '@playwright/test';

test.beforeEach(({ page }) => assertNoErrors(page));

test('Show correct budget group totals and averages', async ({ page }) => {
  await page.goto('/income');

  // Validate column sums
  await page.getByTestId('group-0-budget-0-0').fill('1000');
  await page.getByTestId('group-0-budget-1-0').fill('200');
  await page.getByTestId('group-0-budget-1-0').blur();
  await expect(page.getByTestId('group-0-month-0-total')).toContainText('€1,200');

  await page.getByTestId('group-1-budget-0-0').fill('500');
  await page.getByTestId('group-1-budget-1-0').fill('100');
  await page.getByTestId('group-1-budget-1-0').blur();
  await expect(page.getByTestId('group-1-month-0-total')).toContainText('€600');
  await expect(page.getByTestId('month-0-total')).toContainText('€1,800');
  await expect(page.getByTestId('income-amount')).toContainText('€1,800');

  await page.getByTestId('group-1-budget-1-1').fill('100');
  await page.getByTestId('group-1-budget-1-1').blur();
  await expect(page.getByTestId('month-0-total')).toContainText('€1,800');
  await expect(page.getByTestId('income-amount')).toContainText('€1,900');

  // Validate row sums and averages
  await page.getByTestId('group-0-budget-0-1').fill('500');
  await page.getByTestId('group-0-budget-0-1').blur();
  await expect(page.getByTestId('group-0-budget-0-total')).toContainText('€1,500');
  await expect(page.getByTestId('group-0-budget-0-average')).toContainText('€125');
});

test('Evaluate expressions correctly without errors', async ({ page }) => {
  await page.goto('/income');

  // Simple expressions
  await page.getByTestId('group-0-budget-0-0').fill('1000 * 2000');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('€2,000,000');

  await page.getByTestId('group-0-budget-0-0').fill('1000 + 2000');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('€3,000');

  await page.getByTestId('group-0-budget-0-0').fill('500 - 50');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('€450');

  // Support comma and dot notation
  await page.getByTestId('group-0-budget-0-0').fill('1,000 + 2.000');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('€1,002');

  // Support parentheses
  await page.getByTestId('group-0-budget-0-0').fill('(1000 + 2000) * 2');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('€6,000');

  // Do nothing if invalid
  await page.getByTestId('group-0-budget-0-0').fill('1000 + 2000 *');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('1000 + 2000 *');

  await page.getByTestId('group-0-budget-0-0').fill('');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('');

  await page.getByTestId('group-0-budget-0-0').fill('   ');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('');
});

test('Localizes numbers and parse them correctly', async ({ page }) => {
  await page.goto('/income');

  // Test for english
  await page.getByTestId('settings').click();
  await page.getByTestId('change-locale').click();
  await page.getByTestId('change-locale-en').click();
  await page.keyboard.press('Escape');

  await page.getByTestId('group-0-budget-0-0').fill('1.5 * 30,000');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('€45,000');

  // Test for german
  await page.getByTestId('settings').click();
  await page.getByTestId('change-locale').click();
  await page.getByTestId('change-locale-de').click();
  await page.keyboard.press('Escape');

  await page.getByTestId('group-0-budget-0-0').fill('1,5 * 30.000');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('45.000 €');

  // Test for italian
  await page.getByTestId('settings').click();
  await page.getByTestId('change-locale').click();
  await page.getByTestId('change-locale-it').click();
  await page.keyboard.press('Escape');

  await page.getByTestId('group-0-budget-0-0').fill('1,5 + 1,5');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('3 €');
});

test('Keep numbers correctly localized between languages', async ({ page }) => {
  await page.goto('/income');

  await page.getByTestId('settings').click();
  await page.getByTestId('change-locale').click();
  await page.getByTestId('change-locale-de').click();
  await page.keyboard.press('Escape');

  await page.getByTestId('group-0-budget-0-0').fill('1,,,,5');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('1,,,,5');

  await page.getByTestId('group-0-budget-0-0').focus();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('1,,,,5');

  await page.getByTestId('group-0-budget-0-0').fill('1,5 + 30');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('31,5 €');

  await page.getByTestId('group-0-budget-0-0').focus();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('31,5');

  await page.getByTestId('settings').click();
  await page.getByTestId('change-locale').click();
  await page.getByTestId('change-locale-en').click();
  await page.keyboard.press('Escape');

  await page.getByTestId('group-0-budget-0-0').focus();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('31.5');

  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('€31.5');
});

test('Navigate budgets using the keyboard', async ({ page }) => {
  await page.goto('/#demo');
  await page.getByTestId('navigation-income').click();

  await page.getByTestId('group-0-budget-1-0').focus();
  await page.keyboard.down('Shift');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('group-0-budget-1-1')).toBeFocused();

  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByTestId('group-0-budget-1-11')).toBeFocused();

  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(page.getByTestId('group-1-budget-2-11')).toBeFocused();
});
