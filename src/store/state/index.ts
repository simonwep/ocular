import { DeepReadonly, inject, reactive, readonly, ShallowRef, shallowRef, watch, watchEffect } from 'vue';
import { useStateHistory, useTime } from '@composables';
import { AvailableLocale, i18n } from '@i18n/index';
import { Storage } from '@storage/index';
import { moveInArrays, readFile, remove, uuid } from '@utils';
import { migrateApplicationState } from './migrator';
import { AvailableCurrency, Budget, BudgetGroup, BudgetYear, DataState, DataStates, DataStateV1 } from './types';
import { generateBudgetYear } from './utils';

export const DATA_STORE_KEY = Symbol('DataStore');

type Group = 'expenses' | 'income';

interface StoredClipboardData {
  year: number;
  data: BudgetYear;
}

interface StoreClipboard {
  data: DeepReadonly<ShallowRef<StoredClipboardData | undefined>>;

  copy(): void;
  paste(): void;
}

interface Store {
  state: DeepReadonly<StoreView>;
  clipboard: StoreClipboard;

  serialize(): string;
  deserialize(file: File): Promise<void>;
  deserialize(file: DataState): Promise<void>;

  shiftYears(): void;
  changeYear(year: number): void;
  changeLocale(locale: AvailableLocale): void;
  changeCurrency(currency: AvailableCurrency): void;

  setBudgetGroups(target: Group, groups: BudgetGroup[]): void;
  addBudgetGroup(target: Group): void;
  addBudget(group: string): void;

  moveBudget(id: string, target: string, after?: boolean): void;
  moveBudgetIntoGroup(id: string, target: string): void;
  moveBudgetGroup(id: string, target: string, after?: boolean): void;

  removeBudgetGroup(id: string): void;
  removeBudget(id: string): void;

  setBudgetGroupName(id: string, name: string): void;
  setBudgetName(id: string, name: string): void;
  setBudget(id: string, month: number, amount: number): void;

  fillBudget(id: string, amount: number, offset?: number): void;

  getBudget(id: string): [BudgetGroup, Budget] | undefined;
  getBudgetGroup(id: string): BudgetGroup | undefined;

  isCurrentMonth(month: number): boolean;
}

type StoreView = Omit<BudgetYear, 'year'> & {
  activeYear: number;
  currency: AvailableCurrency;
  locale: AvailableLocale;
  years: BudgetYear[];
};

export const createDataStore = (storage?: Storage): Store => {
  const activeYear = shallowRef(new Date().getFullYear());
  const clipboard = shallowRef<StoredClipboardData | undefined>();
  const state = reactive<DataState>(migrateApplicationState());
  const time = useTime();

  const history = useStateHistory(
    () => state,
    (v) => Object.assign(state, v)
  );

  document.addEventListener('keydown', (evt: KeyboardEvent) => {
    if (evt.ctrlKey || evt.metaKey) {
      if (evt.code === 'KeyZ') {
        history.undo();
      } else if (evt.code === 'KeyY') {
        history.redo();
      }
    }
  });

  const getCurrentYear = () => state.years.find((v) => v.year === activeYear.value) as BudgetYear;

  const groups = () => {
    const currentYear = getCurrentYear();
    return [...currentYear.expenses, ...currentYear.income];
  };

  watchEffect(() => {
    for (const locale of i18n.global.availableLocales) {
      const formats = i18n.global.getNumberFormat(locale);

      i18n.global.setNumberFormat(locale, {
        ...formats,
        currency: { ...formats.currency, currency: state.currency }
      });
    }
  });

  watch(
    () => state.locale,
    (locale) => (i18n.global.locale.value = locale)
  );

  storage?.sync<DataState, DataState | DataStateV1>({
    name: 'data',
    state: () => state,
    clear: () => Object.assign(state, migrateApplicationState()),
    push: (data) => {
      Object.assign(state, migrateApplicationState(data));

      activeYear.value = state.years.some((v) => v.year === time.year.value)
        ? time.year.value
        : state.years.at(-1)?.year ?? time.year.value;
    }
  });

  return {
    state: readonly<StoreView>({
      get activeYear() {
        return activeYear.value;
      },
      get years() {
        return state.years;
      },
      get currency() {
        return state.currency;
      },
      get locale() {
        return state.locale;
      },
      get expenses() {
        return getCurrentYear().expenses;
      },
      get income() {
        return getCurrentYear().income;
      }
    }),

    clipboard: {
      data: readonly(clipboard),
      copy() {
        clipboard.value = {
          year: activeYear.value,
          data: JSON.parse(JSON.stringify(getCurrentYear()))
        };
      },
      paste() {
        if (clipboard.value) {
          const {
            data: { expenses, income }
          } = clipboard.value;
          Object.assign(getCurrentYear(), { income, expenses });
          clipboard.value = undefined;
        }
      }
    },

    serialize(): string {
      return JSON.stringify(state);
    },

    async deserialize(data: File | DataState) {
      if (data instanceof File) {
        await readFile(data)
          .then(JSON.parse)
          .then((content: DataStates) => {
            Object.assign(state, migrateApplicationState(content));
          });
      } else {
        Object.assign(state, migrateApplicationState(data));
      }
    },

    shiftYears() {
      if (state.years.length > 1) {
        const item = state.years.shift();

        if (item?.year === activeYear.value) {
          activeYear.value = state.years.at(0)?.year as number;
        }
      }
    },

    changeYear(year: number) {
      let data = state.years.find((v) => v.year === year);

      if (!data) {
        data = generateBudgetYear(year);
        state.years.push(data);
        state.years.sort((a, b) => a.year - b.year);
      }

      activeYear.value = year;
    },

    changeLocale(locale: AvailableLocale) {
      state.locale = locale;
    },

    changeCurrency(currency: AvailableCurrency) {
      state.currency = currency;
    },

    setBudgetGroups(target: Group, groups: BudgetGroup[]): void {
      getCurrentYear()[target] = groups;
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

    fillBudget(id: string, amount: number, offset = 0) {
      groups()
        .flatMap((v) => v.budgets)
        .find((v) => v.id === id)
        ?.values.fill(amount, offset);
    },

    removeBudget(id: string) {
      groups().forEach(({ budgets }) => remove<Budget>(budgets, (v) => v.id === id));
    },

    removeBudgetGroup(id: string) {
      remove<BudgetGroup>(getCurrentYear().expenses, (v) => v.id === id);
      remove<BudgetGroup>(getCurrentYear().income, (v) => v.id === id);
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
      getCurrentYear()[target].push({
        id: uuid(),
        name: 'New Group',
        budgets: []
      });
    },

    moveBudget(id: string, target: string, after?: boolean) {
      const budgets = groups().map((v) => v.budgets);
      moveInArrays(budgets, id, target, after);
    },

    moveBudgetIntoGroup(id: string, target: string) {
      const allGroups = groups();
      const sourceGroup = allGroups.find((g) => g.budgets.find((v) => v.id === id));
      const budgetIndex = sourceGroup?.budgets.findIndex((v) => v.id === id) ?? -1;
      const targetGroup = allGroups.find((g) => g.id === target);

      if (targetGroup && sourceGroup && budgetIndex !== -1) {
        targetGroup.budgets.push(...sourceGroup.budgets.splice(budgetIndex, 1));
      }
    },

    moveBudgetGroup(id: string, target: string, after?: boolean) {
      const { income, expenses } = getCurrentYear();
      moveInArrays([income, expenses], id, target, after);
    },

    getBudget(id: string) {
      for (const group of groups()) {
        const budget = group.budgets.find((v) => v.id === id);
        if (budget) return [group, budget];
      }
    },

    getBudgetGroup(id: string) {
      return groups().find((v) => v.id === id);
    },

    isCurrentMonth(month: number): boolean {
      return activeYear.value === time.year.value && month === time.month.value;
    }
  };
};

export const useDataStore = (): Store => {
  return inject<Store>(DATA_STORE_KEY) as Store;
};
