import { generateBudgetYear } from '@store/state/utils/generators.ts';
import type { ActionOptions } from '@store/state/actions/action.types.ts';
import type { BudgetYear } from '@store/state/types.ts';

export const yearActions = ({ currentYear, undoFunctions, state, mutate, budgetYear }: ActionOptions) => ({
  shiftYears: () => {
    if (state.years.length <= 1) return;

    if (state.years[0].year === currentYear.value) {
      currentYear.value = state.years[1].year;
    }

    mutate({ op: 'remove', path: '/years/0' });
  },

  changeYear: (year: number) => {
    const existing = state.years.find((v) => v.year === year);
    if (existing) {
      currentYear.value = year;
      return;
    }

    const source = state.years.find((v) => v.year === currentYear.value) ?? budgetYear.value;
    const newYear = generateBudgetYear({ year, source });
    const index = state.years.findIndex((v) => v.year > year);
    const insertionIndex = index === -1 ? state.years.length : index;

    mutate({ op: 'add', path: `/years/${insertionIndex}`, value: newYear });
    currentYear.value = year;
  },

  upsertYear: (data: BudgetYear) => {
    const yearIndex = state.years.findIndex((v) => v.year === data.year);

    if (yearIndex === -1) {
      const index = state.years.findIndex((v) => v.year > data.year);
      const insertionIndex = index === -1 ? state.years.length : index;
      return mutate({ op: 'add', path: `/years/${insertionIndex}`, value: data });
    }

    const { income, expenses } = state.years[yearIndex];
    mutate(
      { op: 'replace', path: `/years/${yearIndex}/income`, value: data.income },
      { op: 'replace', path: `/years/${yearIndex}/expenses`, value: data.expenses }
    );

    undoFunctions.push(() => {
      const index = state.years.findIndex((v) => v.year === data.year);
      if (index === -1) return;

      mutate(
        { op: 'replace', path: `/years/${index}/income`, value: income },
        { op: 'replace', path: `/years/${index}/expenses`, value: expenses }
      );
    });
  }
});
