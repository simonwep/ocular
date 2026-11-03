import { createClient } from '@store/genesis/genesis.sdk.ts';
import { debounce } from '@utils/debounce/debounce.ts';
import { createGlobalState, watchImmediate } from '@vueuse/core';
import { computed, nextTick, readonly, ref, shallowReactive, shallowRef, watch } from 'vue';
import type { GenesisUser } from '@store/genesis/genesis.sdk.ts';
import type { MigratableState } from 'yuppee';

const { OCULAR_GENESIS_HOST } = import.meta.env;

export type Storage = ReturnType<typeof useStorage>;

export type StorageAuthenticationState =
  'idle' | 'authenticated' | 'syncing' | 'error' | 'retrying' | 'push-failed' | 'session-expired';

export type StorageSync<T extends MigratableState, P extends MigratableState = T> = {
  name: string;
  state(): T;
  clear(): void;
  push(data: P): void;
};

export const useStorage = createGlobalState(() => {
  const authenticatedUser = shallowRef<GenesisUser | undefined>();
  const syncsFailed = shallowReactive<Set<() => Promise<void>>>(new Set());
  const pushFailed = ref(false);
  const syncsActive = ref(0);
  const sessionExpired = ref(false);

  const logout = () => {
    authenticatedUser.value = undefined;
  };

  const store = createClient({
    baseUrl: OCULAR_GENESIS_HOST,
    middleware: (res) => {
      if (res.status === 401) {
        sessionExpired.value = true;
      }

      return res;
    }
  });

  const login = async (user?: string, password?: string) =>
    store.login(user && password ? { user, password } : undefined).then((res) => {
      if (res.data) {
        authenticatedUser.value = res.data;
        sessionExpired.value = false;
      }

      return res;
    });

  const sync = <T extends MigratableState, P extends MigratableState = T>(config: StorageSync<T, P>) => {
    const initializing = ref(true);
    const errored = ref(false);
    const syncing = ref(false);
    let loadedUser: GenesisUser | undefined;

    const push = async () => {
      if (initializing.value) {
        syncing.value = false;
        return;
      }

      syncing.value = true;

      await store
        .setDataByKey(config.name, config.state())
        .then(({ error }) => (errored.value = !!error))
        .finally(() => (syncing.value = false));
    };

    const change = debounce(push, 1000);

    // initial sync on log in
    watchImmediate([authenticatedUser, initializing], async ([user, init]) => {
      if (!user || !init) return;

      try {
        const { data, error } = await store.getDataByKey<P>(config.name);

        if (user !== authenticatedUser.value) return;

        if (error) {
          logout();
        } else if (data) {
          config.push(data);
        }

        if (!error && user === authenticatedUser.value) {
          loadedUser = user;
        }
      } catch {
        logout();
        pushFailed.value = true;
      } finally {
        if (user === authenticatedUser.value || !authenticatedUser.value) {
          await nextTick(() => (initializing.value = false));
        }
      }
    });

    watch(
      authenticatedUser,
      (user) => {
        if (user && loadedUser && user.name !== loadedUser.name) {
          initializing.value = true;
          errored.value = false;
          config.clear();
        }
      },
      { flush: 'sync' }
    );

    // push data
    watch(
      [authenticatedUser, config.state],
      ([user]) => {
        if (user && !initializing.value) {
          syncing.value = true;
          void change();
        }
      },
      { immediate: true, deep: true }
    );

    // clear on log out
    watch([authenticatedUser, syncing, initializing], ([user, syncing, init]) => {
      if (!user && !syncing && !init) {
        initializing.value = true;
        config.clear();
      }
    });

    // forward syncing status
    watch(syncing, (value) => (syncsActive.value += value ? 1 : -1));
    watch(errored, (value) => syncsFailed[value ? 'add' : 'delete'](push));
  };

  const retry = async () => {
    if (syncsFailed.size) {
      await Promise.allSettled([...syncsFailed].map((fn) => fn()));
    }
  };

  // clear on log out
  watch([authenticatedUser, syncsActive], ([user, syncsActive]) => {
    if (!user && !syncsActive) {
      void store.logout();
    }
  });

  const status = computed((): StorageAuthenticationState => {
    if (sessionExpired.value) {
      return 'session-expired';
    } else if (pushFailed.value) {
      return 'push-failed';
    } else if (syncsFailed.size) {
      return syncsActive.value ? 'retrying' : 'error';
    } else if (authenticatedUser.value) {
      return syncsActive.value ? 'syncing' : 'authenticated';
    } else {
      return 'idle';
    }
  });

  // Check if user is logged in
  if (OCULAR_GENESIS_HOST) {
    void login();
  }

  return {
    status,
    user: readonly(authenticatedUser),
    getAllUsers: store.getAllUsers,
    deleteUser: store.deleteUser,
    createUser: store.createUser,
    updateUser: store.updateUser,
    updatePassword: store.updatePassword,
    retry,
    login,
    logout,
    sync
  };
});
