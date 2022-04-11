import { createStore, STORE_KEY } from '@state/index';
import { createApp } from 'vue';
import App from './app/App.vue';
import './styles/index.scss';

const app = createApp(App);
app.provide(STORE_KEY, createStore());
app.mount('#app');
