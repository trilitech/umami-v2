module.exports = {
  extends: ["@umami/eslint-config"],
  parserOptions: {
    project: "./tsconfig.json",
    parser: "@typescript-eslint/parser",
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "import/no-unused-modules": "off",
      },
    },
  ],
};
