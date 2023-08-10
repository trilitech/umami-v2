const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, { crypto: false });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);

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
  // keep sources as they are for error reporting
  // source maps do not work without devtools enabled in electron
  // TODO: find a better solution, check how rollbar & sentry handle this
  config.optimization.minimize = false;
  return config;
};
