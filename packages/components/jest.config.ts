import baseConfig from "@umami/jest-config";
import type { Config } from "jest";

const config: Config = {
  ...baseConfig,
  testEnvironment: "jsdom",
  setupFiles: ["whatwg-fetch", "<rootDir>/src/setupPolyfills.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  rootDir: "./",
  transformIgnorePatterns: ["node_modules/(?!(redux-persist-transform-encrypt|@stablelib)/)"],
};
export default config;
