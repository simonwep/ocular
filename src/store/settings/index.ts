import { generateTemplate } from '@store/settings/template';
import { SettingsState, Theme } from '@store/settings/types';
import { DeepReadonly } from '@vue/reactivity';
import { inject, reactive, readonly } from 'vue';

export const SETTINGS_STORE_KEY = Symbol('SettingsStore');

interface Store {
  state: DeepReadonly<SettingsState>;

  setTheme(theme: Theme): void;
  setAnimations(enable: boolean): void;
}

export const createSettingsStore = (): Store => {
  const state = reactive<SettingsState>(generateTemplate());

  return {
    state: readonly(state),

    setTheme(theme: Theme): void {
      state.appearance.theme = theme;
    },

    setAnimations(enable: boolean): void {
      state.appearance.animations = enable;
    }
  };
};

export const useSettingsStore = (): Store => {
  return inject<Store>(SETTINGS_STORE_KEY) as Store;
};
