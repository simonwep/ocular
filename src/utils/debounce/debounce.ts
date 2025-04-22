/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = <F extends (...args: any[]) => void>(f: F, duration: number): F => {
  let timeout = -1;

  return ((...args: Parameters<F>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => f(...args), duration);
  }) as F;
};
