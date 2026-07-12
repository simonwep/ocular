import { CopilotClient } from '@github/copilot-sdk';

export type AiClient = ReturnType<typeof createAiClient>;

const client = new CopilotClient();
await client.start();

const session = await client.createSession({
  model: 'gpt-5-mini',
  enableSkills: false,
  enableCitations: false,
  enableFileHooks: false,
  enableMcpApps: false,
  enableSessionTelemetry: false,
  reasoningEffort: 'low'
});

export const createAiClient = () => ({
  close: () => client.stop(),
  send: async <T>(prompt: string) =>
    new Promise<T>((resolve) => {
      session.on('assistant.message', (event) => resolve(JSON.parse(event.data.content)));
      void session.send({ prompt });
    })
});
