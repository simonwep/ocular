import { DeepReadonly } from 'vue';
import { reactive, readonly, watch } from 'vue';

interface CachedData {
  key: string;
  expiresAt: number;
  cachedAt: number;
}

export interface KeyCache {
  key: string | undefined;
  expiresAt: number | undefined;

  register(key: string, expiresAt: number): void;
}

export const createKeyStorage = (name: string): DeepReadonly<KeyCache> => {
  const state = reactive<KeyCache>({
    key: undefined,
    expiresAt: undefined,
    register(key: string, expiresAt: number) {
      state.key = key;
      state.expiresAt = expiresAt;
    }
  });

  let timeout = -1;
  watch(
    () => [state.key, state.expiresAt],
    () => {
      clearTimeout(timeout);

      if (state.expiresAt !== undefined) {
        localStorage.setItem(
          name,
          JSON.stringify({
            ...state,
            cachedAt: Date.now()
          })
        );

        timeout = setTimeout(() => {
          state.key = undefined;
          localStorage.removeItem(name);
        }, state.expiresAt) as unknown as number;
      }
    }
  );

  const cached = localStorage.getItem(name);
  if (cached) {
    const data = JSON.parse(cached) as CachedData;

    if (Date.now() - data.cachedAt < data.expiresAt) {
      state.expiresAt = data.expiresAt - (Date.now() - data.cachedAt);
      state.key = data.key;
    } else {
      localStorage.removeItem(name);
    }
  }

  return readonly(state);
};
