export type BudgetValues = number[];
export type Theme = 'light' | 'dark';

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

export type BudgetGroups = BudgetGroup[];

export interface State {
    version: 1;
    theme: Theme;
    title: string;
    unit: string;
    locale: string;
    startingBalance: number;
    expenses: BudgetGroups;
    income: BudgetGroups;
}
