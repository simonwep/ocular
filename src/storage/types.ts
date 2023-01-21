import { DeepReadonly } from 'vue';
import { MigratableState } from 'yuppee';

export type StorageAuthenticationState = 'idle' | 'loading' | 'authenticated' | 'syncing';

export interface StorageState {
  status: StorageAuthenticationState;
}

export interface StorageSync<T extends MigratableState, P extends MigratableState = T> {
  name: string;
  state(): T;
  push(data: P): void;
}

export interface AppStorage {
  state: DeepReadonly<StorageState>;
  login(): void;
  sync<T extends MigratableState, P extends MigratableState = T>(config: StorageSync<T, P>): void;
}
