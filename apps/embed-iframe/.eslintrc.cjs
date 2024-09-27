/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["@umami/eslint-config"],
  parserOptions: {
    project: "./tsconfig.json",
    parser: "@typescript-eslint/parser",
    tsconfigRootDir: __dirname,
  },
};
