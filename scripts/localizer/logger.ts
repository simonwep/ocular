/* eslint-disable no-console */

const newLogger = (name: string) => ({
  info: (msg: string) => console.log(`${name} ${msg}`),
  warn: (msg: string) => console.warn(`${name} ${msg}`),
  error: (msg: string) => console.error(`${name} ${msg}`)
});

export const createLogger = (scope: string) => newLogger(`[localizer:${scope}]`);

export const logger = newLogger('[localizer]');
