const path = require("path");
const { FileStore } = require("metro-cache");
const { getDefaultConfig } = require("expo/metro-config");
const { makeMetroConfig } = require("@rnx-kit/metro-config");
const MetroSymlinksResolver = require("@rnx-kit/metro-resolver-symlinks");

// Find the project and workspace directories
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");

// Create default Metro config
const config = getDefaultConfig(projectRoot);

// Create monorepo config, but pass the nativewind transformers and resolvers
const monoConfig = makeMetroConfig({
  ...config,
  // projectRoot: __dirname,
  watchFolders: [monorepoRoot],
  resolver: {
    disableHierarchicalLookup: true,
    resolveRequest: MetroSymlinksResolver(),
    // nodeModulesPaths: [
    //   path.resolve(projectRoot, "node_modules"),
    //   path.resolve(monorepoRoot, "node_modules"),
    // ],
    sourceExts: [...config.resolver.sourceExts, "cjs", "mjs"],
    resolverMainFields: ["react-native", "browser", "main"],
    unstable_enablePackageExports: true,
    unstable_enableSymlinks: true,
    extraNodeModules: {
      "@tzkt/oazapfts": path.resolve(monorepoRoot, "node_modules/@tzkt/oazapfts/lib/"),
      "@chakra-ui/utils": path.resolve(monorepoRoot, "node_modules/@chakra-ui/utils/dist/esm"),
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      util: require.resolve("util"),
      vm: require.resolve("vm-browserify"),
      zlib: require.resolve("pako"),
      process: require.resolve("process"),
      //   "@umami/state": path.resolve(monorepoRoot, "packages/state"),
      //   "@umami/crypto": path.resolve(monorepoRoot, "packages/crypto"),
      //   "@umami/multisig": path.resolve(monorepoRoot, "packages/multisig"),
      //   "@umami/social-auth": path.resolve(monorepoRoot, "packages/social-auth"),
      //   "@umami/tezos": path.resolve(monorepoRoot, "packages/tezos"),
      //   "@umami/tzkt": path.resolve(monorepoRoot, "packages/tzkt"),
      //   "@umami/utils": path.resolve(monorepoRoot, "packages/utils"),
    },
  },
  cacheStores: [new FileStore({ root: path.join(projectRoot, "node_modules", ".cache", "metro") })],
});

module.exports = monoConfig;
