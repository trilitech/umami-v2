import config from "@umami/jest-config";

export default {
  ...config,
  preset: "ts-jest",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  rootDir: "./",
};
