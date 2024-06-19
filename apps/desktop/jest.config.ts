import config from "@umami/jest-config";

export default {
  ...config,
  rootDir: "./",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
};
