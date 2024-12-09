module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Use the default Expo preset
    plugins: [
      ['module-resolver', { alias: { crypto: 'react-native-crypto' } }], // Example for polyfills
    ],
  };
};
