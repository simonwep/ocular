export const sum = (values: readonly number[]) =>
    values.reduce((a, b) => a + b, 0);

export const average = (values: readonly number[]) =>
    sum(values) / values.length;
