import { Storage } from './createStorage';
import { inject } from 'vue';

export * from './createStorage';

export const STORAGE_KEY = Symbol('Storage');

export const useStorage = () => inject(STORAGE_KEY) as Storage;
