import { Ref } from 'vue';

export const ONBOARDING_STORE = Symbol('OnboardingStore');

export interface OnboardingStore {
  register(size: Ref<DOMRect>): void;
  unregister(size: Ref<DOMRect>): void;
}

export interface StepsExposed {
  reset(): void;
  next(): void;
  previous(): void;
}
