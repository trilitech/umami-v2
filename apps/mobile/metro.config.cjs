const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const path = require("path");

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const monorepoRoot = path.resolve(projectRoot, "../..");

module.exports = mergeConfig(getDefaultConfig(projectRoot),
  {
    watchFolders: [
      monorepoRoot
    ],
    projectRoot,
    resolver: {
      extraNodeModules: {
        crypto: require.resolve("crypto-browserify"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util"),
        vm: require.resolve("vm-browserify"),
        zlib: require.resolve("browserify-zlib"),
        "@umami/crypto": path.resolve(monorepoRoot, "packages/crypto-react-native"),
      },
      unstable_enablePackageExports: true,
      unstable_enableSymlinks: true
    },
  });


