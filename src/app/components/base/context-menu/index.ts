import { AppIcon } from '@components/base/icon/Icon.types';

export type ContextMenuOptionId = number | string;

export interface ContextMenuOption {
  id: ContextMenuOptionId;
  icon?: AppIcon;
  label?: string;
}
