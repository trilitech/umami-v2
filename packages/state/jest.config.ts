import baseConfig from "@umami/jest-config";
import type { Config } from "jest";

const config: Config = {
  ...baseConfig,
  testTimeout: 15000,
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  rootDir: "./",
};
export default config;
