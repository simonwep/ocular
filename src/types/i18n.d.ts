/* eslint-disable  @typescript-eslint/no-unused-vars */
import { DefineLocaleMessage } from 'vue-i18n';
import type en from '@i18n/locales/en.json';

type EN = typeof en;

declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefineLocaleMessage extends EN {}
}
