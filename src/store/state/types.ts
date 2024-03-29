import { MigratableState } from 'yuppee';
import { AvailableLocale } from '@i18n/index';

export type BudgetValues = number[];

export const availableCurrencies = ['gbp', 'eur', 'usd'];

export type AvailableCurrency = 'gbp' | 'eur' | 'usd';

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

export interface DataStateV3 extends MigratableState<3> {
  years: BudgetYear[];
  locale: AvailableLocale;
  currency: AvailableCurrency;
}

// Latest structure
export type DataStates = DataStateV1 | DataStateV2 | DataStateV3;
export type DataState = DataStateV3;
