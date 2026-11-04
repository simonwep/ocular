import { generateBudgetYear } from '@store/state/utils/generators.ts';
import type { ActionOptions } from '@store/state/actions/action.types.ts';
import type { BudgetYear } from '@store/state/types.ts';

export const yearActions = ({ year, stack, state, mutate }: ActionOptions) => ({
  shiftYears: () => {
    if (state.years.length <= 1) return;

    if (state.years[0].year === year.value) {
      year.value = state.years[1].year;
    }

    mutate({ op: 'remove', path: '/years/0' });
  },

  changeYear: (newYear: number) => {
    const existing = state.years.find((v) => v.year === newYear);

    if (existing) {
      year.value = newYear;
      return;
    }

    const source = state.years.find((v) => v.year === year.value);
    if (!source) return;

    const newYearData = generateBudgetYear({ year: newYear, source });
    const index = state.years.findIndex((v) => v.year > newYear);
    const insertionIndex = index === -1 ? state.years.length : index;

    mutate({ op: 'add', path: `/years/${insertionIndex}`, value: newYearData });
    year.value = newYear;
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

    stack.push(() => {
      const index = state.years.findIndex((v) => v.year === data.year);
      if (index === -1) return;

      mutate(
        { op: 'replace', path: `/years/${index}/income`, value: income },
        { op: 'replace', path: `/years/${index}/expenses`, value: expenses }
      );
    });
  }
});
