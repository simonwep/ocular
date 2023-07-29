import { computed, nextTick, ref, watch } from 'vue';
import { MigratableState } from 'yuppee';
import { debounce } from '@utils';
import { createGenesisStore } from './createGenesisStore';
import { StorageAuthenticationState, StorageSync } from './types';

export type Storage = ReturnType<typeof createStorage>;

export const createStorage = () => {
  const store = createGenesisStore('/api');
  const authenticated = ref(store.isLoggedIn());
  const syncsActive = ref(0);

  const login = async (user: string, password: string): Promise<boolean> =>
    store
      .login({ user, password })
      .then(() => (authenticated.value = true))
      .catch(() => false);

  const logout = () => {
    authenticated.value = false;
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
      [authenticated, initialSyncRequired],
      async ([loggedIn, sync]) => {
        if (loggedIn && sync) {
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
      [authenticated, () => JSON.stringify(config.state())],
      ([loggedIn]) => {
        if (loggedIn && !initialSyncRequired.value) {
          syncing.value = true;
          void change();
        }
      },
      { immediate: true }
    );

    // clear on log out
    watch([authenticated, syncing, initialSyncRequired], ([loggedIn, syncing, initializing]) => {
      if (!loggedIn && !syncing && !initializing) {
        initialSyncRequired.value = true;
        config.clear();
      }
    });

    // forward syncing status
    watch(syncing, (value) => (syncsActive.value += value ? 1 : -1));
  };

  // clear on log out
  watch([authenticated, syncsActive], ([loggedIn, syncsActive]) => {
    if (!loggedIn && !syncsActive) {
      void store.logout();
    }
  });

  const status = computed((): StorageAuthenticationState => {
    if (authenticated.value) {
      if (syncsActive.value) {
        return 'syncing';
      } else {
        return 'authenticated';
      }
    } else {
      return 'idle';
    }
  });

  return {
    status,
    updatePassword,
    login,
    logout,
    sync
  };
};
