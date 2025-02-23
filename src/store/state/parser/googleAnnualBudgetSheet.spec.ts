import { convertGoogleAnnualBudgetCSVToBudgetGroups } from './googleAnnualBudgetSheet';
import { it, expect } from 'vitest';

const csv = `,,,,,,,,,,,,,,,,
,,Income,Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec,Total,Average
Wages,,Monthly totals:,£57,£68,£87,£68,£69,£0,£347,£33,£0,£2,£344,£3,"£1,078",£90
,,Pay slip,£23,£34,£53,£34,£35,,£324,,,,,,£503,£84
,,Tips,£34,£34,£34,£34,£34,,£23,£33,,£2,£344,£3,£575,£58
,,Bonus,,,,,,,,,,,,,£0,£0
,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,
Other,,Monthly totals:,£334,£34,£44,£35,£433,£2,£234,£2,£34,£234,£34,£34,"£1,454",£121
,,Transfer from savings,,,,,,,,,,,,,£0,£0
,,Interest income,,,,£3,,,,,,,,,£3,£3
,,Dividends,£334,£34,£44,£32,£433,£2,£234,£2,£34,£234,£34,£34,"£1,451",£121`;

it('convert CSV to budget groups', () => {
  const result = convertGoogleAnnualBudgetCSVToBudgetGroups(csv);

  expect(result.length).toBe(2);

  expect(result[0].name).toBe('Wages');
  expect(result[0].budgets.length).toBe(3);
  expect(result[0].budgets[0].name).toBe('Pay slip');
  expect(result[0].budgets[0].values).toStrictEqual([23, 34, 53, 34, 35, 0, 324, 0, 0, 0, 0, 0]);
  expect(result[0].budgets[1].name).toBe('Tips');
  expect(result[0].budgets[1].values).toStrictEqual([34, 34, 34, 34, 34, 0, 23, 33, 0, 2, 344, 3]);
  expect(result[0].budgets[2].name).toBe('Bonus');
  expect(result[0].budgets[2].values).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  expect(result[1].name).toBe('Other');
  expect(result[1].budgets.length).toBe(3);
  expect(result[1].budgets[0].name).toBe('Transfer from savings');
  expect(result[1].budgets[0].values).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  expect(result[1].budgets[1].name).toBe('Interest income');
  expect(result[1].budgets[1].values).toStrictEqual([0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0]);
  expect(result[1].budgets[2].name).toBe('Dividends');
  expect(result[1].budgets[2].values).toStrictEqual([334, 34, 44, 32, 433, 2, 234, 2, 34, 234, 34, 34]);
});
