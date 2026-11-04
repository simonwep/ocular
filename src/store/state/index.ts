import { migrateApplicationState } from './migrator';
import { generateBudgetYear } from './utils/generators.ts';
import { useTime } from '@composables/time/useTime.ts';
import { changeLocale } from '@i18n/index';
import { budgetActions } from '@store/state/actions/budget.actions.ts';
import { budgetGroupActions } from '@store/state/actions/budgetGroup.actions.ts';
import { yearActions } from '@store/state/actions/year.actions.ts';
import { generateTemplateData } from '@store/state/template/generateTemplateData.ts';
import { sumOfBudgetYear } from '@store/state/utils/budgets.ts';
import { useStorage } from '@store/storage/useStorage.ts';
import { sum } from '@utils/array/array.ts';
import { readFile } from '@utils/read-file/readFile.ts';
import { createGlobalState, watchImmediate } from '@vueuse/core';
import { computed, readonly, shallowReactive, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DataState, DataStates } from './types';
import type { AvailableLocale } from '@i18n/index';
import type { ActionOptions, UndoFn } from '@store/state/actions/action.types.ts';

export const useDataStore = createGlobalState(() => {
  const storage = useStorage();
  const currentYear = shallowRef(new Date().getFullYear());
  const undoFunctions = shallowReactive<UndoFn[]>([]);
  const time = useTime();
  const { t } = useI18n();

  const base = migrateApplicationState();

  const { mutate, replace, state } = storage.sync<DataState, DataStates>({
    key: 'data',
    init: generateTemplateData(base.currency, base.locale, t),
    migrate: migrateApplicationState
  });

  const budgetYear = computed(() => state.years.find((v) => v.year === currentYear.value)!);
  const budgetGroups = computed(() => [...budgetYear.value.expenses, ...budgetYear.value.income]);

  const getBudget = (id: string) => budgetGroups.value.flatMap((v) => v.budgets).find((v) => v.id === id);
  const getBudgetGroup = (id: string) => budgetGroups.value.find((v) => v.id === id);

  watchImmediate(
    () => [state.locale, state.currency] as [AvailableLocale, string],
    ([locale, currency]) => changeLocale(locale, { currency })
  );

  watchImmediate(
    () => state.years.map((year) => year.year),
    (years) => {
      if (!years.includes(currentYear.value)) {
        currentYear.value = years.includes(time.year.value) ? time.year.value : (years.at(-1) ?? time.year.value);
      }
    }
  );

  const actionOptions: ActionOptions = {
    state,
    currentYear,
    budgetGroups,
    undoFunctions,
    mutate,
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
      get endingBalance() {
        return sumOfBudgetYear(budgetYear.value);
      },
      get overallBalance() {
        return sum(state.years.filter((year) => year.year < currentYear.value).map(sumOfBudgetYear));
      },
      get canUndo() {
        return undoFunctions.length > 0;
      }
    }),

    undoLastAction: () => undoFunctions.pop()?.(),

    changeLocale: (locale: AvailableLocale) => mutate({ op: 'replace', path: '/locale', value: locale }),

    changeCurrency: (currency: string) => mutate({ op: 'replace', path: '/currency', value: currency }),

    serialize: (): string => JSON.stringify(state),

    deserialize: async (data: File | DataStates) => {
      let migrated: DataState;

      if (data instanceof File) {
        migrated = await readFile(data)
          .then(JSON.parse)
          .then((content: DataStates) => migrateApplicationState(content));
      } else {
        migrated = migrateApplicationState(data);
      }

      const imported: DataState = {
        ...migrated,
        years: migrated.years.length ? migrated.years : [generateBudgetYear({ year: time.year.value })]
      };

      replace(imported);
      currentYear.value = imported.years.at(-1)!.year;
    },

    ...yearActions(actionOptions),
    ...budgetActions(actionOptions),
    ...budgetGroupActions(actionOptions)
  };
});
