/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module '*.json' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content: any;
  export default content;
}

declare interface HTMLDialogElement {
  open: boolean;
  returnValue: string;
  close(): void;
  slow(): void;
  showModal(): void;
}

interface ImportMetaEnv {
  readonly OAUTH_URI: string;
  readonly OAUTH_CLIENT_ID: string;
  readonly OAUTH_SCOPE: string;

  readonly ACKEE_HOST: string;
  readonly ACKEE_DOMAIN_ID: string;

  readonly APP_BUILD_TIMESTAMP: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
