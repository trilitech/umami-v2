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
    paths: ["src/e2e/features/"],
    require: ["src/e2e/steps/*.ts"],
    requireModule: ["ts-node/register"],
    format: ["html:test-results/cucumber-report.html", "json:test-results/cucumber-report.json"],
  },
};

module.exports = config;
