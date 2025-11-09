import { readonly, shallowRef } from 'vue';

type AppConfig = {
  demo: boolean;
};

const defaultConfig: AppConfig = {
  demo: false
};

const config = shallowRef<AppConfig>();

fetch(`${import.meta.env.BASE_URL}app-config.json`)
  .then((res) => res.json())
  .catch(() => defaultConfig)
  .then((data) => (config.value = { ...defaultConfig, ...data }));

export const useAppConfig = () => readonly(config);
