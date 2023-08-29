const webpack = require("webpack");

module.exports = function override(config) {
  // taken from https://web3auth.io/docs/troubleshooting/webpack-issues#react-create-react-app
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: false, // require.resolve("crypto-browserify") can be polyfilled here if needed
    stream: require.resolve("stream-browserify"), // for cipher-base package
    assert: require.resolve("assert"), // for electron's console
    http: false, // require.resolve("stream-http") can be polyfilled here if needed
    https: false, // require.resolve("https-browserify") can be polyfilled here if needed
    os: false, // require.resolve("os-browserify") can be polyfilled here if needed
    url: false, // require.resolve("url") can be polyfilled here if needed
    zlib: false, // require.resolve("browserify-zlib") can be polyfilled here if needed
  });
  config.resolve.fallback = fallback;
  config.ignoreWarnings = [/Failed to parse source map/];
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  config.module.rules.push({
    test: /\.(js|mjs|jsx)$/,
    enforce: "pre",
    loader: require.resolve("source-map-loader"),
    resolve: {
      fullySpecified: false,
    },
  });

  if (process.env.NODE_ENV === "production") {
    config.module.rules.push({
      test: /\.[jt]sx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "webpack-remove-code-blocks",
        },
      ],
    });
  }

  return config;
};
