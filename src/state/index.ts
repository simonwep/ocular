import {State} from '@state/types';
import {remove} from '@utils';
import {DeepReadonly} from '@vue/reactivity';
import {inject, provide, reactive, readonly} from 'vue';
import {uuid} from '../utils/uuid';
import {generateTemplate} from './template';

const STORE_KEY = Symbol('State');

interface Store {
    state: DeepReadonly<State>;

    addBudgetGroup(target: 'expenses' | 'income'): void;

    addBudget(group: string): void;

    removeBudgetGroup(id: string): void;

    removeBudget(id: string): void;
}

export const provideStore = (): Store => {
    const state = reactive(generateTemplate());
    const groups = () => [...state.expenses, ...state.income];

    const store: Store = {
        state: readonly(state),

        removeBudget(id: string) {
            groups().forEach(({budgets}) => remove(budgets, v => v.id === id));
        },

        removeBudgetGroup(id: string) {
            remove(state.expenses, v => v.id === id);
            remove(state.income, v => v.id === id);
        },

        addBudget(id: string) {
            groups().find(v => v.id === id)?.budgets.push({
                id: uuid(),
                name: 'Category',
                values: (new Array(12)).fill(0)
            });
        },

        addBudgetGroup(target: 'expenses' | 'income') {
            state[target].push({
                id: uuid(),
                name: 'New Group',
                budgets: []
            });
        }
    };

    provide<Store>(STORE_KEY, store);
    return store;
};

export const useStore = (): Store => {
    return inject<Store>(STORE_KEY) as Store;
};
