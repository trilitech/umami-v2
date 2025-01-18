module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "@tamagui/babel-plugin",
        {
          components: ["tamagui"],
          config: "./tamagui.config.ts",
        },
      ],
      ["module-resolver", { alias: { crypto: "react-native-crypto" } }],
    ],
  };
};
