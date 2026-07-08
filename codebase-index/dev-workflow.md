# Developer Workflow

## Requirements

- Node `>=22 <23`, pnpm `>=9.7.0` (repo pins `pnpm@9.9.0`), turbo installed globally (`npm install turbo --global`)
- For e2e: `pnpm playwright install --with-deps chromium` and Docker

## Commands (run at repo root)

| Task | Command |
|---|---|
| Install | `pnpm install` |
| Build everything | `pnpm build` |
| Watch-build packages | `pnpm build:watch` |
| Dev desktop / web / mobile | `pnpm dev:desktop` / `pnpm dev:web` / `pnpm dev:mobile` |
| Test all (excl. mobile & web) | `pnpm test` |
| Test one package | `turbo test --filter=@umami/core` (builds deps first — prefer over bare `pnpm test` inside a package) |
| Single test file | `cd packages/core && pnpm test -- --testPathPattern=Account.test.ts` (the `--` is required — pnpm rejects the flag otherwise) |
| Watch tests in a package | `cd packages/<name> && pnpm test:watch` (sets DEV=true, disables coverage) |
| Lint (fix) / format (write) | `pnpm lint` / `pnpm format` |
| Type check | `pnpm check-types` |
| Full CI check | `pnpm run ci` (check-types + lint:ci + format:ci + check-circular-deps) |
| E2E | `pnpm test:e2e` (or `test:e2e:focus` for `@focus`-tagged scenarios) |
| Storybook | `pnpm --filter @umami/web storybook` (the root `pnpm storybook` script targets a non-existent `@umami/storybook` package) |

Turbo filter syntax: `--filter=@umami/core`, `--filter=./packages/core`, `--filter=!@umami/mobile` (exclude).

## Turbo task graph (`turbo.json`)

- `build` depends on `^build` (all upstream packages build first); `dev`/`test` depend on `^build:quick`
- Coverage output: `<package>/coverage/lcov-report/index.html`

## Jest setup (`packages/jest-config`)

- jsdom environment, pattern `src/**/*.{spec,test}.{ts,tsx,js,jsx}`, bail after 1 failure, `clearMocks` + `resetModules`
- Global coverage thresholds: 70% branches/functions/lines/statements (skipped when `DEV=true`)
- Asset mocks: CSS → identity-obj-proxy, images → fileMock, SVG → jest-transformer-svg; transform via babel-jest
- Packages inherit via `preset: "@umami/jest-config"`

## Lint/format conventions (`packages/eslint-config`, `.prettierrc`)

- Import order: builtin → external → internal → sibling/parent → index; alphabetized; newlines between groups
- Double quotes; inline type imports (`import { type X } from "..."`); `eqeqeq`; prefer const; unused vars allowed with `_` prefix
- Chakra prop-order plugin; testing-library/jest-dom plugins; `import/no-cycle` warns (madge enforces via `check-circular-deps`)
- Prettier: `arrowParens: avoid`, `trailingComma: es5`, gherkin plugin for .feature files

## CI (`.github/workflows/`)

| Workflow | Trigger | Runs |
|---|---|---|
| `test.yaml` | every push | build + `test -- --runInBand`, posts coverage comments |
| `code_format.yaml` | every push | `pnpm run ci` |
| `e2e.yaml` | manual dispatch | docker-compose stack + cucumber/playwright |
| `release.yaml` | tag `v*.*.*` | builds & signs desktop binaries (deb/rpm/dmg), draft GitHub release |
| `deploy-to-github-pages.yaml` | push to main | builds and publishes to GitHub Pages |

## Local Tezos sandbox (`docker-compose.yaml`)

Used by e2e tests: postgres + tezbox sandbox node (tezos v25.0, protocol Ushuaia) + nginx CORS proxy (port `2000X`) + TzKT sync/API 1.17.x (port `500X`), where `X` = `CUCUMBER_WORKER_ID` for parallel workers. Health check waits for the Alice account (`tz1VSUr8...`) to show its initial 50000 tez. Protocol parameters can be overridden in `sandbox-override-parameters.hjson`.

## Misc

- `.npmrc` uses `node-linker=hoisted` with hoist patterns for react/expo/babel — needed for Expo/React Native compatibility
- No Cursor or Copilot rules exist in the repo
- Empty leftover dirs (ignore): `apps/server`, `apps/universal`, `packages/ui`, `packages/mobile-components`
