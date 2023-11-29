import { execSync } from "child_process";
import crypto from "crypto";

import { Page, expect, test } from "@playwright/test";

import { RawPkh } from "../types/Address";
import { DefaultNetworks } from "../types/Network";
import { getAccounts } from "../utils/tezos";

const TEST_NETWORK = {
  name: "Test net",
  rpcUrl: "http://0.0.0.0:20001",
  tzktApiUrl: "http://0.0.0.0:5000",
  tzktExplorerUrl: "http://unavailable",
  buyTezUrl: "",
};
export const MASTER_PASSWORD = "12345678";

const DOCKER_COMPOSE_FILE = process.env.CI ? "docker-compose.ci.yaml" : "docker-compose.yaml";

// it's created by default on flextesa
export const AliceAccount = {
  pk: "edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn",
  pkh: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
  secretKey: "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq",
};

export const cleanupState = () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    global.crypto = crypto as any;
    const networks = {
      available: [...DefaultNetworks, TEST_NETWORK],
      current: TEST_NETWORK,
    };
    page.addInitScript(networks => {
      localStorage.clear();

      localStorage.setItem(
        "persist:root",
        JSON.stringify({
          networks,
          _persist: '{"version":-1,"rehydrated":true}',
        })
      );
    }, JSON.stringify(networks));

    resetBlockchain();
  });
};

export const onboardWithExistingMnemonic = async ({
  mnemonic,
  page,
  derivationPath,
}: {
  mnemonic: string;
  page: Page;
  derivationPath?: string;
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Get started" }).click();

  expect(page.getByRole("heading", { name: "Accept to Continue" })).toBeVisible();
  await page.getByText(/I confirm/).click();

  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "I already have a wallet" }).click();
  await page.getByRole("button", { name: "Import with Seed Phrase" }).click();
  const words = mnemonic.split(" ");
  for (let i = 0; i < words.length; i++) {
    await page.getByRole("textbox").nth(i).fill(words[i]);
  }
  await page.getByRole("button", { name: "Continue" }).click();

  expect(page.getByRole("heading", { name: "Name Your Account" })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();

  expect(page.getByRole("heading", { name: "Derivation Path" })).toBeVisible();
  if (derivationPath) {
    await page.getByTestId("select-input").click();
    await page.getByText(derivationPath).click();
  }
  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByTestId("password").fill(MASTER_PASSWORD);
  page.getByLabel("Confirm Password").fill(MASTER_PASSWORD);

  await page.getByRole("button", { name: "Submit" }).click();

  await page.waitForURL("/#/home");
};

export const startNode = async () => {
  execSync(`docker compose -f ${DOCKER_COMPOSE_FILE} up --wait`);
};

export const killNode = async () =>
  execSync(
    `docker compose -f ${DOCKER_COMPOSE_FILE} kill && docker compose -f ${DOCKER_COMPOSE_FILE} down`
  );

// this should be called before each test that uses the blockchain/indexer
// we need to make sure that each test has a clean state
// such tests should be run sequentially to avoid conflicts/race conditions/etc.
// this thing takes ~15 secs to run so it should be used only when necessary
// if the test doesn't involve any blockchain/indexer interaction then do not call this function
export const resetBlockchain = () => {
  killNode();
  startNode();
};

export const topUpAccount = async (account: RawPkh, tez: string) => {
  let accountInfo = await getAccounts([account], TEST_NETWORK);
  const prevBalance = accountInfo[0]?.balance;

  // alice is a bootstrapped account on flextesa with lots of Tez
  execSync(
    `docker compose exec -T flextesa octez-client --wait none transfer ${tez} from alice to ${account} --burn-cap 1`
  );

  // wait until the balance has updated
  let currBalance = prevBalance;
  while (prevBalance === currBalance) {
    accountInfo = await getAccounts([account], TEST_NETWORK);
    currBalance = accountInfo[0]?.balance;
  }
};

export const refetch = async (page: Page) => {
  const getLastTimeUpdated = () => {
    try {
      const state = JSON.parse(localStorage.getItem("persist:root") as string);
      return JSON.parse(state.assets).lastTimeUpdated;
    } catch {
      // if the assets are not yet loaded then the lastTimeUpdated is not set
      return "";
    }
  };

  const prevTimeUpdated = await page.evaluate(getLastTimeUpdated);

  await page.getByTestId("refetch-button").click();

  // wait until the lastTimeUpdated has changed
  return new Promise(resolve => {
    const interval = setInterval(() => {
      page.evaluate(getLastTimeUpdated).then(currTimeUpdated => {
        if (currTimeUpdated !== prevTimeUpdated) {
          clearInterval(interval);
          resolve(undefined);
        }
      });
    }, 100);
  });
};
