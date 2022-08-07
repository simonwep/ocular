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

export interface BudgetYear {
  year: number;
  expenses: BudgetGroup[];
  income: BudgetGroup[];
}

export interface DataStateV2 extends StorageData {
  version: 2;
  years: BudgetYear[];
}

export interface DataStateV1 extends StorageData {
  version: 1;
  expenses: BudgetGroup[];
  income: BudgetGroup[];
}

// Latest structure
export type DataState = DataStateV2;
