import type { DataState } from '@store/state/types.ts';
import type { StorageMutate } from '@store/storage/useStorage.ts';
import type { DeepReadonly, Ref } from 'vue';

export type UndoFn = () => void;

export type ActionOptions = {
  state: DeepReadonly<DataState>;
  year: Ref<number>;
  stack: UndoFn[];
  mutate: StorageMutate;
};
