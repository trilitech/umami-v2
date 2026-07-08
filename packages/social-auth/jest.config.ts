import config from "@umami/jest-config";

export default {
  ...config,

  rootDir: "./",
  setupFiles: ["whatwg-fetch", "<rootDir>/src/setupTests.ts"],
};
