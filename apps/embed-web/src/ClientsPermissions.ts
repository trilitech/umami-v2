import { type Network } from "./types";

export interface Permissions {
  origins: string[];
  networks: Network[];
  login: boolean;
  operations: boolean; // TODO: switch to using a list of operation types
}

const clientPermissions: Record<string, Permissions> = {
  localDevelopment: {
    origins: ["http://localhost:3000"],
    networks: ["ghostnet"],
    login: true,
    operations: true,
  },
};

export const getPermissionsForOrigin = (origin: string): Permissions | null => {
  for (const key in clientPermissions) {
    const permissions = clientPermissions[key];
    console.log(key, permissions);
    if (permissions.origins.includes(origin)) {
      return permissions;
    }
  }
  return null;
};
