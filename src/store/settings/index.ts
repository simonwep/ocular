import { AppStorage } from '@storage/types';
import { generateTemplate } from './template';
import { Mode, SettingsState, Theme } from './types';
import { DeepReadonly } from 'vue';
import { inject, reactive, readonly } from 'vue';
import { migrateSettingsState } from './migrateSettingsState';

export const SETTINGS_STORE_KEY = Symbol('SettingsStore');

interface Store {
  state: DeepReadonly<SettingsState>;

  setMode(mode: Mode): void;
  setTheme(theme: Theme): void;
  setAnimations(enable: boolean): void;
}

export const createSettingsStore = (storage?: AppStorage): Store => {
  const state = reactive<SettingsState>(generateTemplate());

  storage?.sync<SettingsState>({
    name: 'settings',
    state: () => state,
    push: (data) => Object.assign(state, migrateSettingsState(data))
  });

  return {
    state: readonly(state),

    setTheme(theme: Theme): void {
      state.appearance.theme = theme;
    },

    setMode(mode: Mode): void {
      state.appearance.mode = mode;
    },

    setAnimations(enable: boolean): void {
      state.appearance.animations = enable;
    }
  };
};

export const useSettingsStore = (): Store => {
  return inject<Store>(SETTINGS_STORE_KEY) as Store;
};
