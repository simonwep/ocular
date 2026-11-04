import type { GenesisJsonPatchOperation } from '@store/genesis/genesis.sdk.ts';
import type { Budget, BudgetGroup, DataState } from '@store/state/types.ts';
import type { DeepReadonly } from 'vue';

export type BudgetGroupLocation = {
  group: DeepReadonly<BudgetGroup>;
  groups: DeepReadonly<BudgetGroup[]>;
  groupIndex: number;
  groupPath: string;
  yearIndex: number;
  path: string;
};

export type BudgetLocation = BudgetGroupLocation & {
  budget: DeepReadonly<Budget>;
  budgetIndex: number;
  budgetPath: string;
};

export const findBudgetGroupLocation = (
  state: DeepReadonly<DataState>,
  year: number,
  id: string
): BudgetGroupLocation | undefined => {
  const yearIndex = state.years.findIndex((v) => v.year === year);
  const data = state.years[yearIndex];
  if (!data) return;

  for (const key of ['expenses', 'income'] as const) {
    const groups = data[key];
    const index = groups.findIndex((v) => v.id === id);

    if (index !== -1) {
      return {
        group: groups[index],
        groups,
        yearIndex,
        groupIndex: index,
        groupPath: `/years/${yearIndex}/${key}`,
        path: `/years/${yearIndex}/${key}/${index}`
      };
    }
  }
};

export const findBudgetLocation = (
  state: DeepReadonly<DataState>,
  year: number,
  id: string
): BudgetLocation | undefined => {
  const yearIndex = state.years.findIndex((v) => v.year === year);
  const data = state.years[yearIndex];
  if (!data) return;

  for (const key of ['expenses', 'income'] as const) {
    const groups = data[key];
    const groupIndex = groups.findIndex((v) => v.budgets.some((budget) => budget.id === id));

    if (groupIndex !== -1) {
      const group = groups[groupIndex];
      const budgetIndex = group.budgets.findIndex((budget) => budget.id === id);
      const path = `/years/${yearIndex}/${key}/${groupIndex}`;

      return {
        group,
        groups,
        yearIndex,
        groupIndex,
        groupPath: `/years/${yearIndex}/${key}`,
        path,
        budget: group.budgets[budgetIndex],
        budgetIndex,
        budgetPath: `${path}/budgets/${budgetIndex}`
      };
    }
  }
};

export const moveOperation = (
  fromGroupPath: string,
  fromIndex: number,
  targetGroupPath: string,
  targetIndex: number,
  after = false
): GenesisJsonPatchOperation => {
  const index = targetIndex - (fromGroupPath === targetGroupPath && fromIndex < targetIndex ? 1 : 0) + (after ? 1 : 0);

  return {
    op: 'move',
    from: `${fromGroupPath}/${fromIndex}`,
    path: `${targetGroupPath}/${index}`
  };
};
