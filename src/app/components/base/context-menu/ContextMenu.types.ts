import { AppIcon } from '@components/base/icon/Icon.types';

export const ContextMenuStoreKey = Symbol('ContextMenuStore');

export interface ContextMenuStore {
  close(): void;
}

export type ContextMenuOptionId = number | string;

export interface ContextMenuOption {
  id: ContextMenuOptionId;
  icon?: AppIcon;
  label?: string;
}
