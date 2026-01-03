import App from './app/App.vue';
import { i18n } from './i18n';
import { router } from './router';
import { vTooltip } from '@directives/v-tooltip/vTooltip';
import { createStorage, STORAGE_KEY } from '@storage/index';
import { createSettingsStore, SETTINGS_STORE_KEY } from '@store/settings';
import { createDataStore, DATA_STORE_KEY } from '@store/state';
import { createLogger } from '@utils/logger/logger.ts';
import { registerSW } from 'virtual:pwa-register';
import { createApp } from 'vue';
import './styles/index.scss';

const storage = createStorage();
const app = createApp(App);

app.provide(DATA_STORE_KEY, createDataStore(storage));
app.provide(SETTINGS_STORE_KEY, createSettingsStore(storage));
app.provide(STORAGE_KEY, storage);

app.directive('tooltip', vTooltip);
app.use(i18n);
app.use(router);

app.mount('#app');

// Print info and register service worker
const logger = createLogger('app');

logger.info(`Ocular build on the ${new Date(import.meta.env.OCULAR_BUILD_TIMESTAMP).toLocaleString()}`);

if (!import.meta.env.OCULAR_GENESIS_HOST) {
  logger.info('No backend configured, running in offline mode');
}

logger.info("Like what you're seeing? Consider giving it a star on https://github.com/simonwep/ocular!");

registerSW({
  onOfflineReady: () => logger.success('App available offline'),
  onNeedRefresh: () => logger.info('App updated, need to refresh...'),
  onRegisteredSW: () => logger.success('Service worker registered'),
  onRegisterError: (e) => logger.error('Failed to register service-worker', e)
});
