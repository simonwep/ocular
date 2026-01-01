type NestedJsonObject =
  | { [key: string]: string | string[] | NestedJsonObject }
  | string
  | string[]
  | NestedJsonObject[];

export const getObjectKeyPaths = (obj: NestedJsonObject): Set<string> => {
  const keys = new Set<string>();

  const flatten = (currentObj: NestedJsonObject, currentPath?: string) => {
    if (Array.isArray(currentObj)) {
      for (let i = 0; i < currentObj.length; i++) {
        const path = currentPath ? `${currentPath}.[${i}]` : `[${i}]`;
        const value = currentObj[i];

        if (typeof value === 'object') {
          flatten(value, path);
        } else {
          keys.add(path);
        }
      }

      return;
    }

    for (const [key, value] of Object.entries(currentObj)) {
      const keyPath = currentPath ? `${currentPath}.${key}` : key;

      if (typeof value === 'string') {
        keys.add(keyPath);
      } else {
        flatten(value, keyPath);
      }
    }
  };

  flatten(obj);
  return keys;
};

export const assertEqualLocalizationFiles = (translations: Record<string, NestedJsonObject>, baseLocale = 'en') => {
  const transformed = Object.entries(translations).map(([lang, loc]) => [lang, getObjectKeyPaths(loc)] as const);

  const base = transformed.find((v) => v[0] === baseLocale)![1];
  const others = transformed.filter((v) => v[0] !== baseLocale);

  for (const [lang, keys] of others) {
    const difference = base.symmetricDifference(keys);

    if (difference.size) {
      throw new Error(`Localization keys mismatch between en and ${lang}: ${Array.from(difference).join(', ')}`);
    }
  }
};
