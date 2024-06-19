module.exports = {
  extends: ["@umami/eslint-config"],
  parserOptions: {
    // tsconfig.e2e.json includes both src and src/e2e
    project: "./tsconfig.e2e.json",
    parser: "@typescript-eslint/parser",
    tsconfigRootDir: __dirname,
  },
};
