import { createMigration } from '@utils';
import { DataStateV1, DataStateV2 } from '@store/state/types';

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
  }
]);
