import { reactive } from 'vue';

export interface DraggableStore {
  group?: string;
  source?: string;
  target?: string;
  type?: string;
}

export const store = reactive<DraggableStore>({
  group: undefined,
  source: undefined,
  target: undefined,
  type: undefined
});
