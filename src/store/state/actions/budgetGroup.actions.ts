import { findBudgetGroupLocation, moveOperation } from './action.helpers.ts';
import { generateBudget } from '@store/state/actions/budget.actions.ts';
import { clear } from '@utils/array/array.ts';
import { uuid } from '@utils/uuid/uuid.ts';
import type { ActionOptions } from '@store/state/actions/action.types.ts';
import type { BudgetGroup } from '@store/state/types.ts';

type Group = 'expenses' | 'income';

export const budgetGroupActions = ({ state, getBudgetGroup, undoFunctions, mutate, currentYear }: ActionOptions) => ({
  getBudgetGroup: (id: string) => getBudgetGroup(id),

  addBudgetGroup: (target: Group, name: string, budget?: string) => {
    const group = {
      name,
      id: uuid(),
      budgets: budget ? [generateBudget(budget)] : []
    };

    const yearIndex = state.years.findIndex((v) => v.year === currentYear.value);
    if (yearIndex === -1) return;

    mutate({ op: 'add', path: `/years/${yearIndex}/${target}/-`, value: group });
  },

  setBudgetGroupName: (id: string, name: string) => {
    const location = findBudgetGroupLocation(state, currentYear.value, id);
    if (!location) return;

    clear(undoFunctions);
    mutate({ op: 'replace', path: `${location.path}/name`, value: name });
  },

  setBudgetGroups: (target: Group, groups: BudgetGroup[]): void => {
    const yearIndex = state.years.findIndex((v) => v.year === currentYear.value);
    if (yearIndex === -1) return;

    clear(undoFunctions);
    mutate({ op: 'replace', path: `/years/${yearIndex}/${target}`, value: groups });
  },

  toggleBudgetGroupCollapse: (id: string) => {
    const location = findBudgetGroupLocation(state, currentYear.value, id);
    if (!location) return;

    const exists = Object.hasOwn(location.group, 'collapsed');
    const collapsed = !location.group.collapsed;

    mutate({
      op: exists ? 'replace' : 'add',
      path: `${location.path}/collapsed`,
      value: collapsed
    });
  },

  moveBudgetGroup: (id: string, target: string, after?: boolean) => {
    const source = findBudgetGroupLocation(state, currentYear.value, id);
    const destination = findBudgetGroupLocation(state, currentYear.value, target);
    if (!source || !destination || id === target) return;

    mutate(moveOperation(source.listPath, source.index, destination.listPath, destination.index, after));
  },

  removeBudgetGroup: (id: string) => {
    const yearNumber = currentYear.value;
    const yearIndex = state.years.findIndex((v) => v.year === yearNumber);
    const year = state.years[yearIndex];
    if (!year) return;

    const removed: { group: BudgetGroup; target: Group }[] = [];

    const operations = (['expenses', 'income'] as const).flatMap((target) => {
      const index = year[target].findIndex((v) => v.id === id);
      if (index === -1) return [];

      removed.push({
        group: JSON.parse(JSON.stringify(year[target][index])) as BudgetGroup,
        target
      });

      return [{ op: 'remove' as const, path: `/years/${yearIndex}/${target}/${index}` }];
    });

    if (!operations.length) return;

    mutate(...operations);

    if (removed.length) {
      undoFunctions.push(() => {
        const yearIndex = state.years.findIndex((v) => v.year === yearNumber);

        if (yearIndex !== -1) {
          mutate(
            ...removed.map(({ group, target }) => ({
              op: 'add' as const,
              path: `/years/${yearIndex}/${target}/-`,
              value: group
            }))
          );
        }
      });
    }
  }
});
