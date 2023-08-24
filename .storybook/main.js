const webpack = require("webpack");
module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  docs: {
    autodocs: true,
  },
  staticDirs: ["../public"],
  async webpackFinal(config) {
    config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    ]);

    return config;
  },
};
