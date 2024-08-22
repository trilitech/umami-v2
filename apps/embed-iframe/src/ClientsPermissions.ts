interface Permissions {
  origins: string[];
  login: boolean;
  operations: boolean;
  signPayload: boolean;
}

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
};

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
