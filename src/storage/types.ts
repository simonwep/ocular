import { DeepReadonly } from 'vue';

export type StorageAuthenticationState = 'idle' | 'loading' | 'authenticated' | 'syncing';

export interface StorageState {
  status: StorageAuthenticationState;
}

export interface StorageData {
  version: number;
}

export interface StorageSync<T extends StorageData> {
  name: string;
  state(): T;
  push(data: T): void;
}

export interface AppStorage {
  state: DeepReadonly<StorageState>;
  login(): void;
  sync<T extends StorageData>(config: StorageSync<T>): void;
}
