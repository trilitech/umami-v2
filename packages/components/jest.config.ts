import baseConfig from "@umami/jest-config";
import type { Config } from "jest";

const config: Config = {
  ...baseConfig,
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/src/setupPolyfills.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  rootDir: "./",
  transformIgnorePatterns: [
    "node_modules/(?!(redux-persist-transform-encrypt|@walletconnect|@reown|uint8arrays|multiformats)/)",
  ],
};
export default config;
