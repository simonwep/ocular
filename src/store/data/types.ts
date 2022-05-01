import { StorageData } from '@storage/types';

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

export interface DataState extends StorageData {
  expenses: BudgetGroup[];
  income: BudgetGroup[];
}
