import {reactive} from 'vue';
import {generateTemplate} from './template';
import {State} from './types';

export const useState = (): State => {
    return reactive(generateTemplate());
};
