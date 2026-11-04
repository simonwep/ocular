import { createClient } from '@store/genesis/genesis.sdk.ts';
import { createLogger } from '@utils/logger/logger.ts';
import { createGlobalState, watchDebounced, watchImmediate } from '@vueuse/core';
import { applyPatch } from 'rfc6902';
import { computed, nextTick, reactive, readonly, ref, shallowReactive, shallowRef, watch } from 'vue';
import type { GenesisJsonPatchOperation, GenesisUser } from '@store/genesis/genesis.sdk.ts';
import type { MigratableState } from 'yuppee';

const { OCULAR_GENESIS_HOST } = import.meta.env;

export type Storage = ReturnType<typeof useStorage>;

export type StorageAuthenticationState =
  'idle' | 'authenticated' | 'syncing' | 'error' | 'retrying' | 'push-failed' | 'session-expired';

export type StorageSync<T extends MigratableState, P extends MigratableState = T> = {
  key: string;
  init: T;
  migrate(data: P): T;
};

export type StorageMutate = (...changes: GenesisJsonPatchOperation[]) => void;

export const useStorage = createGlobalState(() => {
  const globalUser = shallowRef<GenesisUser | undefined>();
  const syncsFailed = shallowReactive<Set<() => Promise<void>>>(new Set());
  const pushFailed = ref(false);
  const syncsActive = ref(0);
  const sessionExpired = ref(false);

  const logger = createLogger('storage');

  const logout = () => {
    globalUser.value = undefined;
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

  const sync = <T extends MigratableState, P extends MigratableState = T>(config: StorageSync<T, P>) => {
    const initializing = ref(true);
    const errored = ref(false);
    const syncing = ref(false);

    const state = reactive(config.init) as T;
    const defaultState = JSON.parse(JSON.stringify(config.init)) as T;
    const localUser = shallowRef<GenesisUser | undefined>();
    const pendingChanges = shallowReactive<GenesisJsonPatchOperation[]>([]);
    const initialState = shallowRef<T>();

    let pushing = false;

    const resetLocalState = () => {
      initializing.value = true;
      initialState.value = undefined;
      pendingChanges.length = 0;
      errored.value = false;
      replace(defaultState, false);
    };

    const pushToRemote = async () => {
      if (initializing.value || !globalUser.value) {
        syncing.value = false;
        return;
      }

      if (pushing || (!initialState.value && !pendingChanges.length)) {
        return;
      }

      pushing = true;
      syncing.value = true;

      try {
        if (initialState.value) {
          const nextState = initialState.value;
          logger.info(`Pushing initial state for user ${globalUser.value.name}...`);
          const { error } = await store.setDataByKey(config.key, nextState);
          errored.value = !!error;

          if (errored.value) {
            logger.error(`Failed to push initial state for user ${globalUser.value.name}`, error);
            return;
          }

          if (initialState.value === nextState) initialState.value = undefined;
          logger.info(`Initial state pushed for user ${globalUser.value.name}`);
        }

        if (pendingChanges.length) {
          logger.info(`Pushing ${pendingChanges.length} pending changes for user ${globalUser.value.name}...`);
          const changes = pendingChanges.slice();
          const { error } = await store.patchDataByKey(config.key, changes);
          errored.value = !!error;

          if (error) {
            logger.error(`Failed to push pending changes for user ${globalUser.value.name}`, error);
            return;
          }

          pendingChanges.splice(0, changes.length);
          logger.info(`Pending changes pushed for user ${globalUser.value.name}`);
        }
      } finally {
        pushing = false;
        syncing.value = false;

        // If there are still pending changes or initial state, try to push again
        if (!errored.value && (initialState.value || pendingChanges.length)) {
          void pushToRemote();
        }
      }
    };

    watchDebounced(pendingChanges, pushToRemote, { debounce: 1000 });

    watch([initialState, initializing], ([state, init]) => {
      if (state && !init) void pushToRemote();
    });

    const mutate: StorageMutate = (...changes) => {
      if (!changes.length) return;
      const errors = applyPatch(state, changes);

      if (errors.some(Boolean)) throw errors;
      if (!globalUser.value || initializing.value) return;

      logger.info(`Mutating storage for user ${globalUser.value.name} with ${changes.length} changes...`);
      pendingChanges.push(...changes);
      syncing.value = true;
    };

    const replace = (next: T, persist = true) => {
      Object.assign(state, next);

      if (persist && globalUser.value && !initializing.value) {
        pendingChanges.length = 0;
        initialState.value = next;
      }
    };

    // initial sync on log in
    watchImmediate([globalUser, initializing], async ([user, init]) => {
      if (!user || !init) return;
      logger.info(`Initializing storage for user ${user.name}...`);
      pendingChanges.length = 0;

      try {
        const { data, error } = await store.getDataByKey<P>(config.key);
        if (user !== globalUser.value) return;

        if (error) {
          logout();
        } else if (data !== undefined) {
          replace(config.migrate(data), false); // Apply initial state
        } else {
          initialState.value = state;
        }

        if (!error && user === globalUser.value) {
          localUser.value = user;
        }
      } catch {
        logout();
        pushFailed.value = true;
      } finally {
        if (user === globalUser.value || !globalUser.value) {
          await nextTick(() => (initializing.value = false));
        }
      }
    });

    // clear on user change
    watch(
      [globalUser, localUser],
      ([user, syncUser]) => {
        if (user && syncUser && user.name !== syncUser.name) {
          logger.info(`User changed from ${syncUser.name} to ${user.name}, clearing storage...`);
          resetLocalState();
        }
      },
      { flush: 'sync' }
    );

    // clear on log out
    watch([globalUser, syncing, initializing], ([user, syncing, init]) => {
      if (!user && !syncing && !init) {
        logger.info(`User logged out, clearing storage...`);
        resetLocalState();
      }
    });

    // forward syncing status
    watch(syncing, (value) => (syncsActive.value += value ? 1 : -1));
    watch(errored, (value) => syncsFailed[value ? 'add' : 'delete'](pushToRemote));

    return { mutate, replace, state: readonly(state) };
  };

  const retry = async () => {
    if (syncsFailed.size) {
      logger.info(`Retrying ${syncsFailed.size} failed syncs...`);
      await Promise.allSettled([...syncsFailed].map((fn) => fn()));
    }
  };

  const login = async (user?: string, password?: string) =>
    store.login(user && password ? { user, password } : undefined).then((res) => {
      if (res.data) {
        globalUser.value = res.data;
        sessionExpired.value = false;
        retry(); // retry failed syncs on successful login
      }

      return res;
    });

  // clear on log out
  watch([globalUser, syncsActive], ([user, syncsActive]) => {
    if (!user && !syncsActive) {
      logger.info(`User logged out, clearing storage...`);
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
    } else if (globalUser.value) {
      return syncsActive.value ? 'syncing' : 'authenticated';
    } else {
      return 'idle';
    }
  });

  // Check if user is logged in
  if (OCULAR_GENESIS_HOST) {
    logger.info(`Checking if user is logged in...`);
    void login();
  }

  return {
    status,
    user: readonly(globalUser),
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
