import { SettingsState, SettingsStateV1, SettingsStateV2 } from './types';
import { createMigration, createMigrator } from 'yuppee';

type Versions = SettingsStateV1 | SettingsStateV2;

export const migrateSettingsState = createMigrator<SettingsState, Versions>({
  init: () => {
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return {
      appearance: {
        theme: dark ? 'dark' : 'light',
        animations: !reducedMotion
      }
    };
  },
  migrations: [
    createMigration<SettingsStateV1, SettingsStateV2>({
      from: 1,
      to: 2,
      migrate: (from) => ({
        ...from,
        version: 2,
        appearance: {
          ...from.appearance,
          mode: 'normal'
        }
      })
    })
  ]
});
