import baseConfig from "@umami/jest-config";
import type { Config } from "jest";

const config: Config = {
  ...baseConfig,
  preset: "ts-jest",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  rootDir: "./",
};
export default config;
