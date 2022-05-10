/* eslint-disable no-console */
export const createLogger = (name: string) => {
  const log = (msg: string, color: string) => {
    console.log(`%c[${name.toUpperCase()}] ${msg}`, [`color: ${color}`].join(';'));
  };

  return {
    info: (msg: string) => log(msg, '#3c91ff'),
    success: (msg: string) => log(msg, '#4bff81'),
    error(msg: string, error: Error) {
      log(msg, '#ff5757');
      console.error(error);
    }
  };
};
