const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");
const path = require("path");

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

module.exports = mergeConfig(getDefaultConfig(projectRoot), {
  watchFolders: [monorepoRoot],
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
    },
    unstable_enablePackageExports: true,
    unstable_enableSymlinks: true,
  },
  transformer: {
    babelTransformerPath: require.resolve("metro-react-native-babel-transformer"),
  },
});
