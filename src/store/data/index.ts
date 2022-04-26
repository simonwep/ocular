import { AppStorage } from '@storage/types';
import { remove, uuid } from '@utils';
import { DeepReadonly } from '@vue/reactivity';
import { inject, reactive, readonly } from 'vue';
import { readFile } from '@utils';
import { Budget, BudgetGroup, DataState } from './types';
import { generateTemplate } from './template';

export const DATA_STORE_KEY = Symbol('DataStore');

type Group = 'expenses' | 'income';

interface Store {
  state: DeepReadonly<DataState>;

  serialize(): string;
  deserialize(file: File): Promise<void>;

  setBudgetGroups(target: Group, groups: BudgetGroup[]): void;
  addBudgetGroup(target: Group): void;
  addBudget(group: string): void;

  removeBudgetGroup(id: string): void;
  removeBudget(id: string): void;

  setBudgetGroupName(id: string, name: string): void;
  setBudgetName(id: string, name: string): void;
  setBudget(id: string, month: number, amount: number): void;
}

export const createDataStore = (storage?: AppStorage): Store => {
  const state = reactive(generateTemplate());
  const groups = () => [...state.expenses, ...state.income];

  storage?.sync<DataState>({
    name: 'data',
    state: () => state,
    push: (data) => Object.assign(state, data)
  });

  return {
    state: readonly(state),

    serialize(): string {
      return JSON.stringify(state);
    },

    deserialize(file: File): Promise<void> {
      return readFile(file)
        .then(JSON.parse)
        .then((content) => {
          /* eslint-disable @typescript-eslint/no-explicit-any */
          for (const key of Object.keys(state)) {
            if (!(key in content) && key in state) {
              delete (state as any)[key];
            }
          }

          Object.assign(state, content);
        });
    },

    setBudgetGroups(target: Group, groups: BudgetGroup[]): void {
      state[target] = groups;
    },

    setBudgetGroupName(id: string, name: string) {
      const group = groups().find((v) => v.id === id);
      group && (group.name = name);
    },

    setBudgetName(id: string, name: string) {
      const group = groups()
        .flatMap((v) => v.budgets)
        .find((v) => v.id === id);
      group && (group.name = name);
    },

    setBudget(id: string, month: number, amount: number) {
      const group = groups()
        .flatMap((v) => v.budgets)
        .find((v) => v.id === id);
      group && (group.values[month] = amount);
    },

    removeBudget(id: string) {
      groups().forEach(({ budgets }) =>
        remove<Budget>(budgets, (v) => v.id === id)
      );
    },

    removeBudgetGroup(id: string) {
      remove<BudgetGroup>(state.expenses, (v) => v.id === id);
      remove<BudgetGroup>(state.income, (v) => v.id === id);
    },

    addBudget(id: string) {
      groups()
        .find((v) => v.id === id)
        ?.budgets.push({
          id: uuid(),
          name: 'Category',
          values: new Array(12).fill(0)
        });
    },

    addBudgetGroup(target: Group) {
      state[target].push({
        id: uuid(),
        name: 'New Group',
        budgets: []
      });
    }
  };
};

export const useDataStore = (): Store => {
  return inject<Store>(DATA_STORE_KEY) as Store;
};
