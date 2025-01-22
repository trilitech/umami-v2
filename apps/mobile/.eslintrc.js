module.exports = {
  ignorePatterns: ["metro.config.js"],
  extends: ["expo", "@umami/eslint-config"],
  parserOptions: {
    project: "tsconfig.json",
    parser: "@typescript-eslint/parser",
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.js", "*.jsx"],
      rules: {
        "import/no-unused-modules": "off",
      },
    },
  ],
  globals: {
    __dirname: true,
  },
};
