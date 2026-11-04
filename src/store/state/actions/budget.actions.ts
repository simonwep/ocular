import { findBudgetGroupLocation, findBudgetLocation, moveOperation } from './action.helpers.ts';
import { clear } from '@utils/array/array.ts';
import { uuid } from '@utils/uuid/uuid.ts';
import type { ActionOptions } from '@store/state/actions/action.types.ts';
import type { Budget } from '@store/state/types.ts';

export const generateBudget = (name: string) => ({ id: uuid(), name, values: new Array(12).fill(0) });

export const budgetActions = ({ state, budgetGroups, undoFunctions, mutate, currentYear }: ActionOptions) => ({
  getBudget: (id: string) => {
    for (const group of budgetGroups.value) {
      const budget = group.budgets.find((v) => v.id === id);
      if (budget) {
        return [group, budget];
      }
    }
  },

  addBudget: (id: string, name: string) => {
    const budget = generateBudget(name);
    const location = findBudgetGroupLocation(state, currentYear.value, id);
    if (!location) return;

    mutate({ op: 'add', path: `${location.path}/budgets/-`, value: budget });
  },

  setBudget: (id: string, month: number, amount: number) => {
    const location = findBudgetLocation(state, currentYear.value, id);
    if (!location) return;

    clear(undoFunctions);
    mutate({ op: 'replace', path: `${location.budgetPath}/values/${month}`, value: amount });
  },

  fillBudget: (id: string, amount: number, offset = 0) => {
    const year = currentYear.value;
    const location = findBudgetLocation(state, year, id);
    if (!location) return;

    const oldValues = [...location.budget.values];
    const values = [...oldValues];
    values.fill(amount, offset);

    mutate({ op: 'replace', path: `${location.budgetPath}/values`, value: values });

    undoFunctions.push(() => {
      const location = findBudgetLocation(state, year, id);
      if (location) {
        mutate({ op: 'replace', path: `${location.budgetPath}/values`, value: oldValues });
      }
    });
  },

  setBudgetName: (id: string, name: string) => {
    const location = findBudgetLocation(state, currentYear.value, id);
    if (!location) return;

    clear(undoFunctions);
    mutate({ op: 'replace', path: `${location.budgetPath}/name`, value: name });
  },

  removeBudget: (id: string) => {
    const year = currentYear.value;
    const location = findBudgetLocation(state, year, id);
    if (!location) return;

    const removed = JSON.parse(JSON.stringify(location.budget)) as Budget;
    const groupId = location.group.id;

    mutate({ op: 'remove', path: location.budgetPath });

    undoFunctions.push(() => {
      const location = findBudgetGroupLocation(state, year, groupId);
      if (location) {
        mutate({ op: 'add', path: `${location.path}/budgets/-`, value: removed });
      }
    });
  },

  moveBudget: (id: string, target: string, after?: boolean) => {
    const source = findBudgetLocation(state, currentYear.value, id);
    const destination = findBudgetLocation(state, currentYear.value, target);
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
    const source = findBudgetLocation(state, currentYear.value, id);
    const destination = findBudgetGroupLocation(state, currentYear.value, target);
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
