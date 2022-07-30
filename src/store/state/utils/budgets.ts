import { DeepReadonly } from 'vue';
import { BudgetGroup } from '../types';

export const totals = (groups: DeepReadonly<BudgetGroup[]>): number[] => {
  const totals = new Array(12).fill(0);

  for (const { budgets } of groups) {
    for (const { values } of budgets) {
      for (let i = 0; i < values.length; i++) {
        totals[i] += values[i];
      }
    }
  }

  return totals;
};

export interface FlattedBudgetGroup extends BudgetGroup {
  totals: number[];
}

export const flatten = (groups: DeepReadonly<BudgetGroup[]>): FlattedBudgetGroup[] => {
  return groups.map((group) => {
    const totals = new Array(12).fill(0);

    for (const { values } of group.budgets) {
      for (let i = 0; i < values.length; i++) {
        totals[i] += values[i];
      }
    }

    return { ...group, totals } as FlattedBudgetGroup;
  });
};
