export type Theme = 'light' | 'dark';

export interface SettingsState {
  appearance: {
    theme: Theme;
    animations: boolean;
  };
}
