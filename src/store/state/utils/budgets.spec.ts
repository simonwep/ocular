import { totals, flatten, sumOfBudgetGroups, finalBalance } from './budgets';
import { BudgetGroup, BudgetYear } from '../types';
import { it, expect } from 'vitest';

const budgetGroups: BudgetGroup[] = [
  {
    id: '1',
    name: 'Group 1',
    budgets: [
      { id: '1', name: 'Budget 1', values: [100, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 300] },
      { id: '2', name: 'Budget 2', values: [400, 0, 600, 0, 0, 0, 0, 500, 0, 0, 0, 0] }
    ]
  },
  {
    id: '2',
    name: 'Group 2',
    budgets: [
      { id: '3', name: 'Budget 3', values: [700, 800, 0, 0, 0, 0, 0, 0, 0, 900, 0, 0] },
      { id: '4', name: 'Budget 4', values: [1000, 1100, 0, 0, 0, 0, 1200, 0, 0, 0, 0, 0] }
    ]
  }
];

it('calculate totals', () => {
  expect(totals(budgetGroups)).toEqual([2200, 2100, 600, 0, 0, 0, 1200, 500, 0, 900, 0, 300]);
});

it('flatten budget groups', () => {
  const flattened = flatten(budgetGroups);
  expect(flattened).toHaveLength(2);
  expect(flattened[0].totals).toEqual([500, 200, 600, 0, 0, 0, 0, 500, 0, 0, 0, 300]);
  expect(flattened[1].totals).toEqual([1700, 1900, 0, 0, 0, 0, 1200, 0, 0, 900, 0, 0]);
});

it('calculate sum of budget groups', () => {
  expect(sumOfBudgetGroups(budgetGroups)).toBe(7800);
});

it('calculate final balance', () => {
  const budgetYear: BudgetYear = {
    year: 2023,
    income: budgetGroups,
    expenses: [
      {
        id: '3',
        name: 'Group 3',
        budgets: [
          { id: '5', name: 'Budget 5', values: [500, 600, 700, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
          { id: '6', name: 'Budget 6', values: [800, 900, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
        ]
      }
    ]
  };

  expect(finalBalance(budgetYear)).toBe(3300);
});
