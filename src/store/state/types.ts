import { MigratableState } from '@utils';

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

export interface DataStateV1 extends MigratableState<1> {
  expenses: BudgetGroup[];
  income: BudgetGroup[];
}

export interface DataStateV2 extends MigratableState<2> {
  years: BudgetYear[];
}

// Latest structure
export type DataStates = DataStateV1 | DataStateV2;
export type DataState = DataStateV2;
