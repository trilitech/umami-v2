import baseConfig from "@umami/jest-config";
import type { Config } from "jest";

const config: Config = {
  ...baseConfig,

  testEnvironment: "node",
  testTimeout: 10000,
  rootDir: "./",
};
export default config;
