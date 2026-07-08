import baseConfig from "@umami/jest-config";
import type { Config } from "jest";

const config: Config = {
  ...baseConfig,
  setupFiles: ["whatwg-fetch", "<rootDir>/src/setupPolyfills.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testEnvironment: "jsdom",
  rootDir: "./",
  transformIgnorePatterns: [
    "node_modules/(?!(redux-persist-transform-encrypt|@stablelib|@tezos-x)/)",
  ],
};
export default config;
