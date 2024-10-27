/// <reference types="vite/client" />

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
