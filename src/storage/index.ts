import { inject } from 'vue';
import { createGenesisStorage } from '@storage/genesis-storage';
import { AppStorage } from '@storage/types';

export const STORAGE_KEY = Symbol('GoogleDriveStorage');

export const createStorage = (): AppStorage => {
  return createGenesisStorage();
};

export const useStorage = (): AppStorage => {
  return inject<AppStorage>(STORAGE_KEY) as AppStorage;
};
