import { inject } from 'vue';
import { Storage } from './createStorage';

export * from './createStorage';

export const STORAGE_KEY = Symbol('Storage');

export const useStorage = () => inject(STORAGE_KEY) as Storage;
