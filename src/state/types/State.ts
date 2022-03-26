export type BudgetValues = number[];

export interface Budget {
    name: string;
    values: BudgetValues;
}

export interface BudgetGroup {
    name: string;
    budgets: Budget[];
}

export type BudgetGroups = BudgetGroup[];

export interface State {
    version: 1;
    title: string;
    unit: string;
    locale: string;
    startingBalance: number;
    expenses: BudgetGroups;
    income: BudgetGroups;
}
