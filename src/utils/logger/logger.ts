const loggerColors = [
  '#3c91ff', // blue
  '#4bff81', // green
  '#ff5757', // red
  '#ffb347', // orange
  '#9d4edd', // purple
  '#f72585', // pink
  '#00b4d8' // cyan
];

/* eslint-disable no-console */
export const createLogger = (name: string) => {
  const color = loggerColors.pop() ?? '#3c91ff';

  const log = (type: 'info' | 'log' | 'error', msg: string, ...data: unknown[]) => {
    const typeColor = type === 'error' ? '#ff5757' : type === 'log' ? '#4bff81' : '#3c91ff';
    const output = `%c${type.toUpperCase()}%c ${name.toUpperCase()} %c${msg}`;

    const styles = [`color: ${typeColor}; font-weight: 700`, `color: ${color}; font-weight: 600`, 'color: inherit'];

    console.log(output, ...styles, ...data);
  };

  return {
    info: (msg: string) => log('info', msg),
    success: (msg: string) => log('log', msg),
    error: (msg: string, error: unknown) => log('error', msg, error)
  };
};
