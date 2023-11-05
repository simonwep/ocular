import { MigratableState } from 'yuppee';

export type StorageAuthenticationState = 'idle' | 'loading' | 'authenticated' | 'syncing';

export interface StorageSync<T extends MigratableState, P extends MigratableState = T> {
  name: string;
  state(): T;
  clear(): void;
  push(data: P): void;
}
