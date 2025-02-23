import { migrateSettingsState } from './migrator';
import { Mode, SettingsState, Theme } from './types';
import { Storage } from '@storage/index';
import { inject, reactive, readonly } from 'vue';

export const SETTINGS_STORE_KEY = Symbol('SettingsStore');

export const createSettingsStore = (storage?: Storage) => {
  const state = reactive<SettingsState>(migrateSettingsState());

  storage?.sync<SettingsState>({
    name: 'settings',
    state: () => state,
    clear: () => Object.assign(state, migrateSettingsState()),
    push: (data) => Object.assign(state, migrateSettingsState(data))
  });

  return {
    state: readonly(state),

    setTheme: (theme: Theme): void => {
      state.appearance.theme = theme;
    },

    setMode: (mode: Mode): void => {
      state.appearance.mode = mode;
    },

    setAnimations: (enable: boolean): void => {
      state.appearance.animations = enable;
    },

    setMonthOffset: (offset: number): void => {
      state.general.monthOffset = offset;
    },

    setCarryOver: (carryOver: boolean): void => {
      state.general.carryOver = carryOver;
    }
  };
};

type Store = ReturnType<typeof createSettingsStore>;

export const useSettingsStore = (): Store => inject<Store>(SETTINGS_STORE_KEY) as Store;
