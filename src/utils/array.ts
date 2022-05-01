export const subtract = (a: readonly number[], b: readonly number[]) => a.map((value, index) => value - b[index]);

export const sum = (values: readonly number[]) => values.reduce((a, b) => a + b, 0);

export const average = (values: readonly number[]) => sum(values) / values.length;

export const aggregate = (values: readonly number[]) => values.map((_, index) => sum(values.slice(0, index + 1)));
