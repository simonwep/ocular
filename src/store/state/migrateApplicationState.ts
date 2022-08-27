import { createMigration } from '@utils';
import { DataStateV1, DataStateV2, DataStateV3 } from '@store/state/types';
import { initialLocale } from '@i18n/index';

export const migrateApplicationState = createMigration('state', [
  {
    from: 1,
    to: 2,
    migrate: (from: DataStateV1): DataStateV2 => ({
      version: 2,
      years: [
        {
          year: new Date().getFullYear(),
          expenses: from.expenses,
          income: from.income
        }
      ]
    })
  },
  {
    from: 2,
    to: 3,
    migrate: (from: DataStateV2): DataStateV3 => ({
      version: 3,
      locale: initialLocale,
      currency: 'gbp',
      years: from.years
    })
  }
]);
