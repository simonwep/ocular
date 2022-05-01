import { StorageData } from '@storage/types';

export type Theme = 'light' | 'dark';

export interface SettingsState extends StorageData {
  appearance: {
    theme: Theme;
    animations: boolean;
  };
}
