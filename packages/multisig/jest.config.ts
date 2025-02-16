import baseConfig from "@umami/jest-config";
import type { Config } from "jest";

const config: Config = {
  ...baseConfig,
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/src/setupTests.ts"],
  rootDir: "./",
};
export default config;
