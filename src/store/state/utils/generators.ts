import { Budget, BudgetGroup, BudgetYear } from '../types';
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

export const generateBudgetYearFromCurrent = (year: number, current: BudgetYear): BudgetYear => {
  const clearValues = (value: BudgetGroup): BudgetGroup => ({
    id: uuid(),
    name: value.name,
    budgets: value.budgets.map((budget) => generateBudget(budget.name))
  });

  return {
    year,
    income: current.income.map(clearValues),
    expenses: current.expenses.map(clearValues)
  };
};
