/* eslint-disable  @typescript-eslint/no-unused-vars */
import de from '@i18n/locales/de.json';
import en from '@i18n/locales/en.json';
import { DefineLocaleMessage } from 'vue-i18n';

type DE = typeof de & typeof en;

declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefineLocaleMessage extends DE {}
}
