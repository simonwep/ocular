import { generateBudget, generateBudgetGroup, generateBudgetYear } from './generators.ts';
import { uuid } from '@utils/uuid.ts';
import { it, expect } from 'vitest';

it('should generate a budget', () => {
  const budget = generateBudget('Test Budget');
  expect(budget.name).toBe('Test Budget');
  expect(budget.id).toBeDefined();
  expect(budget.values).toHaveLength(12);
  expect(budget.values.every((value) => value === 0)).toBe(true);
});

it('should generate a budget group', () => {
  const budgetGroup = generateBudgetGroup('Test Group', ['Budget 1', 'Budget 2']);
  expect(budgetGroup.name).toBe('Test Group');
  expect(budgetGroup.id).toBeDefined();
  expect(budgetGroup.budgets).toHaveLength(2);
  expect(budgetGroup.budgets[0].name).toBe('Budget 1');
  expect(budgetGroup.budgets[1].name).toBe('Budget 2');
});

it('should generate a budget year and preserve values when includeValues is true', () => {
  const source = {
    year: 2020,
    income: [
      {
        id: uuid(),
        name: 'Income 1',
        budgets: [{ id: uuid(), name: 'Salary', values: Array.from({ length: 12 }, (_, i) => i + 1) }]
      }
    ],
    expenses: [
      {
        id: uuid(),
        name: 'Expenses 1',
        budgets: [{ id: uuid(), name: 'Rent', values: new Array(12).fill(100) }]
      }
    ]
  };

  const generated = generateBudgetYear({ year: 2021, source, includeValues: true });

  expect(generated.year).toBe(2021);
  expect(generated.income).toHaveLength(1);
  expect(generated.income[0].id).not.toBe(source.income[0].id);
  expect(generated.income[0].name).toBe(source.income[0].name);
  expect(generated.income[0].budgets[0].name).toBe('Salary');
  expect(generated.income[0].budgets[0].values).toEqual(source.income[0].budgets[0].values);
  expect(generated.income[0].budgets[0].values).not.toBe(source.income[0].budgets[0].values);
});

it('should clear values when includeValues is false', () => {
  const source = {
    year: 2020,
    income: [
      {
        id: uuid(),
        name: 'Income 2',
        budgets: [{ id: uuid(), name: 'Other', values: Array.from({ length: 12 }, () => 42) }]
      }
    ],
    expenses: []
  };

  const generated = generateBudgetYear({ year: 2022, source, includeValues: false });

  expect(generated.income[0].budgets[0].values).toHaveLength(12);
  expect(generated.income[0].budgets[0].values.every((v) => v === 0)).toBe(true);
});

it('should filter income and expense groups by provided ids', () => {
  const secondIncomeId = uuid();
  const source = {
    year: 2020,
    income: [
      { id: uuid(), name: 'A', budgets: [{ id: uuid(), name: 'A1', values: new Array(12).fill(1) }] },
      { id: secondIncomeId, name: 'B', budgets: [{ id: uuid(), name: 'B1', values: new Array(12).fill(2) }] }
    ],
    expenses: [{ id: uuid(), name: 'EA', budgets: [{ id: uuid(), name: 'EA1', values: new Array(12).fill(3) }] }]
  };

  const generated = generateBudgetYear({
    year: 2023,
    source,
    includeValues: true,
    incomeGroups: [secondIncomeId],
    expenseGroups: []
  });

  expect(generated.income).toHaveLength(1);
  expect(generated.income[0].name).toBe('B');
  expect(generated.expenses).toHaveLength(0);
});
