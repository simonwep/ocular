import { computed, nextTick, readonly, ref, watch } from 'vue';
import { MigratableState } from 'yuppee';
import { debounce } from '@utils';
import { createGenesisStore, GenesisUser } from './createGenesisStore';
import { StorageAuthenticationState, StorageSync } from './types';

export type Storage = ReturnType<typeof createStorage>;

export const createStorage = () => {
  const store = createGenesisStore(import.meta.env.OCULAR_GENESIS_HOST);
  const authenticatedUser = ref<GenesisUser>();
  const syncsActive = ref(0);

  const login = async (user?: string, password?: string): Promise<boolean> =>
    store
      .login(user && password ? { user, password } : undefined)
      .then((user) => {
        authenticatedUser.value = user;
        return true;
      })
      .catch(() => false);

  const logout = () => {
    authenticatedUser.value = undefined;
  };

  const updatePassword = async (currentPassword: string, newPassword: string) =>
    store
      .updatePassword({ currentPassword, newPassword })
      .then(() => true)
      .catch(() => false);

  const sync = <T extends MigratableState, P extends MigratableState = T>(config: StorageSync<T, P>) => {
    const initialSyncRequired = ref(true);
    const syncing = ref(false);

    const change = debounce(async () => {
      await store
        .setDataByKey(config.name, config.state())
        .then(() => (syncing.value = false))
        .catch(() => false);
    }, 1000);

    watch(
      [authenticatedUser, initialSyncRequired],
      async ([user, sync]) => {
        if (user && sync) {
          await store
            .getDataByKey(config.name)
            .then((data) => config.push(data as P))
            .catch(() => false);

          await nextTick(() => (initialSyncRequired.value = false));
        }
      },
      { immediate: true }
    );

    // push data
    watch(
      [authenticatedUser, () => JSON.stringify(config.state())],
      ([user]) => {
        if (user && !initialSyncRequired.value) {
          syncing.value = true;
          void change();
        }
      },
      { immediate: true }
    );

    // clear on log out
    watch([authenticatedUser, syncing, initialSyncRequired], ([user, syncing, initializing]) => {
      if (!user && !syncing && !initializing) {
        initialSyncRequired.value = true;
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
      if (syncsActive.value) {
        return 'syncing';
      } else {
        return 'authenticated';
      }
    } else {
      return 'idle';
    }
  });

  // Check if user is logged in
  void login();

  return {
    user: readonly(authenticatedUser),
    status,
    updatePassword,
    login,
    logout,
    sync
  };
};
