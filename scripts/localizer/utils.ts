export type LocalizeProject = {
  name: string;
  base: string;
  files: string;
};

export type LocalizeConfig = {
  projects: LocalizeProject[];
};

export type Localization = { [key: string]: string | Localization };

// Flattens a nested object into a map of keys and values
export const flattenLocalizations = (json: Localization): Map<string, string> => {
  const map = new Map<string, string>();

  for (const [key, value] of Object.entries(json)) {
    if (typeof value === 'object' && value !== null) {
      for (const [subKey, subValue] of flattenLocalizations(value).entries()) {
        map.set(`${key}.${subKey}`, subValue);
      }
    } else if (typeof value === 'string') {
      map.set(key, value);
    }
  }

  return map;
};

// Sets a value in a nested object using a dot-separated path
export const setValueInJson = (localization: Localization, path: string, value: string): void => {
  const keys = path.split('.');
  let current: Localization = localization;

  for (const key of keys.slice(0, -1)) {
    const next = current[key];

    if (next === undefined || next === null) {
      current = current[key] = {};
    } else if (typeof next === 'object' && !Array.isArray(next)) {
      current = current[key] as Localization;
    } else {
      throw new Error(`Invalid path, pointing to non-object: ${path}`);
    }
  }

  current[keys.at(-1)!] = value;
};
