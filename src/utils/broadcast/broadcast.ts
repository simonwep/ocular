import BroadcastWorker from './broadcast.worker.ts?sharedworker';
import { createLogger } from '@utils/logger/logger.ts';

type BroadcastLogMessage = { type: 'log'; payload: string };

export const createBroadcastChannel = <TMessages extends { type: string; payload: unknown }>(name: string) => {
  const logger = createLogger(`broadcast-${name}`);

  const workerListeners = new Set<(message: TMessages) => void>();
  const worker = new BroadcastWorker({ name });

  worker.port.start();

  worker.port.addEventListener('messageerror', (event) =>
    logger.error('Failed to deserialize a worker message', event)
  );

  worker.port.addEventListener('message', (event) => {
    const message = event.data as TMessages | BroadcastLogMessage;

    if (message.type === 'log') {
      logger.info((message as BroadcastLogMessage).payload);
    } else {
      workerListeners.forEach((listener) => listener(message as TMessages));
    }
  });

  const onMessage = (listener: (message: TMessages) => void) => {
    workerListeners.add(listener);
  };

  const on = <Key extends TMessages['type']>(
    type: Key,
    listener: (message: Extract<TMessages, { type: Key }>) => void
  ) => {
    workerListeners.add((message) => {
      if (message.type === type) {
        listener(message as Extract<TMessages, { type: Key }>);
      }
    });
  };

  const send = (message: TMessages) => {
    worker.port.postMessage(message);
  };

  window.addEventListener('beforeunload', () => {
    logger.info('Closing broadcast channel');
    worker.port.postMessage({ type: 'disconnect' });
  });

  return { onMessage, on, send };
};
