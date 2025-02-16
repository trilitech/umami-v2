/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ["@umami/eslint-config", "plugin:storybook/recommended"],
  parserOptions: {
    project: "tsconfig.json",
    parser: "@typescript-eslint/parser",
    tsconfigRootDir: __dirname,
  },
};
