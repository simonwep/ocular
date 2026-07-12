import { createAiClient } from './client.ts';
import { logger } from './logger.ts';
import { translate } from './translate.ts';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { LocalizeConfig } from './utils.ts';

const client = createAiClient();

const config = await readFile(resolve(process.cwd(), 'localize.json'), 'utf-8')
  .then((resolve) => JSON.parse(resolve) as LocalizeConfig)
  .catch(() => null);

if (!config) {
  throw new Error('No localize.json found');
}

logger.info(`Found ${config.projects.length} project(s)`);

for (const project of config.projects) {
  await translate({ project, client });
}

await client.close();

logger.info('Done');
