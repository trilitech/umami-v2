const { env } = require("process");

const config = {
  default: {
    backtrace: true,
    retry: env.CI ? 2 : 0,
    // locally the optimal number of parallel tests is 3
    // whilst on CI it's 2 because of the limited resources
    parallel: env.CI ? 2 : 3,
    formatOptions: {
      snippetInterface: "async-await",
    },
    dryRun: false,
    failFast: true,
    paths: ["src/features/*"],
    require: ["src/**/*.ts"],
    requireModule: ["ts-node/register/transpile-only", "tsconfig-paths/register"],
    format: ["html:test-results/cucumber-report.html", "json:test-results/cucumber-report.json"],
  },
};

module.exports = config;
