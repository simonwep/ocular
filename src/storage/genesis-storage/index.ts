import { computed, nextTick, ref, shallowReactive, watch } from 'vue';
import { MigratableState } from 'yuppee';
import { AppStorage, StorageAuthenticationState, StorageSync } from '@storage/types';
import { debounce } from '@utils';
import { createGenesisStore } from './sdk';

export const createGenesisStorage = (): AppStorage => {
  const store = createGenesisStore('/api');
  const storesToInitialize = shallowReactive(new Set<string>());
  const syncsActive = ref(0);
  const loggedIn = ref(store.isLoggedIn());

  const login = async (user: string, password: string): Promise<boolean> =>
    store
      .login({ user, password })
      .then(() => (loggedIn.value = true))
      .catch(() => false);

  const logout = () => {
    loggedIn.value = false;
  };

  const sync = <T extends MigratableState, P extends MigratableState = T>(config: StorageSync<T, P>) => {
    const initialSyncRequired = ref(true);
    const syncing = ref(false);
    storesToInitialize.add(config.name);

    const change = debounce(async () => {
      await store
        .setDataByKey(config.name, config.state())
        .catch(logout)
        .then(() => (syncing.value = false));
    }, 1000);

    watch(
      [loggedIn, initialSyncRequired],
      async ([loggedIn, sync]) => {
        if (loggedIn && sync) {
          await store.getDataByKey(config.name).catch(logout);

          await nextTick(() => {
            initialSyncRequired.value = false;
            storesToInitialize.delete(config.name);
          });
        }
      },
      { immediate: true }
    );

    // push data
    watch(
      [loggedIn, () => JSON.stringify(config.state())],
      ([loggedIn]) => {
        if (loggedIn && !initialSyncRequired.value) {
          syncing.value = true;
          void change();
        }
      },
      { immediate: true }
    );

    // clear on log out
    watch([loggedIn, syncing, initialSyncRequired], ([loggedIn, syncing, initializing]) => {
      if (!loggedIn && !syncing && !initializing) {
        initialSyncRequired.value = true;
        store.logout();
        config.clear();
      }
    });

    // forward syncing status
    watch(syncing, (value) => (syncsActive.value += value ? 1 : -1));
  };

  const status = computed((): StorageAuthenticationState => {
    if (loggedIn.value) {
      if (storesToInitialize.size) {
        return 'loading';
      } else if (syncsActive.value) {
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
    login,
    logout,
    sync
  };
};
