import { type AssistantMessageEvent, CopilotClient } from '@github/copilot-sdk';

export type AiClient = ReturnType<typeof createAiClient>;

const client = new CopilotClient();
await client.start();

// We can't import CopilotSession as prettier, and ESLint keep fixing themselse in an infinite loop
let session: Awaited<ReturnType<typeof client.createSession>> | undefined;

export const createAiClient = () => ({
  close: async () => {
    if (session) {
      await session.disconnect();
      await client.deleteSession(session.sessionId);
    }

    await client.stop();
  },
  send: async <T>(prompt: string) => {
    const { promise, reject, resolve } = Promise.withResolvers<T>();

    session ??= await client.createSession({
      model: 'gpt-5.4-mini',
      reasoningEffort: 'low',
      enableSkills: false,
      enableCitations: false,
      enableFileHooks: false,
      enableMcpApps: false,
      enableSessionTelemetry: false,
      enableSessionStore: false,
      enableHostGitOperations: false,
      enableConfigDiscovery: false,
      enableOnDemandInstructionDiscovery: false
    });

    const onMessage = (event: AssistantMessageEvent) => {
      try {
        resolve(JSON.parse(event.data.content) as T);
      } catch (err) {
        reject(err);
      }
    };

    const unsubscriber = [session.on('assistant.message', onMessage), session.on('session.error', reject)];

    await Promise.all([session.send({ prompt }), promise]);
    unsubscriber.forEach((unsub) => unsub());

    return promise;
  }
});
