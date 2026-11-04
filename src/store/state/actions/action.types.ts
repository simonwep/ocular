import type { Budget, BudgetGroup, BudgetYear, DataState } from '@store/state/types.ts';
import type { StorageMutate } from '@store/storage/useStorage.ts';
import type { ComputedRef, DeepReadonly, Ref } from 'vue';

export type UndoFn = () => void;

export type ActionOptions = {
  state: DeepReadonly<DataState>;
  currentYear: Ref<number>;
  undoFunctions: UndoFn[];
  mutate: StorageMutate;
  budgetYear: ComputedRef<DeepReadonly<BudgetYear>>;
  budgetGroups: ComputedRef<DeepReadonly<BudgetGroup[]>>;
  getBudget: (id: string) => DeepReadonly<Budget> | undefined;
  getBudgetGroup: (id: string) => DeepReadonly<BudgetGroup> | undefined;
};
