import { describe, test, expect } from 'vitest';
import { createMigration, MigratableState } from './migration';

interface StateV1 extends MigratableState<1> {
  name: string;
}

interface StateV2 extends MigratableState<2> {
  names: string[];
}

interface StateV3 extends MigratableState<3> {
  data: {
    names: string[];
  };
}

interface StateV4 extends MigratableState<4> {
  data: {
    meta: number[];
    names: string[];
  };
}

describe('createMigration', () => {
  test('migrate a simple state', () => {
    const migrate = createMigration('test', [
      {
        from: 1,
        to: 2,
        migrate: (from: StateV1): StateV2 => ({
          version: 2,
          names: [from.name]
        })
      },
      {
        from: 2,
        to: 3,
        migrate: (from: StateV2): StateV3 => ({
          version: 3,
          data: { names: from.names }
        })
      }
    ]);

    expect(
      migrate({
        version: 1,
        name: 'foo'
      })
    ).toEqual({
      version: 3,
      data: { names: ['foo'] }
    });
  });

  test('throw error if migration versions are incorrect', () => {
    expect(() => {
      createMigration('test', [
        {
          from: 1,
          to: 4,
          migrate: (from: StateV1): StateV2 => ({
            version: 2,
            names: [from.name]
          })
        }
      ]);
    }).toThrow();
  });

  test('throw error if a migration is missing', () => {
    expect(() => {
      createMigration('test', [
        {
          from: 2,
          to: 3,
          migrate: (from: StateV2): StateV3 => ({
            version: 3,
            data: { names: from.names }
          })
        }
      ]);
    }).toThrow();
  });

  test('throw error if a migration is missing', () => {
    expect(() => {
      createMigration('test', [
        {
          from: 1,
          to: 2,
          migrate: (from: StateV1): StateV2 => ({
            version: 2,
            names: [from.name]
          })
        },
        {
          from: 3,
          to: 4,
          migrate: (from: StateV3): StateV4 => ({
            version: 4,
            data: {
              meta: [],
              names: from.data.names
            }
          })
        }
      ]);
    }).toThrow();
  });

  test('throw error if the version to migrate is too high', () => {
    const migrate = createMigration('test', [
      {
        from: 1,
        to: 2,
        migrate: (from: StateV1): StateV2 => ({
          version: 2,
          names: [from.name]
        })
      }
    ]);

    expect(() =>
      migrate({
        version: 3
      })
    ).toThrow();
  });

  test('perform no transformation if version is already the highest', () => {
    const migrate = createMigration('test', [
      {
        from: 1,
        to: 2,
        migrate: (from: StateV1): StateV2 => ({
          version: 2,
          names: [from.name]
        })
      }
    ]);

    const data = {
      version: 2,
      names: ['foo']
    };

    expect(migrate(data)).toEqual(data);
  });
});
