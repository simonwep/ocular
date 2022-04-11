export type BudgetValues = number[];

export interface Budget {
  id: string;
  name: string;
  values: BudgetValues;
}

export interface BudgetGroup {
  id: string;
  name: string;
  budgets: Budget[];
}

export interface DataState {
  version: 1;
  title: string;
  unit: string;
  locale: string;
  startingBalance: number;
  expenses: BudgetGroup[];
  income: BudgetGroup[];
}
