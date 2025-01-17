// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const defaultConfig = getDefaultConfig(projectRoot);

defaultConfig.watchFolders = [
  workspaceRoot,
];

defaultConfig.resolver = {
  ...defaultConfig.resolver,
  sourceExts: [...defaultConfig.resolver.sourceExts, "cjs", "mjs"],
  resolverMainFields: ["react-native", "browser", "main"],
  nodeModulesPaths: [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
  ],
  extraNodeModules: {
    "@tzkt/oazapfts": path.resolve(workspaceRoot, "node_modules/@tzkt/oazapfts/lib/"),
    "@chakra-ui/utils": path.resolve(workspaceRoot, "node_modules/@chakra-ui/utils/dist/esm"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer"),
    util: require.resolve("util"),
    vm: require.resolve("vm-browserify"),
    zlib: require.resolve("pako"),
    process: require.resolve("process"),
    crypto: require.resolve("crypto-browserify"),
  },
  disableHierarchicalLookup: true,
  unstable_enableSymlinks: true,
};

module.exports = defaultConfig;
