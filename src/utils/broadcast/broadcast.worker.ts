const ports = new Set<MessagePort>();

self.addEventListener('connect', (event: Event) => {
  const port = (event as MessageEvent).ports[0] as MessagePort | undefined;
  if (!port) return;

  ports.add(port);

  port.start();

  port.addEventListener('messageerror', (errorEvent: MessageEvent) => {
    port.postMessage({ type: 'log', payload: `Message error: ${errorEvent.data}` });
  });

  port.addEventListener('message', (messageEvent: MessageEvent) => {
    port.postMessage({ type: 'log', payload: `Broadcasting to ${ports.size} ports` });

    if (messageEvent.data.type === 'disconnect') {
      ports.delete(port);
      port.close();
      return;
    }

    for (const connectedPort of ports) {
      if (connectedPort !== port) {
        connectedPort.postMessage(messageEvent.data);
      }
    }
  });
});
