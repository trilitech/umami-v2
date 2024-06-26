module.exports = {
  extends: ["@umami/eslint-config", "plugin:storybook/recommended"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: {
    project: "tsconfig.json",
    parser: "@typescript-eslint/parser",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
  },
};
