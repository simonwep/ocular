import { migrateApplicationState } from './migrator';
import { BudgetGroup, BudgetYear, DataState, DataStates } from './types';
import { generateBudgetYear } from './utils/generators.ts';
import { useTime } from '@composables/time/useTime.ts';
import { AvailableLocale, changeLocale } from '@i18n/index';
import { Storage, useStorage } from '@storage/index';
import { finalBalance } from '@store/state/utils/budgets.ts';
import { clear, moveInArrays, remove, sum } from '@utils/array/array.ts';
import { readFile } from '@utils/read-file/readFile.ts';
import { uuid } from '@utils/uuid/uuid.ts';
import { createGlobalState, watchImmediate } from '@vueuse/core';
import { computed, reactive, readonly, shallowReactive, shallowRef } from 'vue';

type Group = 'expenses' | 'income';

type UndoActionFn = () => void;

export const createDataStore = (storage?: Storage) => {
  const activeYear = shallowRef(new Date().getFullYear());
  const undoActions = shallowReactive<UndoActionFn[]>([]);
  const state = reactive<DataState>(migrateApplicationState());
  const time = useTime();

  const currentYear = computed(() => state.years.find((v) => v.year === activeYear.value)!);
  const budgetGroups = computed(() => [...currentYear.value.expenses, ...currentYear.value.income]);

  const getBudget = (id: string) => budgetGroups.value.flatMap((v) => v.budgets).find((v) => v.id === id);
  const getBudgetGroup = (id: string) => budgetGroups.value.find((v) => v.id === id);

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
        return currentYear.value.expenses;
      },
      get income() {
        return currentYear.value.income;
      },
      get overallBalance() {
        return sum(state.years.filter((year) => year.year < activeYear.value).map(finalBalance));
      },
      get canUndo() {
        return undoActions.length > 0;
      }
    }),

    undoLastAction: () => undoActions.pop()?.(),

    serialize: (): string => JSON.stringify(state),

    deserialize: async (data: File | DataStates) => {
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
        state.years.push(generateBudgetYear({ year, source: currentYear.value }));
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
        const { income, expenses } = source;
        source.income = data.income;
        source.expenses = data.expenses;

        undoActions.push(() => {
          source.income = income;
          source.expenses = expenses;
        });
      }
    },

    changeLocale: (locale: AvailableLocale) => {
      state.locale = locale;
    },

    changeCurrency: (currency: string) => {
      state.currency = currency;
    },

    setBudgetGroups: (target: Group, groups: BudgetGroup[]): void => {
      currentYear.value[target] = groups;
      clear(undoActions);
    },

    setBudgetGroupName: (id: string, name: string) => {
      const group = getBudgetGroup(id);

      if (group) {
        group.name = name;
        clear(undoActions);
      }
    },

    setBudgetName: (id: string, name: string) => {
      const group = getBudget(id);

      if (group) {
        group.name = name;
        clear(undoActions);
      }
    },

    setBudget: (id: string, month: number, amount: number) => {
      const group = getBudget(id);

      if (group) {
        group.values[month] = amount;
        clear(undoActions);
      }
    },

    fillBudget: (id: string, amount: number, offset = 0) => {
      const group = getBudget(id);
      const oldValues = [...(group?.values ?? [])];
      group?.values.fill(amount, offset);

      undoActions.push(() => {
        if (group) {
          group.values = oldValues;
        }
      });
    },

    removeBudget: (id: string) => {
      const allGroups = budgetGroups.value;
      const targetGroup = allGroups.find((g) => g.budgets.find((v) => v.id === id));
      const oldBudget = remove(targetGroup?.budgets ?? [], (v) => v.id === id);

      undoActions.push(() => {
        if (oldBudget && targetGroup) {
          targetGroup.budgets.push(oldBudget);
        }
      });
    },

    removeBudgetGroup: (id: string) => {
      const year = currentYear.value;
      const expenseGroup = remove(year.expenses, (v) => v.id === id);
      const incomeGroup = remove(year.income, (v) => v.id === id);

      undoActions.push(() => {
        if (expenseGroup) {
          year.expenses.push(expenseGroup);
        }
        if (incomeGroup) {
          year.income.push(incomeGroup);
        }
      });
    },

    toggleBudgetGroupCollapse: (id: string) => {
      const group = getBudgetGroup(id);

      if (group) {
        group.collapsed = !group.collapsed;
      }
    },

    addBudget: (id: string, name: string) => {
      getBudgetGroup(id)?.budgets.push({ id: uuid(), name, values: new Array(12).fill(0) });
    },

    addBudgetGroup: (target: Group, name: string) => {
      currentYear.value[target].push({ id: uuid(), name, budgets: [] });
    },

    moveBudget: (id: string, target: string, after?: boolean) => {
      const budgets = budgetGroups.value.map((v) => v.budgets);
      moveInArrays(budgets, id, target, after);
    },

    moveBudgetIntoGroup: (id: string, target: string) => {
      const sourceGroup = getBudgetGroup(id);
      const budgetIndex = sourceGroup?.budgets.findIndex((v) => v.id === id) ?? -1;
      const targetGroup = getBudgetGroup(target);

      if (targetGroup && sourceGroup && budgetIndex !== -1) {
        targetGroup.budgets.push(...sourceGroup.budgets.splice(budgetIndex, 1));
      }
    },

    moveBudgetGroup: (id: string, target: string, after?: boolean) => {
      const { income, expenses } = currentYear.value;
      moveInArrays([income, expenses], id, target, after);
    },

    getBudget: (id: string) => {
      for (const group of budgetGroups.value) {
        const budget = group.budgets.find((v) => v.id === id);
        if (budget) {
          return [group, budget];
        }
      }
    },

    getBudgetGroup: (id: string) => getBudgetGroup(id)
  };
};

export const useDataStore = createGlobalState(() => createDataStore(useStorage()));
