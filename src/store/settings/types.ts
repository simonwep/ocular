import { MigratableState } from 'yuppee';

export type Theme = 'light' | 'dark';
export type Mode = 'normal' | 'privacy';

export interface SettingsStateV1 extends MigratableState<1> {
  appearance: {
    theme: Theme;
    animations: boolean;
  };
}

export interface SettingsStateV2 extends MigratableState<2> {
  appearance: {
    mode: Mode;
    theme: Theme;
    animations: boolean;
  };
}

export type SettingsState = SettingsStateV2;
