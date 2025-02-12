import { initialLocale } from '@i18n/index';
import { generateTemplate } from '@store/state/template';
import { DataState, DataStateV1, DataStateV2, DataStateV3 } from '@store/state/types';
import { createMigration, createMigrator } from 'yuppee';

type Versions = DataStateV1 | DataStateV2 | DataStateV3;

export const migrateApplicationState = createMigrator<DataState, Versions>({
  init: () => generateTemplate(),
  migrations: [
    createMigration<DataStateV1, DataStateV2>({
      from: 1,
      to: 2,
      migrate: (from) => ({
        years: [
          {
            year: new Date().getFullYear(),
            expenses: from.expenses,
            income: from.income
          }
        ]
      })
    }),
    createMigration<DataStateV2, DataStateV3>({
      from: 2,
      to: 3,
      migrate: (from) => ({
        locale: initialLocale,
        currency: 'GBP',
        years: from.years
      })
    })
  ]
});
