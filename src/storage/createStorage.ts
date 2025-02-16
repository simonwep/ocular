import { createGenesisStore, GenesisUser } from './createGenesisStore';
import { StorageAuthenticationState, StorageSync } from './types';
import { debounce } from '@utils';
import { computed, nextTick, readonly, ref, shallowReactive, watch } from 'vue';
import { MigratableState } from 'yuppee';

export type Storage = ReturnType<typeof createStorage>;

export const createStorage = () => {
  const authenticatedUser = ref<GenesisUser | undefined>();
  const syncsFailed = shallowReactive<Set<() => Promise<void>>>(new Set());
  const syncsActive = ref(0);

  const logout = () => {
    authenticatedUser.value = undefined;
  };

  const store = createGenesisStore({
    baseUrl: import.meta.env.OCULAR_GENESIS_HOST,
    onSessionExpired: logout
  });

  const login = async (user?: string, password?: string): Promise<boolean> =>
    store
      .login(user && password ? { user, password } : undefined)
      .then((user) => (authenticatedUser.value = user))
      .then(() => true)
      .catch(() => false);

  const sync = <T extends MigratableState, P extends MigratableState = T>(config: StorageSync<T, P>) => {
    const initializing = ref(true);
    const errored = ref(false);
    const syncing = ref(false);

    const push = async () => {
      syncing.value = true;

      await store
        .setDataByKey(config.name, config.state())
        .then(() => (errored.value = false))
        .catch(() => (errored.value = true))
        .finally(() => (syncing.value = false));
    };

    const change = debounce(push, 1000);

    // initial sync on log in
    watch(
      [authenticatedUser, initializing],
      async ([user, init]) => {
        if (user && init) {
          await store
            .getDataByKey(config.name)
            .then((data) => config.push(data as P))
            .catch(() => false);

          await nextTick(() => (initializing.value = false));
        }
      },
      { immediate: true }
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
    if (syncsFailed.size) {
      return syncsActive.value ? 'retrying' : 'error';
    } else if (authenticatedUser.value) {
      return syncsActive.value ? 'syncing' : 'authenticated';
    } else {
      return 'idle';
    }
  });

  // Check if user is logged in
  void login();

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
};
