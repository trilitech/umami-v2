module.exports = {
  root: true,
  extends: ["@umami/eslint-config/index.js"],
  parserOptions: {
    // tsconfig.e2e.json includes both src and src/e2e
    project: "./tsconfig.e2e.json",
    parser: "@typescript-eslint/parser",
  },
};
