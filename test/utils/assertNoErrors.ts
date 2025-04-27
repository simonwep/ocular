import { Page } from '@playwright/test';

export const assertNoErrors = (page: Page) => {
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      throw new Error(`Console error: ${msg.text()}`);
    } else if (msg.type() === 'warning') {
      throw new Error(`Console warning: ${msg.text()}`);
    }
  });
};
