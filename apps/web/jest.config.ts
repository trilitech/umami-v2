import config from "@umami/jest-config";

export default {
  ...config,
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  rootDir: "./",
  bail: false, // TODO: remove
};
