import { computed, nextTick, ref, shallowReactive, watch } from 'vue';
import { MigratableState } from 'yuppee';
import { createKeyStorage } from '@storage/key-storage';
import { AppStorage, StorageAuthenticationState, StorageSync } from '@storage/types';
import { debounce } from '@utils';

const CACHE_KEY = 'GENESIS_STORAGE_KEY';

export const createGenesisStorage = (): AppStorage => {
  const { register, unregister, token } = createKeyStorage(CACHE_KEY);
  const storesToInitialize = shallowReactive(new Set<string>());
  const syncsActive = ref(0);
  const loggedIn = ref(!!token.value);

  const login = async (user: string, password: string): Promise<boolean> =>
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ user, password })
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((body) => {
        register(body.token, body.expiresAt);
        loggedIn.value = true;
        return true;
      })
      .catch(() => false);

  const upsert = async (name: string, json: string) =>
    fetch(`/api/data/${name}`, {
      headers: { Authorization: `Bearer ${token.value}` },
      method: 'POST',
      body: json
    });

  const get = async (name: string) =>
    fetch(`/api/data/${name}`, {
      headers: { Authorization: `Bearer ${token.value}` }
    }).then((res) => (res.ok ? (res.status === 204 ? undefined : res.json()) : Promise.reject(res)));

  const logout = () => (loggedIn.value = false);

  const sync = <T extends MigratableState, P extends MigratableState = T>(config: StorageSync<T, P>) => {
    const initialSyncRequired = ref(true);
    const syncing = ref(false);
    storesToInitialize.add(config.name);

    const change = debounce(async (json: string) => {
      await upsert(config.name, json);
      syncing.value = false;
    }, 1000);

    watch(
      [token, initialSyncRequired],
      async ([token, sync]) => {
        if (token && sync) {
          const data = await get(config.name);
          data && config.push(data);

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
      [token, () => JSON.stringify(config.state())],
      ([key, state]) => {
        if (key && !initialSyncRequired.value) {
          syncing.value = true;
          void change(state);
        }
      },
      { immediate: true }
    );

    // clear on log out
    watch([loggedIn, syncing, initialSyncRequired], ([loggedIn, syncing, initializing]) => {
      if (!loggedIn && !syncing && !initializing) {
        initialSyncRequired.value = true;
        config.clear();
        unregister();
      }
    });

    // forward syncing status
    watch(syncing, (value) => (syncsActive.value += value ? 1 : -1));
  };

  const status = computed((): StorageAuthenticationState => {
    if (token.value) {
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
