import { ActionOptions } from '@store/state/actions/action.types.ts';
import { clear, moveInArrays, remove } from '@utils/array/array.ts';
import { uuid } from '@utils/uuid/uuid.ts';

export const budgetActions = ({ getBudgetGroup, budgetGroups, getBudget, undoFunctions }: ActionOptions) => ({
  getBudget: (id: string) => {
    for (const group of budgetGroups.value) {
      const budget = group.budgets.find((v) => v.id === id);
      if (budget) {
        return [group, budget];
      }
    }
  },

  addBudget: (id: string, name: string) => {
    getBudgetGroup(id)?.budgets.push({ id: uuid(), name, values: new Array(12).fill(0) });
  },

  setBudget: (id: string, month: number, amount: number) => {
    const group = getBudget(id);

    if (group) {
      group.values[month] = amount;
      clear(undoFunctions);
    }
  },

  fillBudget: (id: string, amount: number, offset = 0) => {
    const group = getBudget(id);
    const oldValues = [...(group?.values ?? [])];
    group?.values.fill(amount, offset);

    undoFunctions.push(() => {
      if (group) {
        group.values = oldValues;
      }
    });
  },

  setBudgetName: (id: string, name: string) => {
    const group = getBudget(id);

    if (group) {
      group.name = name;
      clear(undoFunctions);
    }
  },

  removeBudget: (id: string) => {
    const allGroups = budgetGroups.value;
    const targetGroup = allGroups.find((g) => g.budgets.find((v) => v.id === id));
    const oldBudget = remove(targetGroup?.budgets ?? [], (v) => v.id === id);

    undoFunctions.push(() => {
      if (oldBudget && targetGroup) {
        targetGroup.budgets.push(oldBudget);
      }
    });
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
  }
});
