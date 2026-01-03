import { Budget, BudgetGroup, BudgetYear } from '../types';
import { uuid } from '@utils/uuid/uuid.ts';
import { DeepReadonly } from 'vue';

export const generateBudget = (name: string, values = new Array(12).fill(0)): Budget => ({
  name,
  values,
  id: uuid()
});

export const generateBudgetGroup = (name: string, budgets: string[]): BudgetGroup => ({
  name,
  id: uuid(),
  budgets: budgets.map((name) => generateBudget(name))
});

export type GenerateBudgetYearOptions = {
  year: number;
  source?: DeepReadonly<BudgetYear>;
  includeValues?: boolean;
  incomeGroups?: string[];
  expenseGroups?: string[];
};

export const generateBudgetYear = (options: GenerateBudgetYearOptions): BudgetYear => {
  const clearValues = (value: DeepReadonly<BudgetGroup>): BudgetGroup => ({
    id: uuid(),
    name: value.name,
    budgets: value.budgets.map((budget) =>
      options.includeValues ? generateBudget(budget.name, [...budget.values]) : generateBudget(budget.name)
    )
  });

  return {
    year: options.year,
    income:
      options.source?.income
        .filter((v) => !options.incomeGroups || options.incomeGroups.includes(v.id))
        .map(clearValues) ?? [],
    expenses:
      options.source?.expenses
        .filter((v) => !options.expenseGroups || options.expenseGroups.includes(v.id))
        .map(clearValues) ?? []
  };
};
