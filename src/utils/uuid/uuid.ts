export const uuid = (): string => crypto.randomUUID?.() ?? (Math.random() * 1e17).toString(32);
