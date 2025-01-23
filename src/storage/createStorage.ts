import { debounce } from '@utils';
import { computed, nextTick, readonly, ref, watch } from 'vue';
import { MigratableState } from 'yuppee';
import { createGenesisStore, GenesisUser } from './createGenesisStore';
import { StorageAuthenticationState, StorageSync } from './types';

export type Storage = ReturnType<typeof createStorage>;

export const createStorage = () => {
  const authenticatedUser = ref<GenesisUser | undefined>();
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
      .then((user) => {
        authenticatedUser.value = user;
        return true;
      })
      .catch(() => false);

  const sync = <T extends MigratableState, P extends MigratableState = T>(config: StorageSync<T, P>) => {
    const initializing = ref(true);
    const syncing = ref(false);

    const change = debounce(async () => {
      await store
        .setDataByKey(config.name, config.state())
        .then(() => (syncing.value = false))
        .catch(() => false);
    }, 1000);

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
  };

  // clear on log out
  watch([authenticatedUser, syncsActive], ([user, syncsActive]) => {
    if (!user && !syncsActive) {
      void store.logout();
    }
  });

  const status = computed((): StorageAuthenticationState => {
    if (authenticatedUser.value) {
      return syncsActive.value ? 'syncing' : 'authenticated';
    } else {
      return 'idle';
    }
  });

  // Check if user is logged in
  void login();

  return {
    user: readonly(authenticatedUser),
    status,
    getAllUsers: store.getAllUsers,
    deleteUser: store.deleteUser,
    createUser: store.createUser,
    updateUser: store.updateUser,
    updatePassword: store.updatePassword,
    login,
    logout,
    sync
  };
};
