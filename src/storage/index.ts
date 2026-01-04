import { createStorage } from './createStorage';
import { createGlobalState } from '@vueuse/core';

export * from './createStorage';

export const useStorage = createGlobalState(createStorage);
