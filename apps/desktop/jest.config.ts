import config from "@umami/jest-config";

export default {
  ...config,
  rootDir: "./",
  testTimeout: 20000,
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
