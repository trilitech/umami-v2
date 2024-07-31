interface Permissions {
  origins: string[];
  login: boolean;
  operations: boolean;
}

const clientPermissions: Record<string, Permissions> = {
  kanvas: {
    origins: ["https://kanvas-poa.vercel.app"],
    login: true,
    operations: false,
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
