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
  nodeModulesPaths: [
    path.resolve(projectRoot, "node_modules"),
    path.resolve(workspaceRoot, "node_modules"),
  ],
  extraNodeModules: {
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer"),
    util: require.resolve("util"),
    vm: require.resolve("vm-browserify"),
    zlib: require.resolve("pako"),
    process: require.resolve("process"),
    crypto: require.resolve('expo-crypto'),
  },
  disableHierarchicalLookup: true,
  unstable_enableSymlinks: true,
  unstable_enablePackageExports: true,
  resolveRequest: (context, moduleName, platform) => {

    // Redirect `constants.mjs` to `constants.native.js` inside @tamagui/constants
    if (
      moduleName === './constants.mjs'
    ) {
      console.log('context, moduleName, platform', context.originModulePath, moduleName, platform);
      console.log("Redirecting to constants.native.js");
      console.log('path', path.resolve(
        workspaceRoot,
        "node_modules/@tamagui/constants/dist/esm/constants.native.js"
      ))
      return context.resolveRequest(
        context,
        path.resolve(
          workspaceRoot,
          "node_modules/@tamagui/constants/dist/esm/constants.native.js"
        ),
        platform
      );
    }

    const resolvedPath = context.resolveRequest(
      context,
      path.resolve(
        workspaceRoot,
        "node_modules/@tamagui/constants/dist/esm/constants.native.js"
      ),
      platform
    );
    console.log("Final Resolved Path:", resolvedPath);
    return resolvedPath;

    // Fall back to default resolver
    return context.resolveRequest(context, moduleName, platform);
  },
};

module.exports = defaultConfig;
