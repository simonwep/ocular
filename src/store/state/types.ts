import { AvailableLocale } from '@i18n/index';
import { MigratableState } from 'yuppee';

export type BudgetValues = number[];

export const availableCurrencies = [
  'USD',
  'EUR',
  'JPY',
  'GBP',
  'CZK',
  'AUD',
  'CAD',
  'CHF',
  'CNY',
  'DKK',
  'SEK',
  'NZD',
  'MXN',
  'SGD',
  'HKD',
  'NOK',
  'KRW',
  'TRY',
  'INR',
  'RUB',
  'BRL',
  'ZAR',
  'HUF',
  'PLN',
  'CRC',
  'IDR'
];

export type AvailableCurrency =
  | 'USD'
  | 'EUR'
  | 'JPY'
  | 'GBP'
  | 'CZK'
  | 'AUD'
  | 'CAD'
  | 'CHF'
  | 'CNY'
  | 'DKK'
  | 'SEK'
  | 'NZD'
  | 'MXN'
  | 'SGD'
  | 'HKD'
  | 'NOK'
  | 'KRW'
  | 'TRY'
  | 'INR'
  | 'RUB'
  | 'BRL'
  | 'ZAR'
  | 'HUF'
  | 'PLN'
  | 'CRC'
  | 'IDR';

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
