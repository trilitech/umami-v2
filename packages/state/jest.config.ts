import baseConfig from "@umami/jest-config";
import type { Config } from "jest";

const config: Config = {
  ...baseConfig,
  testTimeout: 15000,
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  rootDir: "./",
  transformIgnorePatterns: ["node_modules/(?!(redux-persist-transform-encrypt)/)"],
};
export default config;
