export const remove = <T>(t: T[], v: T | ((v: T) => boolean)): void => {
  const index = typeof v === 'function' ? t.findIndex((tv) => (v as (v: T) => boolean)(tv)) : t.indexOf(v);
  ~index && t.splice(index, 1);
};
