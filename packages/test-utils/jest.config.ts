import baseConfig from "@umami/jest-config";
import type { Config } from "jest";

const config: Config = {
  ...baseConfig,

  testEnvironment: "node",

  rootDir: "./",
  passWithNoTests: true,
};
export default config;
