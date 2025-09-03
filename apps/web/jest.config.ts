import config from "@umami/jest-config";

export default {
  ...config,
  setupFiles: ["<rootDir>/src/setupTests.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTestsAfterEnv.ts"],
  rootDir: "./",
  bail: false, // TODO: remove
  transformIgnorePatterns: ["node_modules/(?!(redux-persist-transform-encrypt)/)"],
};
