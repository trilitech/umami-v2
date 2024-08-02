module.exports = {
  root: true,
  plugins: [
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
  extends: [
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
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
    react: { version: "detect" },
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-function": ["warn", { allow: ["arrowFunctions"] }],
    "@typescript-eslint/switch-exhaustiveness-check": "warn",
    "@typescript-eslint/await-thenable": "warn",
    "@typescript-eslint/no-unnecessary-condition": "warn",
    "@typescript-eslint/ban-ts-comment": ["warn", { "ts-ignore": "allow-with-description" }],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/triple-slash-reference": "off",
    "@typescript-eslint/require-await": "warn",
    "@typescript-eslint/no-floating-promises": "warn",
    "@typescript-eslint/no-misused-promises": ["warn", { checksVoidReturn: { attributes: false } }],
    "@typescript-eslint/no-unused-expressions": ["warn", { allowShortCircuit: true, allowTernary: true, enforceForJSX: true }],
    "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],

    "react/jsx-curly-brace-presence": ["warn", "never"],
    "react/jsx-key": [
      "warn",
      {
        checkFragmentShorthand: true,
        checkKeyMustBeforeSpread: true,
        warnOnDuplicates: true,
      },
    ],

    "jest/no-focused-tests": "warn",
    "jest/no-identical-title": "warn",
    "jest/valid-expect": "warn",

    "chakra-ui/props-order": ["warn", { applyToAllComponents: true }],
    "chakra-ui/props-shorthand": ["warn", { noShorthand: true, applyToAllComponents: true }],
    "chakra-ui/require-specific-component": "warn",

    "unused-imports/no-unused-imports": "warn",

    "import/no-unused-modules": ["warn", { unusedExports: true }],
    "import/no-unresolved": "off",
    "import/no-cycle": "warn",
    "import/no-self-import": "warn",
    "import/no-duplicates": ["warn", { "prefer-inline": true }],
    "import/order": [
      "warn",
      {
        groups: [
          "builtin", // Built-in imports (come from NodeJS native) go first
          "external", // <- External imports
          "internal", // <- Absolute imports
          ["sibling", "parent"], // <- Relative imports, the sibling and parent types they can be mingled together
          "index", // <- index imports
          "unknown", // <- unknown
        ],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],

    "@stylistic/quotes": ["warn", "double", { avoidEscape: true }],

    "deprecation/deprecation": "warn",

    "react-redux/useSelector-prefer-selectors": "off",

    "prefer-const": "warn",
    "arrow-body-style": ["warn", "as-needed"],
    "curly": ["warn", "all"],
    "eqeqeq": ["warn", "always"],
    "no-restricted-imports": [
      "warn", {
        "paths": [{
          "name": "react",
          "importNames": ["default"],
          "message": "use `import { <...> } from 'react'` instead"
        }]
      }
    ],
    "no-duplicate-imports": "warn",
    "sort-imports": [
      "warn",
      {
        ignoreCase: false,
        ignoreDeclarationSort: true, // don"t want to sort import lines, use eslint-plugin-import instead
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        allowSeparatedGroups: true,
      },
    ],

    "tsdoc/syntax": "warn",
  },
  overrides: [
    {
      files: ["jest.config.ts", "vite.config.ts"],
      rules: {
        "import/no-unused-modules": "off",
      },
    },
  ],
};
