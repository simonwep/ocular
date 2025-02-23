import { BudgetGroup, BudgetYear } from '../types';
import { sum } from '@utils';
import { DeepReadonly } from 'vue';

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

export const sumOfBudgetGroups = (groups: DeepReadonly<BudgetGroup[]>): number => {
  return sum(groups.flatMap((v) => v.budgets.flatMap((v) => v.values)));
};

export const finalBalance = ({ income, expenses }: BudgetYear) => {
  return sumOfBudgetGroups(income) - sumOfBudgetGroups(expenses);
};
