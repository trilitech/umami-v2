---
name: run-tests
description: Run tests correctly in the Umami monorepo — all tests, one package, a single file, watch mode, or coverage. Use whenever running or debugging Jest tests in this repo.
---

# Running tests in umami-v2

Turborepo monorepo — tests need upstream packages built first.

## Commands

| Scope | Command |
|---|---|
| Everything (excl. mobile & web) | `pnpm test` (repo root) |
| One package (builds deps first) | `turbo test --filter=@umami/core` |
| Single test file | `cd packages/core && pnpm test -- --testPathPattern=Account.test.ts` (the `--` is required — pnpm rejects unknown flags) |
| Match test name | `cd packages/core && pnpm test -- -t "estimates reveal"` |
| Watch mode | `cd packages/<name> && pnpm test:watch` (sets `DEV=true` → disables coverage thresholds) |
| E2E | see the e2e-sandbox skill |

## Rules

- Inside a package, `pnpm test` does NOT build dependencies. If you changed another `@umami/*` package, either run `turbo test --filter=<pkg>` or run `pnpm build:watch` at root in another terminal.
- If tests fail with stale types/exports from an @umami package, rebuild: `turbo build --filter=<that-package>`.
- Jest preset (`packages/jest-config`): jsdom, `bail: 1` (stops at first failure — a single reported failure doesn't mean only one test is broken), `clearMocks`, `resetModules`, 10s timeout.
- Coverage thresholds are 70% global (branches/functions/lines/statements). A passing test run can still fail on coverage. HTML report: `<package>/coverage/lcov-report/index.html`.
- Test files live next to sources: `src/**/*.test.ts(x)`. Fixtures/mocks come from `@umami/test-utils` (mock accounts, tokens, TzKT responses, `render` with Redux store).
- CI runs `pnpm run test -- --runInBand` after a full build on every push.
- Mobile tests (`@umami/mobile`, jest-expo) are excluded from root `pnpm test`; run them with `pnpm --filter @umami/mobile test`.
