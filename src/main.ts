import { createStorage, STORAGE_KEY } from '@storage/index';
import { createDataStore, DATA_STORE_KEY } from '@store/data';
import { createSettingsStore, SETTINGS_STORE_KEY } from '@store/settings';
import { registerSW } from 'virtual:pwa-register';
import { createApp } from 'vue';
import { i18n } from './i18n';
import { router } from './router';
import App from './app/App.vue';
import './styles/index.scss';

const { OAUTH_URI, OAUTH_CLIENT_ID, OAUTH_SCOPE } = import.meta.env;

const storage = createStorage({
  authUri: OAUTH_URI as string,
  clientId: OAUTH_CLIENT_ID as string,
  scope: OAUTH_SCOPE as string
});

const app = createApp(App);

app.provide(DATA_STORE_KEY, createDataStore(storage));
app.provide(SETTINGS_STORE_KEY, createSettingsStore(storage));
app.provide(STORAGE_KEY, storage);

app.use(i18n);
app.use(router);

app.mount('#app');

registerSW();
