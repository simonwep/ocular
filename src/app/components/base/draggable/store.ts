import { reactive } from 'vue';
import { DraggableEvent } from './types';

export const store = reactive<Partial<DraggableEvent>>({
  source: undefined,
  target: undefined,
  type: undefined
});
