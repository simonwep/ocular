export const ContextMenuStoreKey = Symbol('ContextMenuStore');

export interface ContextMenuStore {
  close(): void;
}
