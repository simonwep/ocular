import { DeepReadonly, inject, reactive, readonly } from 'vue';
import { Storage } from '@storage/index';
import { migrateSettingsState } from './migrator';
import { Mode, SettingsState, Theme } from './types';

export const SETTINGS_STORE_KEY = Symbol('SettingsStore');

interface Store {
  state: DeepReadonly<SettingsState>;

  setMode(mode: Mode): void;
  setTheme(theme: Theme): void;
  setAnimations(enable: boolean): void;
}

export const createSettingsStore = (storage?: Storage): Store => {
  const state = reactive<SettingsState>(migrateSettingsState());

  storage?.sync<SettingsState>({
    name: 'settings',
    state: () => state,
    clear: () => Object.assign(state, migrateSettingsState()),
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
