import { createClient, type GenesisLoginBody } from '@store/genesis/genesis.sdk.ts';
import { expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import type { Page } from '@playwright/test';

export const randomUsername = () => `e2e_${Math.random().toString(36).slice(-6)}`;

export const useClient = async (login: GenesisLoginBody) => {
  const client = createClient({ baseUrl: 'http://localhost:8080' });
  await client.login(login);

  return client;
};

export const useAdminUser = () => useClient({ user: 'admin', password: 'hgEiPCZP' });

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
