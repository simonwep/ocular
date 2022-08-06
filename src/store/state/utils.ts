import { Budget, BudgetGroup, BudgetYear } from './types';
import { uuid } from '@utils';

export const generateBudget = (name: string): Budget => ({
  name,
  id: uuid(),
  values: new Array(12).fill(0)
});

export const generateBudgetGroup = (name: string, budgets: string[]): BudgetGroup => ({
  name,
  id: uuid(),
  budgets: budgets.map(generateBudget)
});

export const generateBudgetYear = (year: number): BudgetYear => ({
  year,
  income: [generateBudgetGroup('General', ['Other'])],
  expenses: [generateBudgetGroup('General', ['Other'])]
});
