type ClassRecord = Record<string, unknown>;

export type ClassNames = string | undefined | ClassRecord | (string | undefined | boolean | ClassRecord | ClassNames)[];
