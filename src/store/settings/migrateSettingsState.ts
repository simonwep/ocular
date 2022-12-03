import { createMigration } from '@utils';
import { SettingsStateV1, SettingsStateV2 } from './types';

export const migrateSettingsState = createMigration('settings', [
  {
    from: 1,
    to: 2,
    migrate: (from: SettingsStateV1): SettingsStateV2 => ({
      ...from,
      version: 2,
      appearance: {
        ...from.appearance,
        mode: 'normal'
      }
    })
  }
]);
