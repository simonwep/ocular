import { MigratableState } from '@utils';

export type Theme = 'light' | 'dark';

export interface SettingsState extends MigratableState<1> {
  appearance: {
    theme: Theme;
    animations: boolean;
  };
}
