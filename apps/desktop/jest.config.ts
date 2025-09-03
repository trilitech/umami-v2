import config from "@umami/jest-config";

export default {
  ...config,
  rootDir: "./",
  testTimeout: 20000,
  bail: false,
  setupFiles: ["<rootDir>/src/setupTestsGlobal.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.tsx"],
  transformIgnorePatterns: ["node_modules/(?!(redux-persist-transform-encrypt)/)"],
};
