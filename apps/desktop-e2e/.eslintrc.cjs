module.exports = {
  extends: ["@umami/eslint-config", "plugin:playwright/recommended"],
  parserOptions: {
    project: "./tsconfig.json",
    parser: "@typescript-eslint/parser",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "playwright/no-standalone-expect": "off",
    "testing-library/prefer-screen-queries": "off",
  },
};
