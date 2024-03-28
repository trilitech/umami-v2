import { DEFAULT_VERSION, PersistedState } from "redux-persist";

type MigrationManifest = {
  [key: string]: (state: PersistedState) => Promise<PersistedState>;
};
/**
 * Custom redux-persist createMigrate function that allows async migrations.
 */
export function createAsyncMigrate(
  migrations: MigrationManifest,
  config?: { debug: boolean }
): (state: PersistedState, currentVersion: number) => Promise<PersistedState> {
  const { debug } = config || {};

  return async (state: PersistedState, currentVersion: number): Promise<PersistedState> => {
    if (!state) {
      if (process.env.NODE_ENV !== "production" && debug) {
        console.log("redux-persist: no inbound state, skipping migration");
      }
      return undefined;
    }

    const inboundVersion: number =
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      state._persist && state._persist.version !== undefined
        ? state._persist.version
        : DEFAULT_VERSION;
    if (inboundVersion === currentVersion) {
      if (process.env.NODE_ENV !== "production" && debug) {
        console.log("redux-persist: versions match, noop migration");
      }
      return state;
    }

    if (inboundVersion > currentVersion) {
      if (process.env.NODE_ENV !== "production") {
        console.error("redux-persist: downgrading version is not supported");
      }
      return state;
    }

    const migrationKeys = Object.keys(migrations)
      .map(ver => parseInt(ver))
      .filter(key => currentVersion >= key && key > inboundVersion)
      .sort((a, b) => a - b);

    if (process.env.NODE_ENV !== "production" && debug) {
      console.log("redux-persist: migrationKeys", migrationKeys);
    }

    let migratedState: any = state;
    for (const versionKey of migrationKeys) {
      if (process.env.NODE_ENV !== "production" && debug) {
        console.log("redux-persist: running migration for versionKey", versionKey);
      }
      migratedState = await migrations[versionKey](migratedState);
    }
    return migratedState;
  };
}
