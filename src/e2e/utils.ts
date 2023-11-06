import { Page, test, expect } from "@playwright/test";
import { RawPkh } from "../types/Address";
import { exec } from "child_process";
import { getAccounts } from "../utils/tezos";
import { DefaultNetworks } from "../types/Network";

const TEST_NETWORK = {
  name: "Test net",
  rpcUrl: "http://0.0.0.0:20000",
  tzktApiUrl: "http://0.0.0.0:5000",
  tzktExplorerUrl: "http://unavailable",
  buyTezUrl: "",
};

export const cleanupState = () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
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
  });
};

export const MASTER_PASSWORD = "12345678";

export const loginAs = async (mnemonic: string, page: Page) => {
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
  expect(page.getByRole("heading", { name: "Derivation Path" })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();

  const password = "12345678";
  await page.getByTestId("password").fill(password);
  page.getByLabel("Confirm Password").fill(password);

  await page.getByRole("button", { name: "Submit" }).click();

  await page.waitForURL("/#/home");
};

export const startNode = () =>
  new Promise((resolve, reject) => {
    exec("docker-compose up --wait", error => {
      if (error) {
        return reject(error);
      }
      resolve(undefined);
    });
  });

export const killNode = () =>
  new Promise((resolve, reject) => {
    exec("docker-compose kill && docker-compose down", error => {
      if (error) {
        return reject(error);
      }
      resolve(undefined);
    });
  });

// this should be called before each test that uses the blockchain/indexer
// we need to make sure that each test has a clean state
// such tests should be run sequentially to avoid conflicts/race conditions/etc.
// this thing takes ~15 secs to run so it should be used only when necessary
// if the test doesn't involve any blockchain/indexer interaction then do not call this function
export const resetBlockchain = () => killNode().then(startNode);

export const topUpAccount = async (account: RawPkh, tez: string) => {
  let accountInfo = await getAccounts([account], TEST_NETWORK);
  const prevBalance = accountInfo[0]?.balance;

  await new Promise((resolve, reject) => {
    // alice is a bootstrapped account on flextesa with lots of Tez
    exec(
      `docker-compose exec -T flextesa octez-client --wait none transfer ${tez} from alice to ${account} --burn-cap 1`,
      error => {
        if (error) {
          return reject(error);
        }
        resolve(undefined);
      }
    );
  });

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
        console.log("currUpdateTime", currTimeUpdated, "prevUpdateTime", prevTimeUpdated);
        if (currTimeUpdated !== prevTimeUpdated) {
          clearInterval(interval);
          resolve(undefined);
        }
      });
    }, 500);
  });
};
