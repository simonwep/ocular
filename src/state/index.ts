import {BudgetGroup, State} from '@state/types';
import {remove, uuid} from '@utils';
import {DeepReadonly} from '@vue/reactivity';
import {inject, provide, reactive, readonly, watch} from 'vue';
import {readFile} from '../utils/readFile';
import {generateTemplate} from './template';

const STORE_KEY = Symbol('State');

interface Store {
    state: DeepReadonly<State>;

    serialize(): string;
    deserialize(file: File): Promise<void>;

    setStartingBalance(amount: number): void;
    setBudgetTitle(name: string): void;

    addBudgetGroup(target: 'expenses' | 'income'): void;
    addBudget(group: string): void;

    removeBudgetGroup(id: string): void;
    removeBudget(id: string): void;

    setBudgetGroupName(id: string, name: string): void;
    setBudgetName(id: string, name: string): void;
    setBudget(id: string, month: number, amount: number): void;
}

export const provideStore = (): Store => {
    const stored = localStorage.getItem('_state');
    const state = reactive(stored ? JSON.parse(stored) : generateTemplate());
    const groups = () => [...state.expenses, ...state.income];

    watch(state, () => localStorage.setItem('_state', JSON.stringify(state)));

    const store: Store = {
        state: readonly(state),

        serialize(): string {
            return JSON.stringify(state);
        },

        deserialize(file: File): Promise<void> {
            return readFile(file).then(JSON.parse).then(content => {
                for (const key of Object.keys(state)) {
                    if (!(key in content) && (key in state)) {
                        delete (state as any)[key];
                    }
                }

                Object.assign(state, content);
            });
        },

        setStartingBalance(amount: number): void {
            state.startingBalance = amount;
        },

        setBudgetTitle(name: string): void {
            state.title = name;
        },

        setBudgetGroupName(id: string, name: string) {
            const group = groups().find(v => v.id === id);
            group && (group.name = name);
        },

        setBudgetName(id: string, name: string) {
            const group = groups().flatMap(v => v.budgets).find(v => v.id === id);
            group && (group.name = name);
        },

        setBudget(id: string, month: number, amount: number) {
            const group = groups().flatMap(v => v.budgets).find(v => v.id === id);
            group && (group.values[month] = amount);
        },

        removeBudget(id: string) {
            groups().forEach(({budgets}) => remove<BudgetGroup>(budgets, v => v.id === id));
        },

        removeBudgetGroup(id: string) {
            remove<BudgetGroup>(state.expenses, v => v.id === id);
            remove<BudgetGroup>(state.income, v => v.id === id);
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
