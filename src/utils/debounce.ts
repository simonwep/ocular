/* eslint-disable @typescript-eslint/no-explicit-any */
export const debounce = <F extends (...args: any[]) => void>(f: F, duration: number): F => {
  let lastArgs: Parameters<F>;
  let timeout = -1;
  let active = false;

  return ((...args: Parameters<F>) => {
    lastArgs = args;

    if (active) return;
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      active = true;
      await f(...lastArgs);
      active = false;
    }, duration) as unknown as number;
  }) as F;
};
