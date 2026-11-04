import { findBudgetGroupLocation, moveOperation } from './action.helpers.ts';
import { generateBudget } from '@store/state/actions/budget.actions.ts';
import { clear } from '@utils/array/array.ts';
import { uuid } from '@utils/uuid/uuid.ts';
import type { ActionOptions } from '@store/state/actions/action.types.ts';
import type { BudgetGroup } from '@store/state/types.ts';

type Group = 'expenses' | 'income';

export const budgetGroupActions = ({ state, stack, mutate, year }: ActionOptions) => ({
  getBudgetGroup: (id: string) => findBudgetGroupLocation(state, year.value, id)?.group,

  addBudgetGroup: (target: Group, name: string, budget?: string) => {
    const group = {
      name,
      id: uuid(),
      budgets: budget ? [generateBudget(budget)] : []
    };

    const yearIndex = state.years.findIndex((v) => v.year === year.value);
    if (yearIndex === -1) return;

    mutate({ op: 'add', path: `/years/${yearIndex}/${target}/-`, value: group });
  },

  setBudgetGroupName: (id: string, name: string) => {
    const location = findBudgetGroupLocation(state, year.value, id);
    if (!location) return;

    clear(stack);
    mutate({ op: 'replace', path: `${location.path}/name`, value: name });
  },

  setBudgetGroups: (target: Group, groups: BudgetGroup[]): void => {
    const yearIndex = state.years.findIndex((v) => v.year === year.value);
    if (yearIndex === -1) return;

    clear(stack);
    mutate({ op: 'replace', path: `/years/${yearIndex}/${target}`, value: groups });
  },

  toggleBudgetGroupCollapse: (id: string) => {
    const location = findBudgetGroupLocation(state, year.value, id);
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
    const source = findBudgetGroupLocation(state, year.value, id);
    const destination = findBudgetGroupLocation(state, year.value, target);
    if (!source || !destination || id === target) return;

    mutate(moveOperation(source.groupPath, source.groupIndex, destination.groupPath, destination.groupIndex, after));
  },

  removeBudgetGroup: (id: string) => {
    const location = findBudgetGroupLocation(state, year.value, id);
    if (!location) return;

    const group = JSON.parse(JSON.stringify(location.group)) as BudgetGroup;

    mutate({ op: 'remove', path: location.path });
    stack.push(() => mutate({ op: 'add', path: location.path, value: group }));
  }
});
