export type BudgetValues = number[];

export interface Budget {
    name: string;
    values: BudgetValues;
}

export interface BudgetGroup {
    name: string;
    budgets: Budget[];
}

export interface State {
    version: 1;
    title: string;
    unit: string;
    startingBalance: number;
    expenses: BudgetGroup[];
    income: BudgetGroup[];
}
