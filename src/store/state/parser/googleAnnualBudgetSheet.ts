import { uuid } from '@utils';
import { parse } from 'papaparse';
import { BudgetGroup } from '../types';

export const convertGoogleAnnualBudgetCSVToBudgetGroups = (csv: string): BudgetGroup[] => {
  const groups: BudgetGroup[] = [];
  const rows = parse(csv, {
    skipEmptyLines: 'greedy'
  }).data as string[];

  rows.shift(); // Ignore header

  let budgetGroup: BudgetGroup | undefined;
  for (let i = 0; i < rows.length; i++) {
    const [group, , header, ...values] = rows[i];

    if (group) {
      budgetGroup = { budgets: [], id: uuid(), name: group };
      groups.push(budgetGroup);
    } else if (header && budgetGroup) {
      const parsed = values
        .map((v) => v.replace(/[^\d]/g, ''))
        .map(Number)
        .slice(0, 12); // Remove total and average

      budgetGroup.budgets.push({
        id: uuid(),
        name: header.trim(),
        values: parsed
      });
    }
  }

  return groups;
};
