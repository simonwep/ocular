import { createLogger } from './logger.ts';
import { type Localization, type LocalizeProject, flattenLocalizations, setValueInJson } from './utils.ts';
import { writeFile } from 'fs/promises';
import { glob, readFile } from 'node:fs/promises';
import { resolve, basename } from 'path';
import type { AiClient } from './client.ts';

type TranslationConfig = {
  project: LocalizeProject;
  client: AiClient;
};

type LocalizationFile = {
  path: string;
  locale: string;
  content: Localization;
  keys: Set<string>;
  map: Map<string, string>;
};

export const translate = async ({ project, client }: TranslationConfig) => {
  const logger = createLogger(project.name);

  // Resolve localizations
  const files: LocalizationFile[] = [];
  for await (const file of glob(project.files)) {
    const path = resolve(process.cwd(), file);
    const locale = basename(path).split('.')[0];
    const content = await readFile(path, 'utf-8').then((data) => JSON.parse(data) as Localization);
    const map = flattenLocalizations(content);
    const keys = new Set(map.keys());
    files.push({ path, locale, content, map, keys });
  }

  logger.info(`Found the following localizations for ${project.name}: ${files.map((f) => f.locale).join(', ')}`);

  // Diff base against all other files
  const base = files.find((v) => v.locale === project.base);
  if (!base) throw new Error(`Base localization not found for ${project.name}`);

  const missingKeys = new Set<string>();
  for (const file of files) {
    if (file.locale === project.base) continue;

    for (const key of base.keys.difference(file.keys)) {
      missingKeys.add(key);
    }
  }

  logger.info(`Found ${missingKeys.size} missing keys in ${project.name}: ${[...missingKeys].join(', ')}`);

  const locales = files
    .map((f) => f.locale)
    .filter((l) => l !== project.base)
    .join(', ');

  const prompt = [
    `Translate the following localizations into the target languages (2-letter code): ${locales}`,
    'Respond with a single JSON object with the key being the language and the value the translations.',
    'Respond with nothing else. This is the object to translate:',
    JSON.stringify(Object.fromEntries(Array.from(missingKeys).map((key) => [key, base.map.get(key)!])))
  ].join('. ');

  // Send a message and wait for completion
  const response = await client.send<Record<string, Record<string, string>>>(prompt);

  logger.info(`Translated ${missingKeys.size} keys in ${project.name} (${JSON.stringify(response)})`);

  // Save the translations
  for (const file of files) {
    if (file.locale === project.base) continue;
    const translations = response[file.locale];
    for (const [path, value] of Object.entries(translations)) {
      setValueInJson(file.content, path, value);
    }
  }

  // Write to files
  logger.info(`Saving translations for ${project.name}`);
  for (const file of files) {
    if (file.locale === project.base) continue;
    const translations = JSON.stringify(file.content, null, 2) + '\n';
    await writeFile(file.path, translations, 'utf-8');
  }

  logger.info(`Saved translations for ${project.name}`);
};
