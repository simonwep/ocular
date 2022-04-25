import { createDataStore, DATA_STORE_KEY } from '@store/data';
import { createSettingsStore, SETTINGS_STORE_KEY } from '@store/settings';
import { createApp } from 'vue';
import { i18n } from './i18n';
import App from './app/App.vue';
import './styles/index.scss';
import { createGoogleDriveStorage } from './utils/google-drive-storage';

const { OAUTH_URI, OAUTH_CLIENT_ID, OAUTH_SCOPE } = import.meta.env;

const storage = createGoogleDriveStorage({
  authUri: OAUTH_URI as string,
  clientId: OAUTH_CLIENT_ID as string,
  scope: OAUTH_SCOPE as string
});

const app = createApp(App);

app.provide(DATA_STORE_KEY, createDataStore(storage));
app.provide(SETTINGS_STORE_KEY, createSettingsStore(storage));

app.use(i18n);
app.mount('#app');
