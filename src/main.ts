import { createDataStore, DATA_STORE_KEY } from '@store/data';
import { createSettingsStore, SETTINGS_STORE_KEY } from '@store/settings';
import { createApp } from 'vue';
import { i18n } from './i18n';
import App from './app/App.vue';
import './styles/index.scss';

const app = createApp(App);

app.provide(DATA_STORE_KEY, createDataStore());
app.provide(SETTINGS_STORE_KEY, createSettingsStore());

app.use(i18n);
app.mount('#app');
