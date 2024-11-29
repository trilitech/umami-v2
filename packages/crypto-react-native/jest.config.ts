import baseConfig from "@umami/jest-config";
import type { Config } from "jest";

const config: Config = {
  ...baseConfig,
  preset: "react-native",
  testTimeout: 10000,
  rootDir: "./",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
export default config;
