import { Ref } from 'vue';
import { MigratableState } from 'yuppee';

export type StorageAuthenticationState = 'idle' | 'loading' | 'authenticated' | 'syncing';

export interface StorageSync<T extends MigratableState, P extends MigratableState = T> {
  name: string;
  state(): T;
  clear(): void;
  push(data: P): void;
}

export interface AppStorage {
  status: Readonly<Ref<StorageAuthenticationState>>;
  login(username: string, password: string): Promise<boolean>;
  logout(): void;
  sync<T extends MigratableState, P extends MigratableState = T>(config: StorageSync<T, P>): void;
}
