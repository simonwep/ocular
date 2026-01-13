import { createClient } from '@store/genesis/genesis.sdk.ts';
import { expect, Page, test } from '@playwright/test';
import { randomUUID } from 'node:crypto';

const randomUsername = () => `e2e_${Math.random().toString(36).slice(-6)}`;

const useAdminUser = async () => {
  const client = createClient({ baseUrl: 'http://localhost:8080' });
  await client.login({ user: 'admin', password: 'hgEiPCZP' });

  return client;
};

const createNewUser = async (isAdmin = false) => {
  const client = await useAdminUser();
  const name = randomUsername();
  const password = randomUUID();

  await client.createUser({ name, password, admin: isAdmin });
  await client.login({ user: name, password });

  return { name, password };
};

const createNewUserAndLogin = async (page: Page, isAdmin = false) => {
  const user = await createNewUser(isAdmin);

  await page.goto('/');
  await page.getByTestId('navigation-cloud').click();
  await page.getByTestId('username').fill(user.name);
  await page.getByTestId('password').fill(user.password);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');

  return user;
};

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
  await expect(page.getByTestId('login-failed')).toBeVisible();
});
