import { migrateSettingsState } from './migrator';
import { useStorage } from '@store/storage/useStorage.ts';
import { createGlobalState } from '@vueuse/core';
import { readonly } from 'vue';
import type { SettingsState } from './types';

export const useSettingsStore = createGlobalState(() => {
  const storage = useStorage();

  const { mutate, state } = storage.sync<SettingsState>({
    key: 'settings',
    init: migrateSettingsState(),
    migrate: migrateSettingsState
  });

  return {
    state: readonly(state),

    setGeneral: <K extends keyof SettingsState['general']>(key: K, value: SettingsState['general'][K]) => {
      mutate({ op: 'replace', path: `/general/${key}`, value });
    },

    setAppearance: <K extends keyof SettingsState['appearance']>(key: K, value: SettingsState['appearance'][K]) => {
      mutate({ op: 'replace', path: `/appearance/${key}`, value });
    }
  };
});
