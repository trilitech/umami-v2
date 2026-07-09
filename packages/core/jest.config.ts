import baseConfig from "@umami/jest-config";
import type { Config } from "jest";

const config: Config = {
  ...baseConfig,
  testEnvironment: "jsdom",
  rootDir: "./",
  setupFiles: ["whatwg-fetch", "<rootDir>/src/setupTests.ts"],
};
export default config;
