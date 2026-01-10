import { ActionOptions } from '@store/state/actions/action.types.ts';
import { BudgetGroup } from '@store/state/types.ts';
import { clear, moveInArrays, remove } from '@utils/array/array.ts';
import { uuid } from '@utils/uuid/uuid.ts';

type Group = 'expenses' | 'income';

export const budgetGroupActions = ({ getBudgetGroup, budgetYear, undoFunctions }: ActionOptions) => ({
  getBudgetGroup: (id: string) => getBudgetGroup(id),

  addBudgetGroup: (target: Group, name: string) => {
    budgetYear.value[target].push({ id: uuid(), name, budgets: [] });
  },

  setBudgetGroupName: (id: string, name: string) => {
    const group = getBudgetGroup(id);

    if (group) {
      group.name = name;
      clear(undoFunctions);
    }
  },

  setBudgetGroups: (target: Group, groups: BudgetGroup[]): void => {
    budgetYear.value[target] = groups;
    clear(undoFunctions);
  },

  toggleBudgetGroupCollapse: (id: string) => {
    const group = getBudgetGroup(id);

    if (group) {
      group.collapsed = !group.collapsed;
    }
  },

  moveBudgetGroup: (id: string, target: string, after?: boolean) => {
    const { income, expenses } = budgetYear.value;
    moveInArrays([income, expenses], id, target, after);
  },

  removeBudgetGroup: (id: string) => {
    const year = budgetYear.value;
    const expenseGroup = remove(year.expenses, (v) => v.id === id);
    const incomeGroup = remove(year.income, (v) => v.id === id);

    undoFunctions.push(() => {
      if (expenseGroup) {
        year.expenses.push(expenseGroup);
      }
      if (incomeGroup) {
        year.income.push(incomeGroup);
      }
    });
  }
});
