import baseConfig from "@umami/jest-config";
import type { Config } from "jest";

const config: Config = {
  ...baseConfig,
  testTimeout: 15000,
  setupFiles: ["whatwg-fetch", "<rootDir>/src/setupTests.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTestsAfterEnv.ts"],
  rootDir: "./",
  transformIgnorePatterns: [
    "node_modules/(?!(redux-persist-transform-encrypt|@stablelib|@tezos-x)/)",
  ],
};
export default config;
