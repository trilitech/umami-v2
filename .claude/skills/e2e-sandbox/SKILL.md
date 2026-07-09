---
name: e2e-sandbox
description: Run or debug the desktop end-to-end tests (Cucumber + Playwright) against the local dockerized Tezos/TzKT sandbox. Use for test:e2e failures, docker-compose sandbox issues, or writing new .feature scenarios.
---

# E2E tests & the local Tezos sandbox

E2E lives in `apps/desktop-e2e`: Gherkin features + Playwright, run against the desktop app preview build and a local dockerized Tezos chain indexed by TzKT.

## Prerequisites

- Docker running
- `pnpm playwright install --with-deps chromium`
- `pnpm build` (or at least the desktop app's deps)

## Run

```bash
pnpm test:e2e          # root: starts desktop preview on :3000, then cucumber-js
pnpm test:e2e:focus    # only scenarios tagged @focus — tag your scenario while iterating
```

`test:e2e` uses start-server-and-test: `turbo preview --filter=@umami/desktop` on http://127.0.0.1:3000, then runs cucumber.

## The sandbox stack (`docker-compose.yaml` at repo root)

- `tezos_node` — tezbox sandbox (tezos v25.0, protocol Ushuaia), behind `proxy` (nginx CORS) on port `2000X`
- `sync` + `api` — TzKT indexer + REST API 1.17.x (bakingbad images) on port `500X`
- `db` — postgres for TzKT
- `X` = `CUCUMBER_WORKER_ID` (parallel workers get their own stack/ports; default 0 → ports 20000/5000)
- Ready when Alice (`tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb`) shows 50000 tez: `curl http://localhost:5000/v1/accounts/tz1VSUr8... `
- Protocol parameter overrides: `sandbox-override-parameters.hjson`

Debug stack manually: `docker compose up -d`, `docker compose logs api sync`, `docker compose down -v` to reset chain state.

## Test structure (`apps/desktop-e2e/src`)

- `features/*.feature` — Gherkin scenarios (Prettier formats these via prettier-plugin-gherkin)
- `steps/` — step definitions (async/await TypeScript)
- `pages/` — page objects with selectors
- `cucumber.cjs` — parallel 3 local / 2 CI, retry 2 on CI, failFast; reports in `test-results/cucumber-report.{html,json}`

## Debugging tips

- failFast stops the run at the first failing scenario — the report may under-count failures.
- CI runs e2e only on manual `workflow_dispatch` (`.github/workflows/e2e.yaml`); it won't block normal pushes.
- Flaky steps usually race the indexer: TzKT lags the node by a block — poll/wait on the TzKT API, not the node.
