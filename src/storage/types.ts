import { DeepReadonly } from '@vue/reactivity';

export type StorageAuthenticationState = 'idle' | 'loading' | 'authenticated';

export interface StorageState {
  status: StorageAuthenticationState;
}

export interface StorageSync<T> {
  name: string;
  state(): T;
  push(data: T): void;
}

export interface AppStorage {
  state: DeepReadonly<StorageState>;
  login(): void;
  sync<T>(config: StorageSync<T>): void;
}
