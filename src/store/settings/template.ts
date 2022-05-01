import { SettingsState } from '@store/settings/types';

const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const generateTemplate = (): SettingsState => ({
  version: 1,
  appearance: {
    theme: dark ? 'dark' : 'light',
    animations: !reducedMotion
  }
});
