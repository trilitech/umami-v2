import { type Network } from "@trilitech-umami/umami-embed/types";

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

export const getPermissionsForOrigin = (origin: string, network: Network): Permissions | null => {
  for (const key in clientPermissions) {
    const permissions = clientPermissions[key];
    if (permissions.origins.includes(origin) && permissions.networks.includes(network)) {
      return permissions;
    }
  }
  return null;
};
