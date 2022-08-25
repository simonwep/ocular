import { createLogger } from '@utils';

export interface MigratableState<V extends number = number> {
  version: V;
}

interface Migration<FS extends MigratableState, TS extends MigratableState> {
  from: FS['version'];
  to: TS['version'];
  migrate(from: FS): TS;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
type ExtractFinalState<M extends Migration<any, any>[]> = {
  [K in keyof M as '0']: ReturnType<M[K]['migrate']>[0];
}['0'];

/* eslint-disable @typescript-eslint/no-explicit-any */
type ExtractFromStates<M extends Migration<any, any>[]> = {
  [K in keyof M]: Parameters<M[K]['migrate']>[0];
}[keyof M];

/* eslint-disable @typescript-eslint/no-explicit-any */
export const createMigration = <M extends Migration<any, any>[]>(name: string, migrations: M) => {
  const logger = createLogger(`migration / ${name}`);
  const targetVersion = Math.max(...migrations.map((v) => v.to));

  // Validate migration
  if (import.meta.env.MODE !== 'production') {
    // Validate from / to parameters
    migrations.forEach((migration) => {
      if (migration.to !== migration.from + 1) {
        throw new Error(
          `Migration for version from ${migration.from} should have v${migration.from + 1} as target but it's v${
            migration.to
          }`
        );
      }
    });

    // Check for missing migrations
    for (let i = 1; i < targetVersion; i++) {
      if (!migrations.some((m) => m.from === i && m.to === i + 1)) {
        throw new Error(`Migration from v${i} to v${i + 1} missing`);
      }
    }

    if (migrations.length !== targetVersion - 1) {
      throw new Error(
        `All migrations should start with version 1, found invalid number of migrations for target version ${targetVersion}`
      );
    }
  }

  return (data: ExtractFromStates<M> | ExtractFinalState<M>): ExtractFinalState<M> => {
    const sourceVersion = (data as MigratableState).version;

    if (sourceVersion > targetVersion) {
      throw new Error(`Cannot process state with version ${sourceVersion}, highest known version is ${targetVersion}`);
    } else if (sourceVersion === targetVersion) {
      return data as ExtractFinalState<M>;
    }

    let result: any = data;
    for (let i = sourceVersion; i < targetVersion; i++) {
      const fn = migrations.find((m) => m.from === i && m.to === i + 1);

      if (fn) {
        result = fn.migrate(result);
      } else {
        throw new Error(`Migration from v${i} to v${i + 1} missing`);
      }
    }

    logger.success(`Migrated to latest version (from v${sourceVersion} to v${targetVersion})`);
    return result;
  };
};
