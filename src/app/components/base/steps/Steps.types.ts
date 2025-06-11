import { Ref } from 'vue';

export const STEPS_STORE = Symbol('Steps Store');

export interface StepsStore {
  register(size: Ref<DOMRect>): void;
  unregister(size: Ref<DOMRect>): void;
}

export interface StepsExposed {
  reset(): void;
  next(): void;
  previous(): void;
}
