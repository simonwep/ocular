import { createGoogleDriveStorage } from '@storage/google-drive-storage';
import { GoogleDriveAuth } from '@storage/google-drive-storage/types';
import { AppStorage } from '@storage/types';
import { inject } from 'vue';

export const STORAGE_KEY = Symbol('GoogleDriveStorage');

export const createStorage = (auth: GoogleDriveAuth): AppStorage => {
  return createGoogleDriveStorage(auth);
};

export const useStorage = (): AppStorage => {
  return inject<AppStorage>(STORAGE_KEY) as AppStorage;
};
