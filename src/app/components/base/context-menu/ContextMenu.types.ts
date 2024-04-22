import type { Component } from 'vue';

export const ContextMenuStoreKey = Symbol('ContextMenuStore');

export interface ContextMenuStore {
  close(): void;
}

export type ContextMenuOptionId = number | string;

export interface ContextMenuOption {
  id: ContextMenuOptionId;
  muted?: boolean;
  icon?: Component;
  label?: string;
}
