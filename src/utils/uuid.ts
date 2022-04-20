export const uuid = (): string => {
  return crypto.randomUUID?.() ?? (Math.random() * 1e17).toString(32);
};
