/* eslint-disable no-console */
export const createLogger = (name: string) => {
  const log = (type: 'info' | 'log' | 'error', msg: string, color: string, ...data: unknown[]) => {
    console[type](`%c[${name.toUpperCase()}] ${msg}`, [`color: ${color}`].join(';'), ...data);
  };

  return {
    info: (msg: string) => log('info', msg, '#3c91ff'),
    success: (msg: string) => log('log', msg, '#4bff81'),
    error: (msg: string, error: Error) => log('error', msg, '#ff5757', error)
  };
};
