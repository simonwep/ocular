import { computed, ref, watch } from 'vue';

interface KeyStoreData {
  key: string;
  expiresAt: number;
}

export const createKeyStorage = (name: string) => {
  const store = ref<KeyStoreData | undefined>();
  const cached = localStorage.getItem(name);

  if (cached) {
    const data = JSON.parse(cached) as KeyStoreData;

    if (Date.now() > data.expiresAt) {
      store.value = undefined;
      localStorage.removeItem(name);
    } else {
      store.value = data;
    }
  }

  let timeout = -1;
  watch(store, (data) => {
    clearTimeout(timeout);

    if (data) {
      localStorage.setItem(name, JSON.stringify(data));

      timeout = setTimeout(() => {
        store.value = undefined;
        localStorage.removeItem(name);
      }, data.expiresAt - Date.now()) as unknown as number;
    }
  });

  return {
    token: computed(() => store.value?.key),
    unregister() {
      store.value = undefined;
      localStorage.removeItem(name);
    },
    register(key: string, expiresAt: number) {
      store.value = { key, expiresAt };
    }
  };
};
