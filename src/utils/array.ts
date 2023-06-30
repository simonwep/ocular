export const subtract = (a: readonly number[], b: readonly number[]) => a.map((value, index) => value - b[index]);

export const add = (...arrays: readonly number[][]) => {
  const sum = new Array(arrays[0]?.length).fill(0);
  arrays.forEach((array) => array.forEach((value, index) => (sum[index] += value)));
  return sum;
};

export const sum = (values: readonly number[]) => values.reduce((a, b) => a + b, 0);

export const average = (values: readonly number[]) => sum(values) / values.length;

export const aggregate = (values: readonly number[]) => values.map((_, index) => sum(values.slice(0, index + 1)));

export const arrayify = <T>(value: T | T[]): T[] => (Array.isArray(value) ? value : [value]);
