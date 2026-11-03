import { createNewUser, createNewUserAndLogin, randomUsername, useClient } from './utils/tenant.ts';
import { expect, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

test('Lock out user after too many attempts', async ({ page }) => {
  const user = await createNewUser();

  await page.goto('/');
  await page.getByTestId('navigation-cloud').click();
  await page.getByTestId('username').fill(user.name);
  await page.getByTestId('password').fill(user.password + 'wrong');

  for (let i = 0; i < 5; i++) {
    await page.getByTestId('password').press('Enter');
    await expect(page.getByTestId('login-invalid-credentials')).toBeHidden();
    await expect(page.getByTestId('login-invalid-credentials')).toBeVisible();
  }

  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('login-invalid-credentials')).toBeHidden();
  await expect(page.getByTestId('login-too-many-attempts')).toBeVisible();

  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('login-too-many-attempts')).toBeVisible();

  await page.waitForTimeout(3000);
  await expect(page.getByTestId('login-too-many-attempts')).toBeHidden();

  await page.getByTestId('password').clear();
  await page.getByTestId('password').fill(user.password);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');
});

test('Log in and retain data on log-out', async ({ page }) => {
  const user = await createNewUserAndLogin(page);

  await page.getByTestId('navigation-income').click();
  await page.getByTestId('group-0-budget-0-0').focus();
  await page.getByTestId('group-0-budget-0-0').fill('3000');
  await page.getByTestId('cell-menu-action-fill-row').click();
  await expect(page.getByTestId('income-amount')).toHaveText('€36,000');

  await page.getByTestId('navigation-expenses').click();
  await expect(page.getByTestId('expenses-amount')).toBeHidden();

  await page.getByTestId('group-1-budget-0-0').focus();
  await page.getByTestId('group-1-budget-0-0').fill('200');
  await page.getByTestId('cell-menu-action-fill-row').click();
  await page.getByTestId('group-0-budget-4-3').fill('300');
  await page.getByTestId('group-0-budget-4-3').blur();
  await expect(page.getByTestId('expenses-amount')).toHaveText('€2,700');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');

  await page.getByTestId('navigation-dashboard').click();
  await expect(page.getByTestId('ending-balance-value')).toHaveText('€33,300');

  await page.getByTestId('navigation-cloud').click();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'idle');

  await page.getByTestId('navigation-cloud').click();
  await page.getByTestId('username').fill(user.name);
  await page.getByTestId('password').fill(user.password);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');
  await expect(page.getByTestId('ending-balance-value')).toHaveText('€33,300');
});

test('Add a new user as admin and remove it', async ({ page }) => {
  const admin = await createNewUserAndLogin(page, true);

  // Create a new user
  const newUsername = randomUsername();
  const newPassword = randomUUID();
  await page.getByTestId('admin-settings').click();
  await page.getByTestId('create-user').click();
  await page.getByTestId('username').fill(newUsername);
  await page.getByTestId('password').fill(newPassword);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('password')).toBeHidden();

  await page.getByTestId('navigation-cloud').click();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'idle');

  await page.getByTestId('navigation-cloud').click();
  await page.getByTestId('username').fill(newUsername);
  await page.getByTestId('password').fill(newPassword);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');

  await page.getByTestId('navigation-cloud').click();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'idle');

  // Log back in as admin and remove the new user
  await page.getByTestId('navigation-cloud').click();
  await page.getByTestId('username').fill(admin.name);
  await page.getByTestId('password').fill(admin.password);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');

  page.on('dialog', (dialog) => dialog.accept());
  await page.getByTestId('admin-settings').click();
  await page.getByTestId('manage-user').click();
  await page.getByTestId(`remove-${newUsername}`).click();
  await expect(page.getByTestId(`remove-${newUsername}`)).toBeHidden();

  await page.keyboard.press('Escape');
  await page.getByTestId('navigation-cloud').click();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'idle');

  await page.getByTestId('navigation-cloud').click();
  await page.getByTestId('username').fill(newUsername);
  await page.getByTestId('password').fill(newPassword);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('login-invalid-credentials')).toBeVisible();
});

test('Allow retry on network error', async ({ page }) => {
  await createNewUserAndLogin(page);

  await page.getByTestId('navigation-income').click();
  await page.getByTestId('group-0-budget-0-0').focus();
  await page.getByTestId('group-0-budget-0-0').fill('3000');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'syncing');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');

  // Block api requests to simulate a network error
  await page.route('**/api/**', (route) => route.abort());
  await page.getByTestId('group-0-budget-1-0').fill('1000');
  await page.getByTestId('group-0-budget-1-0').blur();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'error');
  await expect(page.getByTestId('synchronization-error')).toBeVisible();

  // Unblock api requests
  await page.unroute('**/api/**');
  await page.getByTestId('synchronization-error-action').click();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');
});

test('Preserve unsaved edits after session expiration and save them after reauthentication', async ({
  page,
  context
}) => {
  const user = await createNewUserAndLogin(page);

  await page.getByTestId('navigation-income').click();
  await page.getByTestId('group-0-budget-0-0').focus();
  await page.getByTestId('group-0-budget-0-0').fill('1000');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'syncing');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');

  await context.clearCookies();
  await page.getByTestId('group-0-budget-0-0').focus();
  await page.getByTestId('group-0-budget-0-0').fill('3000');
  await page.getByTestId('group-0-budget-0-0').blur();

  await expect(page.getByTestId('session-expired')).toBeVisible();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'session-expired');
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('3,000');
  await expect(page.getByTestId('username')).toHaveValue(user.name);

  await page.getByTestId('password').fill(user.password);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('3,000');

  await page.reload();
  await page.getByTestId('navigation-income').click();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('3,000');
});

test('Discard expired session data instead of syncing it to a different user', async ({ page, context }) => {
  const expiredUser = await createNewUserAndLogin(page);

  await page.getByTestId('navigation-income').click();
  await page.getByTestId('group-0-budget-0-0').focus();
  await page.getByTestId('group-0-budget-0-0').fill('1000');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'syncing');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');

  const otherUser = await createNewUser();
  await page.getByTestId('navigation-cloud').click();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'idle');
  await page.getByTestId('navigation-cloud').click();
  await page.getByTestId('username').fill(otherUser.name);
  await page.getByTestId('password').fill(otherUser.password);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');

  await page.getByTestId('navigation-income').click();
  await page.getByTestId('group-0-budget-0-0').focus();
  await page.getByTestId('group-0-budget-0-0').fill('2000');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'syncing');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');

  await page.getByTestId('navigation-cloud').click();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'idle');
  await page.getByTestId('navigation-cloud').click();
  await page.getByTestId('username').fill(expiredUser.name);
  await page.getByTestId('password').fill(expiredUser.password);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');

  await page.getByTestId('navigation-income').click();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('1,000');

  await context.clearCookies();
  await page.getByTestId('group-0-budget-0-0').focus();
  await page.getByTestId('group-0-budget-0-0').fill('3000');
  await page.getByTestId('group-0-budget-0-0').blur();
  await expect(page.getByTestId('session-expired')).toBeVisible();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'session-expired');

  await page.getByTestId('username').fill(otherUser.name);
  await page.getByTestId('password').fill(otherUser.password);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');

  await page.getByTestId('navigation-income').click();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('2,000');

  await page.reload();
  await page.getByTestId('navigation-income').click();
  await expect(page.getByTestId('group-0-budget-0-0')).toHaveValue('2,000');
});

test('Add a new user and make it admin', async ({ page }) => {
  const admin = await createNewUserAndLogin(page, true);

  // Create new user
  const newUsername = randomUsername();
  const newPassword = randomUUID();
  await page.getByTestId('admin-settings').click();
  await page.getByTestId('create-user').click();
  await page.getByTestId('username').fill(newUsername);
  await page.getByTestId('password').fill(newPassword);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('password')).toBeHidden();

  await page.getByTestId('navigation-cloud').click();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'idle');

  // Log in with new user
  await page.getByTestId('navigation-cloud').click();
  await page.getByTestId('username').fill(newUsername);
  await page.getByTestId('password').fill(newPassword);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');
  await expect(page.getByTestId('admin-settings')).toBeHidden();

  await page.getByTestId('navigation-cloud').click();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'idle');

  await page.getByTestId('navigation-cloud').click();
  await page.getByTestId('username').fill(admin.name);
  await page.getByTestId('password').fill(admin.password);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');

  // Make the new user admin
  await page.getByTestId('admin-settings').click();
  await page.getByTestId('manage-user').click();
  await page.getByTestId(`toggle-admin-${newUsername}`).click();
  await page.keyboard.press('Escape');

  await page.getByTestId('navigation-cloud').click();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'idle');

  await page.getByTestId('navigation-cloud').click();
  await page.getByTestId('username').fill(newUsername);
  await page.getByTestId('password').fill(newPassword);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('admin-settings')).toBeVisible();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');
});

test('Add a new admin and create new users through it', async ({ page }) => {
  await createNewUserAndLogin(page, true);

  // Create new users
  const newUsername = randomUsername();
  const newPassword = randomUUID();
  await page.getByTestId('admin-settings').click();
  await page.getByTestId('create-user').click();
  await page.getByTestId('username').fill(newUsername);
  await page.getByTestId('password').fill(newPassword);
  await page.getByTestId('admin').check();
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('password')).toBeHidden();

  await page.getByTestId('navigation-cloud').click();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'idle');

  // Log in with new admin user
  await page.getByTestId('navigation-cloud').click();
  await page.getByTestId('username').fill(newUsername);
  await page.getByTestId('password').fill(newPassword);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');

  // Create another admin user
  const newUsername2 = randomUsername();
  const newPassword2 = randomUUID();
  await page.getByTestId('admin-settings').click();
  await page.getByTestId('create-user').click();
  await page.getByTestId('username').fill(newUsername2);
  await page.getByTestId('password').fill(newPassword2);
  await page.getByTestId('password').press('Enter');
  await page.getByTestId('navigation-cloud').click();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'idle');

  await page.getByTestId('navigation-cloud').click();
  await page.getByTestId('username').fill(newUsername2);
  await page.getByTestId('password').fill(newPassword2);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('admin-settings')).toBeHidden();
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');
});

test('Hide demo button if logged in', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('load-demo-data-placeholder')).toBeVisible();

  await page.getByTestId('navigation-tools-menu').click();
  await expect(page.getByTestId('load-demo-data')).toBeVisible();

  await createNewUserAndLogin(page);
  await expect(page.getByTestId('load-demo-data-placeholder')).toBeHidden();

  await page.getByTestId('navigation-tools-menu').click();
  await expect(page.getByTestId('load-demo-data')).toBeHidden();
});

test('Force user to update app if data is ahead of client', async ({ page }) => {
  const user = await createNewUserAndLogin(page);
  const client = await useClient({ user: user.name, password: user.password });

  await page.getByTestId('navigation-income').click();
  await page.getByTestId('group-0-budget-0-0').focus();
  await page.getByTestId('group-0-budget-0-0').fill('3000');
  await page.getByTestId('cell-menu-action-fill-row').click();
  await expect(page.getByTestId('income-amount')).toHaveText('€36,000');

  await page.getByTestId('navigation-dashboard').click();
  await expect(page.getByTestId('ending-balance-value')).toHaveText('€36,000');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');

  // Simulate data being ahead of client by updating the version in the database
  const { data: currentData } = await client.getDataByKey('data');
  await client.setDataByKey('data', { version: 100 });

  await page.reload();
  await expect(page.getByTestId('push-failed')).toBeVisible();
  await expect(page.getByTestId('income-value')).toHaveText('€0');

  // Verify no data has been corrupted and user can retry
  await client.setDataByKey('data', currentData);
  await page.reload();
  await expect(page.getByTestId('push-failed')).toBeHidden();

  await page.getByTestId('navigation-cloud').click();
  await page.getByTestId('username').fill(user.name);
  await page.getByTestId('password').fill(user.password);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('ending-balance-value')).toHaveText('€36,000');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');
});
