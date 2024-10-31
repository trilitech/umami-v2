interface Permissions {
  origins: string[];
  login: boolean;
  operations: boolean;
  signPayload: boolean;
}

/**
 * Client-specific permissions for the mainnet environment.
 *
 * This configuration defines which permissions each client is granted. It only applies to the mainnet.
 *
 * Note: When adding a new origin, ensure it is also added to the `frame-ancestors`
 * directive in the Content Security Policy (CSP) within `embed-iframe-mainnet/vercel.json`.
 */
const clientPermissions: Record<string, Permissions> = {
  kanvas: {
    origins: [
      "https://kanvas-poa.vercel.app",
      "https://kanvas-poa-git-poa-release-trili-tech.vercel.app", // TODO: remove once the integration is done
    ],
    login: true,
    operations: false,
    signPayload: false,
  },
  test: {
    origins: [
      "http://localhost:3000",
    ],
    login: true,
    operations: true,
    signPayload: true,
  },
}

export const getPermissionsForOrigin = (origin: string): Permissions | null => {
  for (const key in clientPermissions) {
    const permissions = clientPermissions[key];
    if (permissions.origins.includes(origin)) {
      return permissions;
    }
  }
  return null;
};

export const getDAppByOrigin = (origin: string): string | null => {
  for (const key in clientPermissions) {
    const permissions = clientPermissions[key];
    if (permissions.origins.includes(origin)) {
      return key;
    }
  }
  return null;
};
