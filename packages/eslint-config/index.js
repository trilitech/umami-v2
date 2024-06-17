module.exports = {
  "root": true,
  "plugins": [
    "@stylistic/eslint-plugin",
    "@typescript-eslint",
    "chakra-ui",
    "deprecation",
    "eslint-plugin-tsdoc",
    "import",
    "jest-dom",
    "jest",
    "react-hooks",
    "react-redux",
    "react",
    "testing-library",
    "unused-imports",
  ],
  "extends": [
    "eslint:recommended",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jest-dom/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-redux/recommended",
    "plugin:react/jsx-runtime",
    "plugin:testing-library/react",
  ],
  "settings": {
    "react": {
      "version": "detect",
    },
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-function": ["warn", { "allow": ["arrowFunctions"] }],
    "@typescript-eslint/switch-exhaustiveness-check": "warn",

    "react/jsx-curly-brace-presence": ["warn", "never"],
    "curly": ["warn", "all"],

    "jest/no-focused-tests": "warn",
    "jest/no-identical-title": "warn",
    "jest/valid-expect": "warn",

    "@typescript-eslint/await-thenable": "warn",
    "@typescript-eslint/no-unnecessary-condition": "warn",
    "unused-imports/no-unused-imports": "warn",
    "@typescript-eslint/ban-ts-comment": ["warn", { "ts-ignore": "allow-with-description" }],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { "argsIgnorePattern": ".*", "varsIgnorePattern": "^_" },
    ],
    "@typescript-eslint/triple-slash-reference": "off",

    "react/jsx-key": [
      "warn",
      {
        "checkFragmentShorthand": true,
        "checkKeyMustBeforeSpread": true,
        "warnOnDuplicates": true,
      },
    ],

    "chakra-ui/props-order": ["warn", { "applyToAllComponents": true }],
    "chakra-ui/props-shorthand": ["warn", { "noShorthand": true, "applyToAllComponents": true }],
    "chakra-ui/require-specific-component": "warn",

    "import/no-unresolved": "warn",
    "sort-imports": [
      "warn",
      {
        "ignoreCase": false,
        "ignoreDeclarationSort": true, // don"t want to sort import lines, use eslint-plugin-import instead
        "ignoreMemberSort": false,
        "memberSyntaxSortOrder": ["none", "all", "multiple", "single"],
        "allowSeparatedGroups": true,
      },
    ],
    "import/order": [
      "warn",
      {
        "groups": [
          "builtin", // Built-in imports (come from NodeJS native) go first
          "external", // <- External imports
          "internal", // <- Absolute imports
          ["sibling", "parent"], // <- Relative imports, the sibling and parent types they can be mingled together
          "index", // <- index imports
          "unknown", // <- unknown
        ],
        "newlines-between": "always",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": true,
        },
      },
    ],
    "@stylistic/quotes": ["warn", "double", { "avoidEscape": true }],
    "deprecation/deprecation": "warn",
    "import/no-unused-modules": ["warn", { "unusedExports": true }],
    "prefer-const": "warn",
    "@typescript-eslint/require-await": "warn",
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/no-misused-promises": [
      "warn",
      { "checksVoidReturn": { "attributes": false } },
    ],
    "tsdoc/syntax": "warn",
    "arrow-body-style": ["warn", "as-needed"],
    "react-redux/useSelector-prefer-selectors": "off",
    "eqeqeq": ["warn", "always"],
    "@typescript-eslint/consistent-type-imports": ["error", { "fixStyle": "inline-type-imports" }],
  },
  "overrides": [
    {
      "files": ["src/e2e/**/*.ts"],
      "rules": {
        "testing-library/prefer-screen-queries": "off",
      },
    },
    {
      "files": ["react-app-env.d.ts", "jest.config.ts"],
      "rules": {
        "import/no-unused-modules": "off",
      },
    },
    {
      "files": ["MultisigActionButton.tsx"],
      "rules": {
        "deprecation/deprecation": "off",
      },
    },
    {
      "files": "src/e2e/**",
      "extends": "plugin:playwright/recommended",
      "rules": {
        "playwright/no-standalone-expect": "off",
      },
    },
  ],
}
