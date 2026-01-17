import { createClient } from '@store/genesis/genesis.sdk.ts';
import { Page, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';

export const randomUsername = () => `e2e_${Math.random().toString(36).slice(-6)}`;

export const useAdminUser = async () => {
  const client = createClient({ baseUrl: 'http://localhost:8080' });
  await client.login({ user: 'admin', password: 'hgEiPCZP' });

  return client;
};

export const createNewUser = async (isAdmin = false) => {
  const client = await useAdminUser();
  const name = randomUsername();
  const password = randomUUID();

  await client.createUser({ name, password, admin: isAdmin });
  await client.login({ user: name, password });

  return { name, password };
};

export const createNewUserAndLogin = async (page: Page, isAdmin = false) => {
  const user = await createNewUser(isAdmin);

  await page.goto('/');
  await page.getByTestId('navigation-cloud').click();
  await page.getByTestId('username').fill(user.name);
  await page.getByTestId('password').fill(user.password);
  await page.getByTestId('password').press('Enter');
  await expect(page.getByTestId('navigation-cloud')).toHaveAttribute('data-status', 'authenticated');

  return user;
};
