import config from "@umami/jest-config";

export default {
  ...config,

  rootDir: "./",
  setupFiles: ["<rootDir>/src/setupTests.ts"],
};
