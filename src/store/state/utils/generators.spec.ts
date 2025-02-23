import { generateBudget, generateBudgetGroup, generateBudgetYearFromCurrent } from './generators.ts';
import { BudgetYear } from '../types';
import { it, expect } from 'vitest';

it('generate a budget', () => {
  const budget = generateBudget('Test Budget');
  expect(budget.name).toBe('Test Budget');
  expect(budget.id).toBeDefined();
  expect(budget.values).toHaveLength(12);
  expect(budget.values.every((value) => value === 0)).toBe(true);
});

it('generate a budget group', () => {
  const budgetGroup = generateBudgetGroup('Test Group', ['Budget 1', 'Budget 2']);
  expect(budgetGroup.name).toBe('Test Group');
  expect(budgetGroup.id).toBeDefined();
  expect(budgetGroup.budgets).toHaveLength(2);
  expect(budgetGroup.budgets[0].name).toBe('Budget 1');
  expect(budgetGroup.budgets[1].name).toBe('Budget 2');
});

it('generate a budget year from current', () => {
  const current: BudgetYear = {
    year: 2023,
    income: [
      {
        id: '1',
        name: 'Income Group',
        budgets: [{ id: '1', name: 'Income Budget', values: [100, 200, 300] }]
      }
    ],
    expenses: [
      {
        id: '2',
        name: 'Expense Group',
        budgets: [{ id: '2', name: 'Expense Budget', values: [400, 500, 600] }]
      }
    ]
  };

  const newYear = generateBudgetYearFromCurrent(2024, current);

  expect(newYear.year).toBe(2024);
  expect(newYear.income).toHaveLength(1);
  expect(newYear.expenses).toHaveLength(1);
  expect(newYear.income[0].name).toBe('Income Group');
  expect(newYear.expenses[0].name).toBe('Expense Group');
  expect(newYear.income[0].budgets[0].name).toBe('Income Budget');
  expect(newYear.expenses[0].budgets[0].name).toBe('Expense Budget');
  expect(newYear.income[0].budgets[0].values.every((value) => value === 0)).toBe(true);
  expect(newYear.expenses[0].budgets[0].values.every((value) => value === 0)).toBe(true);
});
