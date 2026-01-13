import { migrateApplicationState } from './migrator';
import { DataState, DataStates } from './types';
import { generateBudgetYear } from './utils/generators.ts';
import { useTime } from '@composables/time/useTime.ts';
import { AvailableLocale, changeLocale } from '@i18n/index';
import { ActionOptions, UndoFn } from '@store/state/actions/action.types.ts';
import { budgetActions } from '@store/state/actions/budget.actions.ts';
import { budgetGroupActions } from '@store/state/actions/budgetGroup.actions.ts';
import { yearActions } from '@store/state/actions/year.actions.ts';
import { generateTemplateData } from '@store/state/template/generateTemplateData.ts';
import { sumOfBudgetYear } from '@store/state/utils/budgets.ts';
import { useStorage } from '@store/storage/useStorage.ts';
import { sum } from '@utils/array/array.ts';
import { readFile } from '@utils/read-file/readFile.ts';
import { createGlobalState, watchImmediate } from '@vueuse/core';
import { computed, reactive, readonly, shallowReactive, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';

export const useDataStore = createGlobalState(() => {
  const storage = useStorage();
  const currentYear = shallowRef(new Date().getFullYear());
  const undoFunctions = shallowReactive<UndoFn[]>([]);
  const time = useTime();
  const { t } = useI18n();

  const base = migrateApplicationState();
  const state = reactive<DataState>(generateTemplateData(base.currency, base.locale, t));

  const budgetYear = computed(() => state.years.find((v) => v.year === currentYear.value)!);
  const budgetGroups = computed(() => [...budgetYear.value.expenses, ...budgetYear.value.income]);

  const getBudget = (id: string) => budgetGroups.value.flatMap((v) => v.budgets).find((v) => v.id === id);
  const getBudgetGroup = (id: string) => budgetGroups.value.find((v) => v.id === id);

  watchImmediate(
    () => [state.locale, state.currency] as [AvailableLocale, string],
    ([locale, currency]) => changeLocale(locale, { currency })
  );

  storage.sync<DataState, DataStates>({
    name: 'data',
    state: () => state,
    clear: () => {
      Object.assign(state, generateTemplateData(state.currency, state.locale, t));
      currentYear.value = state.years[0].year;
    },
    push: (data) => {
      Object.assign(state, migrateApplicationState(data));

      currentYear.value = state.years.some((v) => v.year === time.year.value)
        ? time.year.value
        : (state.years.at(-1)?.year ?? time.year.value);
    }
  });

  const actionOptions: ActionOptions = {
    state,
    currentYear,
    budgetGroups,
    undoFunctions,
    budgetYear,
    getBudgetGroup,
    getBudget
  };

  return {
    state: readonly({
      get activeYear() {
        return currentYear.value;
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
        return budgetYear.value.expenses;
      },
      get income() {
        return budgetYear.value.income;
      },
      get overallBalance() {
        return sum(state.years.filter((year) => year.year < currentYear.value).map(sumOfBudgetYear));
      },
      get canUndo() {
        return undoFunctions.length > 0;
      }
    }),

    undoLastAction: () => undoFunctions.pop()?.(),

    changeLocale: (locale: AvailableLocale) => (state.locale = locale),

    changeCurrency: (currency: string) => (state.currency = currency),

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

      currentYear.value = state.years.at(-1)!.year;
    },

    ...yearActions(actionOptions),
    ...budgetActions(actionOptions),
    ...budgetGroupActions(actionOptions)
  };
});
