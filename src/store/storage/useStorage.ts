import { createStorage } from './createStorage';
import { createGlobalState } from '@vueuse/core';

export type { Storage } from './createStorage';

export const useStorage = createGlobalState(createStorage);
