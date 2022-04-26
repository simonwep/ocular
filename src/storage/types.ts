import { Ref } from 'vue';

export type StorageAuthenticationState = 'idle' | 'loading' | 'authenticated';

export interface StorageSync<T> {
  name: string;
  state(): T;
  push(data: T): void;
}

export interface AppStorage {
  state: Ref<StorageAuthenticationState>;
  login(): void;
  sync<T>(config: StorageSync<T>): void;
}
