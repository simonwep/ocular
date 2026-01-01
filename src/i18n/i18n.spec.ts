import cze from './locales/cze.json';
import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import hu from './locales/hu.json';
import id from './locales/id.json';
import it from './locales/it.json';
import pl from './locales/pl.json';
import ptbr from './locales/pt-br.json';
import ru from './locales/ru.json';
import tr from './locales/tr.json';
import { assertEqualLocalizationFiles, getObjectKeyPaths } from '@i18n/i18n.utils.ts';
import { expect, test } from 'vitest';

test('Check that localization files all share the same keys with en.json', () => {
  const localizations: Record<string, typeof en> = { en, de, fr, it, ptbr, cze, hu, pl, ru, es, id, tr };
  assertEqualLocalizationFiles(localizations, 'en');
});

test('Flatten a json object', () => {
  expect(getObjectKeyPaths({ a: 'value1', b: { c: 'value2', d: { e: 'value3' } } })).toEqual(
    new Set(['a', 'b.c', 'b.d.e'])
  );

  expect(getObjectKeyPaths({ a: { b: { c: 'value' } }, d: 'value2' })).toEqual(new Set(['a.b.c', 'd']));
  expect(getObjectKeyPaths({})).toEqual(new Set());
  expect(getObjectKeyPaths({ a: ['value1', 'value2'], b: { c: 'value3' } })).toEqual(
    new Set(['a.[0]', 'a.[1]', 'b.c'])
  );

  expect(getObjectKeyPaths({ a: ['value1', { b: 'value2' }] })).toEqual(new Set(['a.[0]', 'a.[1].b']));
});
