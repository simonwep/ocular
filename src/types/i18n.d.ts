/* eslint-disable  @typescript-eslint/no-unused-vars */
import { DefineLocaleMessage } from 'vue-i18n';
import de from '@i18n/locales/de.json';
import en from '@i18n/locales/en.json';

type DE = typeof de & typeof en;

declare module 'vue-i18n' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefineLocaleMessage extends DE {}
}
