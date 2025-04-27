import { Page } from '@playwright/test';

// Service worker are blocked during testing, so we need to ignore them
const IGNORE_REGEX = /playwright|service-worker/i;

export const assertNoErrors = (page: Page) => {
  page.on('console', (msg) => {
    const text = msg.text();

    if (IGNORE_REGEX.test(text)) {
      return;
    }

    if (msg.type() === 'error') {
      throw new Error(`Console error: ${text}`);
    } else if (msg.type() === 'warning') {
      throw new Error(`Console warning: ${text}`);
    }
  });
};
