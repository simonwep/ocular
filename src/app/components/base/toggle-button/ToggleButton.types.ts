import type { Component } from 'vue';

export type SelectableId = string | symbol | number;

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Selectable<T = any> {
  id: SelectableId;
  icon: Component;
  value: T;
}
