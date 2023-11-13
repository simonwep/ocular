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
  // Development
  readonly OCULAR_TEST_USERNAME?: string;
  readonly OCULAR_TEST_PASSWORD?: string;

  // Backend host
  readonly OCULAR_GENESIS_HOST: string;

  // Build information
  readonly OCULAR_BUILD_TIMESTAMP: number;
  readonly OCULAR_BUILD_VERSION?: string;
  readonly OCULAR_BUILD_SHA?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
