import { findBudgetGroupLocation, findBudgetLocation, moveOperation } from './action.helpers.ts';
import { clear } from '@utils/array/array.ts';
import { uuid } from '@utils/uuid/uuid.ts';
import type { ActionOptions } from '@store/state/actions/action.types.ts';
import type { Budget } from '@store/state/types.ts';

export const generateBudget = (name: string) => ({ id: uuid(), name, values: new Array(12).fill(0) });

export const budgetActions = ({ state, stack, mutate, year }: ActionOptions) => ({
  getBudget: (id: string) => {
    const location = findBudgetLocation(state, year.value, id);

    if (location) {
      return [location.group, location.budget];
    }
  },

  addBudget: (id: string, name: string) => {
    const budget = generateBudget(name);
    const location = findBudgetGroupLocation(state, year.value, id);
    if (!location) return;

    mutate({ op: 'add', path: `${location.path}/budgets/-`, value: budget });
  },

  setBudget: (id: string, month: number, amount: number) => {
    const location = findBudgetLocation(state, year.value, id);
    if (!location) return;

    clear(stack);
    mutate({ op: 'replace', path: `${location.budgetPath}/values/${month}`, value: amount });
  },

  fillBudget: (id: string, amount: number, offset = 0) => {
    const location = findBudgetLocation(state, year.value, id);
    if (!location) return;

    const budget = [...location.budget.values];
    const newValues = [...budget];
    newValues.fill(amount, offset);

    mutate({ op: 'replace', path: `${location.budgetPath}/values`, value: newValues });

    stack.push(() => {
      const location = findBudgetLocation(state, year.value, id);

      if (location) {
        mutate({ op: 'replace', path: `${location.budgetPath}/values`, value: budget });
      }
    });
  },

  setBudgetName: (id: string, name: string) => {
    const location = findBudgetLocation(state, year.value, id);
    if (!location) return;

    clear(stack);
    mutate({ op: 'replace', path: `${location.budgetPath}/name`, value: name });
  },

  removeBudget: (id: string) => {
    const location = findBudgetLocation(state, year.value, id);
    if (!location) return;

    const budget = JSON.parse(JSON.stringify(location.budget)) as Budget;

    mutate({ op: 'remove', path: location.budgetPath });
    stack.push(() => mutate({ op: 'add', path: location.budgetPath, value: budget }));
  },

  moveBudget: (id: string, target: string, after?: boolean) => {
    const source = findBudgetLocation(state, year.value, id);
    const destination = findBudgetLocation(state, year.value, target);
    if (!source || !destination || id === target) return;

    mutate(
      moveOperation(
        `${source.path}/budgets`,
        source.budgetIndex,
        `${destination.path}/budgets`,
        destination.budgetIndex,
        after
      )
    );
  },

  moveBudgetIntoGroup: (id: string, target: string) => {
    const source = findBudgetLocation(state, year.value, id);
    const destination = findBudgetGroupLocation(state, year.value, target);
    if (!source || !destination) return;

    mutate(
      moveOperation(
        `${source.path}/budgets`,
        source.budgetIndex,
        `${destination.path}/budgets`,
        destination.group.budgets.length
      )
    );
  }
});
