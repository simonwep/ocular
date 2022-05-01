import { AppIcon } from '@components/base/icon/Icon.types';

export type SelectableId = string | symbol | number;

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Selectable<T = any> {
  id: SelectableId;
  icon: AppIcon;
  value: T;
}
