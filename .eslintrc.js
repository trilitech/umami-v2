module.exports = {
  root: true,
  extends: ["@umami/eslint-config/index.js"],
  parserOptions: {
    project: ["./apps/*/tsconfig.json", "./packages/*/tsconfig.json"],
    parser: "@typescript-eslint/parser",
    tsconfigRootDir: __dirname,
  },
};
