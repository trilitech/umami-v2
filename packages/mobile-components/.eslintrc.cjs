module.exports = {
  extends: ["@umami/eslint-config"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "import/namespace": "off", // Disable for all files
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "import/namespace": "off", // Disable specifically for TypeScript files
      },
    },
  ],
};
