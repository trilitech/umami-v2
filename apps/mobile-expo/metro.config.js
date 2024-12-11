const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const exclusionList = require("metro-config/src/defaults/exclusionList");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const defaultConfig = getDefaultConfig(projectRoot);

defaultConfig.watchFolders = [workspaceRoot];

defaultConfig.resolver = {
  ...defaultConfig.resolver,
  nodeModulesPaths: [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
  ],
  extraNodeModules: {
    crypto: require.resolve("crypto-browserify"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer"),
    util: require.resolve("util"),
    vm: require.resolve("vm-browserify"),
    zlib: require.resolve("pako"),
    process: require.resolve("process"),
  },
  blockList: exclusionList([
    /.*\/__fixtures__.*/,
    /.*\/__tests__.*/,
    /.*\/node_modules\/.*\/node_modules\/react-native\/.*/,
  ]),
  disableHierarchicalLookup: true,
  unstable_enableSymlinks: true,
  unstable_enablePackageExports: true,
  sourceExts: [
    ...defaultConfig.resolver.sourceExts,
    "ios.ts",
    "native.ts",
    "ts",
    "tsx",
    "mjs",
    "cjs",
    "js",
  ],
};

// Log the resolution for debugging
defaultConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  const resolution = require("metro-resolver").resolve(context, moduleName, platform);
  return resolution;
};

defaultConfig.transformer = {
  ...defaultConfig.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = defaultConfig;
