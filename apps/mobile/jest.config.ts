import type { Config } from "jest";

const config: Config = {
  preset: "react-native",
  rootDir: "./",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|react-redux/)",
  ],
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};

export default config;
