import { assertNoErrors } from './utils/assertNoErrors.ts';
import { expect, test } from '@playwright/test';

test.beforeEach(({ page }) => assertNoErrors(page));

test('Show snowflakes during december', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'no-preference' });
  const page = await context.newPage();

  await page.setViewportSize({ width: 3840, height: 2160 });

  await page.goto('/');
  await page.clock.setFixedTime(new Date('2023-12-15'));
  await expect(page.getByTestId('snow-flakes')).toBeVisible();

  await page.clock.setFixedTime(new Date('2023-11-15'));
  await page.reload();
  await expect(page.getByTestId('snow-flakes')).toBeHidden();
});

test.describe('Template data should be translated', () => {
  const tests = [
    { locale: 'en-US', wages: 'Wages' },
    { locale: 'de-DE', wages: 'Gehälter' }
  ];

  for (const data of tests) {
    test(`Load template data in ${data.locale}`, async ({ browser }) => {
      const context = await browser.newContext({ locale: data.locale });
      const page = await context.newPage();

      await page.goto('/');
      await page.getByTestId('view-summary').click();
      await expect(page.getByTestId('income-group-0')).toHaveText(data.wages);
    });
  }
});
