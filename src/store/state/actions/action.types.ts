import { Budget, BudgetGroup, BudgetYear, DataState } from '@store/state/types.ts';
import { ComputedRef, Ref } from 'vue';

export type UndoFn = () => void;

export type ActionOptions = {
  state: DataState;
  currentYear: Ref<number>;
  undoFunctions: UndoFn[];
  budgetYear: ComputedRef<BudgetYear>;
  budgetGroups: ComputedRef<BudgetGroup[]>;
  getBudget: (id: string) => Budget | undefined;
  getBudgetGroup: (id: string) => BudgetGroup | undefined;
};
