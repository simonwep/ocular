import { ActionOptions } from '@store/state/actions/action.types.ts';
import { BudgetYear } from '@store/state/types.ts';
import { generateBudgetYear } from '@store/state/utils/generators.ts';

export const yearActions = ({ currentYear, undoFunctions, state, budgetYear }: ActionOptions) => ({
  shiftYears: () => {
    if (state.years.length > 1) {
      const item = state.years.shift();

      if (item?.year === currentYear.value) {
        currentYear.value = state.years.at(0)?.year as number;
      }
    }
  },

  changeYear: (year: number) => {
    const data = state.years.find((v) => v.year === year);

    if (!data) {
      state.years.push(generateBudgetYear({ year, source: budgetYear.value }));
      state.years.sort((a, b) => a.year - b.year);
    }

    currentYear.value = year;
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

      undoFunctions.push(() => {
        source.income = income;
        source.expenses = expenses;
      });
    }
  }
});
