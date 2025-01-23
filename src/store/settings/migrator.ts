import { createMigration, createMigrator } from 'yuppee';
import { SettingsStateV1, SettingsStateV2, SettingsStateV3 } from './types';

type Versions = SettingsStateV1 | SettingsStateV2 | SettingsStateV3;

export const migrateSettingsState = createMigrator<SettingsStateV3, Versions>({
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
    }),
    createMigration<SettingsStateV2, SettingsStateV3>({
      from: 2,
      to: 3,
      migrate: (from) => ({
        ...from,
        version: 3,
        general: {
          monthOffset: 0
        }
      })
    })
  ]
});
