import { migrateApplicationState } from './migrator';
import { Budget, BudgetGroup, BudgetYear, DataState, DataStates } from './types';
import { generateBudgetYear } from './utils/generators.ts';
import { useTime } from '@composables/time/useTime.ts';
import { AvailableLocale, changeLocale } from '@i18n/index';
import { Storage, useStorage } from '@storage/index';
import { finalBalance } from '@store/state/utils/budgets.ts';
import { moveInArrays, remove, sum } from '@utils/array/array.ts';
import { readFile } from '@utils/read-file/readFile.ts';
import { uuid } from '@utils/uuid/uuid.ts';
import { createGlobalState, watchImmediate } from '@vueuse/core';
import { reactive, readonly, shallowRef } from 'vue';

type Group = 'expenses' | 'income';

export const createDataStore = (storage?: Storage) => {
  const activeYear = shallowRef(new Date().getFullYear());
  const state = reactive<DataState>(migrateApplicationState());
  const time = useTime();

  const getCurrentYear = () => state.years.find((v) => v.year === activeYear.value) as BudgetYear;

  const groups = () => {
    const currentYear = getCurrentYear();
    return [...currentYear.expenses, ...currentYear.income];
  };

  watchImmediate(
    () => [state.locale, state.currency] as [AvailableLocale, string],
    ([locale, currency]) => changeLocale(locale, { currency })
  );

  storage?.sync<DataState, DataStates>({
    name: 'data',
    state: () => state,
    clear: () => Object.assign(state, migrateApplicationState()),
    push: (data) => {
      Object.assign(state, migrateApplicationState(data));

      activeYear.value = state.years.some((v) => v.year === time.year.value)
        ? time.year.value
        : (state.years.at(-1)?.year ?? time.year.value);
    }
  });

  return {
    state: readonly({
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
      },
      get overallBalance() {
        return sum(state.years.filter((year) => year.year < activeYear.value).map(finalBalance));
      }
    }),

    serialize: (): string => JSON.stringify(state),

    deserialize: async (data: File | DataState) => {
      if (data instanceof File) {
        await readFile(data)
          .then(JSON.parse)
          .then((content: DataStates) => Object.assign(state, migrateApplicationState(content)));
      } else {
        Object.assign(state, migrateApplicationState(data));
      }

      if (!state.years.length) {
        state.years.push(generateBudgetYear({ year: time.year.value }));
      }

      activeYear.value = state.years.at(-1)!.year;
    },

    shiftYears: () => {
      if (state.years.length > 1) {
        const item = state.years.shift();

        if (item?.year === activeYear.value) {
          activeYear.value = state.years.at(0)?.year as number;
        }
      }
    },

    changeYear: (year: number) => {
      const data = state.years.find((v) => v.year === year);

      if (!data) {
        state.years.push(generateBudgetYear({ year, source: getCurrentYear() }));
        state.years.sort((a, b) => a.year - b.year);
      }

      activeYear.value = year;
    },

    upsertYear: (data: BudgetYear) => {
      const source = state.years.find((v) => v.year === data.year);

      if (!source) {
        state.years.push(data);
        state.years.sort((a, b) => a.year - b.year);
      } else {
        source.income = data.income;
        source.expenses = data.expenses;
      }
    },

    changeLocale: (locale: AvailableLocale) => {
      state.locale = locale;
    },

    changeCurrency: (currency: string) => {
      state.currency = currency;
    },

    setBudgetGroups: (target: Group, groups: BudgetGroup[]): void => {
      getCurrentYear()[target] = groups;
    },

    setBudgetGroupName: (id: string, name: string) => {
      const group = groups().find((v) => v.id === id);

      if (group) {
        group.name = name;
      }
    },

    setBudgetName: (id: string, name: string) => {
      const group = groups()
        .flatMap((v) => v.budgets)
        .find((v) => v.id === id);

      if (group) {
        group.name = name;
      }
    },

    setBudget: (id: string, month: number, amount: number) => {
      const group = groups()
        .flatMap((v) => v.budgets)
        .find((v) => v.id === id);

      if (group) {
        group.values[month] = amount;
      }
    },

    fillBudget: (id: string, amount: number, offset = 0) => {
      groups()
        .flatMap((v) => v.budgets)
        .find((v) => v.id === id)
        ?.values.fill(amount, offset);
    },

    removeBudget: (id: string) => {
      groups().forEach(({ budgets }) => remove<Budget>(budgets, (v) => v.id === id));
    },

    removeBudgetGroup: (id: string) => {
      remove<BudgetGroup>(getCurrentYear().expenses, (v) => v.id === id);
      remove<BudgetGroup>(getCurrentYear().income, (v) => v.id === id);
    },

    toggleBudgetGroupCollapse: (id: string) => {
      const group = groups().find((v) => v.id === id);

      if (group) {
        group.collapsed = !group.collapsed;
      }
    },

    addBudget: (id: string, name: string) => {
      groups()
        .find((v) => v.id === id)
        ?.budgets.push({ id: uuid(), name, values: new Array(12).fill(0) });
    },

    addBudgetGroup: (target: Group, name: string) => {
      getCurrentYear()[target].push({ id: uuid(), name, budgets: [] });
    },

    moveBudget: (id: string, target: string, after?: boolean) => {
      const budgets = groups().map((v) => v.budgets);
      moveInArrays(budgets, id, target, after);
    },

    moveBudgetIntoGroup: (id: string, target: string) => {
      const allGroups = groups();
      const sourceGroup = allGroups.find((g) => g.budgets.find((v) => v.id === id));
      const budgetIndex = sourceGroup?.budgets.findIndex((v) => v.id === id) ?? -1;
      const targetGroup = allGroups.find((g) => g.id === target);

      if (targetGroup && sourceGroup && budgetIndex !== -1) {
        targetGroup.budgets.push(...sourceGroup.budgets.splice(budgetIndex, 1));
      }
    },

    moveBudgetGroup: (id: string, target: string, after?: boolean) => {
      const { income, expenses } = getCurrentYear();
      moveInArrays([income, expenses], id, target, after);
    },

    getBudget: (id: string) => {
      for (const group of groups()) {
        const budget = group.budgets.find((v) => v.id === id);
        if (budget) return [group, budget];
      }
    },

    getBudgetGroup: (id: string) => groups().find((v) => v.id === id)
  };
};

export const useDataStore = createGlobalState(() => createDataStore(useStorage()));
