import { createAiClient } from './client.ts';
import { logger } from './logger.ts';
import { translate } from './translate.ts';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { LocalizeConfig } from './utils.ts';

const client = createAiClient();

const config = await readFile(resolve(process.cwd(), 'scripts/localizer/config.json'), 'utf-8')
  .then((data) => JSON.parse(data) as LocalizeConfig)
  .catch(() => null);

if (!config) {
  throw new Error(`No config found at '${resolve(process.cwd(), 'scripts/localizer/config.json')}'`);
}

logger.info(`Found ${config.projects.length} project(s)`);

for (const project of config.projects) {
  await translate({ project, client });
}

await client.close();

logger.info('Done processing all projects, bye');
