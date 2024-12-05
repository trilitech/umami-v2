// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the project and workspace directories
const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

// Get the default configuration
const defaultConfig = getDefaultConfig(projectRoot);

// Extend the default configuration
defaultConfig.watchFolders = [
  workspaceRoot, // Add workspace root for monorepo compatibility
];

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
    // zlib: require.resolve("browserify-zlib"),
    process: require.resolve("process"),
    "@tamagui/web": path.resolve(__dirname, "node_modules/@tamagui/web"),
    "@tamagui/core": path.resolve(__dirname, "node_modules/@tamagui/core"),
    zlib: require.resolve("pako"),
  },
  disableHierarchicalLookup: true,
  unstable_enablePackageExports: true,
  unstable_enableSymlinks: true,
};

module.exports = defaultConfig;
